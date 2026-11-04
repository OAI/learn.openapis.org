import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import YAML from "yaml";
import { validate, setMetaSchemaOutputFormat } from "@hyperjump/json-schema/draft-2020-12";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { describe, test, expect } from "vitest";

const HTTP_METHODS = ["get", "put", "post", "delete", "options", "head", "patch", "trace", "query"];
const folder = "./examples/arazzo/v1.1/";

const parseYamlFromFile = (filePath) => YAML.parse(readFileSync(filePath, "utf8"), { prettyErrors: true });

setMetaSchemaOutputFormat(BASIC);

// validate() expects a local file path, so we need to download the schema first.
const schema = await fetch("https://spec.openapis.org/arazzo/1.1/schema/2026-04-15");
writeFileSync("./tests/arazzo-v1.1/schema.json", await schema.text());

const validateArazzo = await validate("./tests/arazzo-v1.1/schema.json");

const entryDocuments = readdirSync(folder, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name === "arazzo.yaml")
    .map((entry) => join(entry.parentPath, entry.name));

// Everything below is what the JSON Schema cannot check: that the names used
// in a workflow actually exist.
const operationsIn = (document) => {
    const operations = new Map(Object.keys(document.operations ?? {}).map((id) => [id, {}]));
    Object.values(document.paths ?? {}).forEach((pathItem) => {
        HTTP_METHODS.filter((method) => pathItem[method]?.operationId).forEach((method) => {
            operations.set(pathItem[method].operationId, { pathItem, operation: pathItem[method] });
        });
    });
    return operations;
};

const stringsIn = (value) => {
    if (typeof value === "string") return [value];
    if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
    return [];
};

const matchesIn = (value, pattern) => stringsIn(value).flatMap((text) => [...text.matchAll(pattern)]);

const pointer = (document, ref) => ref.replace(/^#\//, "").split("/").reduce((node, key) => node?.[key], document);

describe("Arazzo 1.1 - Validate examples", () => {
    test("at least one example exists", () => {
        expect(entryDocuments.length).toBeGreaterThan(0);
    });

    describe.each(entryDocuments)("%s", (filePath) => {
        const description = parseYamlFromFile(filePath);
        const sources = new Map(description.sourceDescriptions.map((source) => {
            const document = parseYamlFromFile(resolve(dirname(filePath), source.url));
            return [source.name, { document, operations: operationsIn(document) }];
        }));

        const findOperation = (operationId) => {
            const qualified = operationId.match(/^\$sourceDescriptions\.([^.]+)\.(.+)$/);
            if (qualified) {
                const source = sources.get(qualified[1]);
                return source && { source, target: source.operations.get(qualified[2]) };
            }
            expect(sources.size, `${operationId} must be qualified with more than one source`).toBe(1);
            const [source] = sources.values();
            return { source, target: source.operations.get(operationId) };
        };

        // Replaces each Reusable Object with the component it references.
        const expand = (items = []) => items.map((item) => {
            if (!item.reference) return item;
            const [, type, name] = item.reference.split(".");
            const component = description.components?.[type]?.[name];
            expect(component, item.reference).toBeDefined();
            return item.value === undefined ? component : { ...component, value: item.value };
        });

        const inputsOf = (workflow) => {
            const schemas = [workflow.inputs, workflow.inputs?.$ref && pointer(description, workflow.inputs.$ref)];
            return schemas.flatMap((schema) => Object.keys(schema?.properties ?? {}));
        };

        test("conforms to the schema", () => {
            expect(validateArazzo(description, BASIC).valid).toBe(true);
        });

        describe.each(description.workflows.map((workflow) => [workflow.workflowId, workflow]))("%s", (_, workflow) => {
            const stepIds = workflow.steps.map((step) => step.stepId);
            const workflowIds = description.workflows.map((candidate) => candidate.workflowId);
            const workflowParameters = () => expand(workflow.parameters);

            test("step operations exist and required parameters are supplied", () => {
                workflow.steps.filter((step) => step.operationId).forEach((step) => {
                    const found = findOperation(step.operationId);
                    expect(found?.target, `${step.stepId} targets ${step.operationId}`).toBeDefined();

                    const supplied = [...workflowParameters(), ...expand(step.parameters)]
                        .map((parameter) => `${parameter.in}:${parameter.name}`);
                    [...(found.target.pathItem?.parameters ?? []), ...(found.target.operation?.parameters ?? [])]
                        .map((parameter) => (parameter.$ref ? pointer(found.source.document, parameter.$ref) : parameter))
                        .filter((parameter) => parameter.required)
                        .forEach((parameter) => expect(supplied).toContain(`${parameter.in}:${parameter.name}`));
                });
            });

            test("called workflows exist and receive declared inputs", () => {
                workflow.steps.filter((step) => step.workflowId).forEach((step) => {
                    const target = description.workflows.find((candidate) => candidate.workflowId === step.workflowId);
                    expect(target, `${step.stepId} calls ${step.workflowId}`).toBeDefined();
                    expand(step.parameters).forEach((parameter) => {
                        expect(parameter.in, `${parameter.name} maps to an input`).toBeUndefined();
                        expect(inputsOf(target)).toContain(parameter.name);
                    });
                });
            });

            test("action targets and dependencies exist", () => {
                workflow.steps.forEach((step) => {
                    [...expand(step.onSuccess), ...expand(step.onFailure)]
                        .filter((action) => action.stepId)
                        .forEach((action) => expect(stepIds).toContain(action.stepId));
                    (step.dependsOn ?? []).forEach((stepId) => expect(stepIds).toContain(stepId));
                });
                (workflow.dependsOn ?? []).forEach((workflowId) => expect(workflowIds).toContain(workflowId));
                expand(workflow.failureActions);
                expand(workflow.successActions);
            });

            test("$inputs references are declared", () => {
                const expanded = workflow.steps.map((step) => ({ ...step, parameters: expand(step.parameters) }));
                matchesIn([expanded, workflowParameters()], /\$inputs\.([A-Za-z0-9_-]+)/g).forEach((match) => {
                    expect(inputsOf(workflow)).toContain(match[1]);
                });
            });

            test("$steps references resolve to declared outputs", () => {
                matchesIn([workflow.steps, workflow.outputs], /\$steps\.([^.]+)\.outputs\.([A-Za-z0-9_-]+)/g).forEach((match) => {
                    const step = workflow.steps.find((candidate) => candidate.stepId === match[1]);
                    expect(step, `step ${match[1]}`).toBeDefined();
                    expect(Object.keys(step.outputs ?? {})).toContain(match[2]);
                });
            });

            test("$workflows references resolve to declared outputs", () => {
                matchesIn(workflow.steps, /\$workflows\.([^.]+)\.outputs\.([A-Za-z0-9_-]+)/g).forEach((match) => {
                    const target = description.workflows.find((candidate) => candidate.workflowId === match[1]);
                    expect(target, `workflow ${match[1]}`).toBeDefined();
                    expect(Object.keys(target.outputs ?? {})).toContain(match[2]);
                });
            });
        });
    });
});
