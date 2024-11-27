import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import YAML from "yaml";
import { validate, setMetaSchemaOutputFormat } from "@hyperjump/json-schema/openapi-3-0";
import { BASIC } from "@hyperjump/json-schema/experimental";
import { describe, test, expect } from "vitest";

const parseYamlFromFile = (filePath) => {
    const schemaYaml = readFileSync(filePath, "utf8");
    return YAML.parse(schemaYaml, { prettyErrors: true });
};

setMetaSchemaOutputFormat(BASIC);

// validate() expects a local file path, so we need to download the schema first.
const schema = await fetch('https://spec.openapis.org/oas/3.0/schema/2024-10-18');
writeFileSync('./tests/v3.0/schema.json', await schema.text());

const validateOpenApi = await validate('./tests/v3.0/schema.json');
const folder = './examples/v3.0/';

describe("v3.0 - Validate examples", async () => {
    readdirSync(folder, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /\.yaml$/.test(entry.name))
        .forEach((entry) => {
            test(entry.name, () => {
                const instance = parseYamlFromFile(folder + entry.name);
                const output = validateOpenApi(instance, BASIC);
                expect(output.valid).to.equal(true);
            });
        });
});
