---
layout: default
title: Introduction
nav_order: 2
---


# Introduction

The **OpenAPI Specification** allows the description of a remote API accessible through HTTP or HTTP-like protocols. This chapter explains why this is a good thing and why it might interest you.

The concept of an "API" is described first and the advantages of describing APIs using a machine-readable format are introduced, followed by the benefits of using the OpenAPI format. In the last section, the evolution of API descriptions is put into perspective with a brief historical summary.

If you are already familiar with the benefits of machine-readable API descriptions and the OpenAPI in particular you may skip ahead to the next chapter, [The OpenAPI Specification explained](specification).

## What Is an API?

An **Application Programming Interface** (API) defines the allowed interactions between **two pieces of software**, just like a User Interface defines the ways in which a user can interact with a program.

An API is composed of the list of possible methods to call (requests to make), their parameters, return values and any data format they require (among other things). This is equivalent to how a user's interactions with a mobile phone app are limited to the buttons, sliders and text boxes in the app's User Interface.

APIs can be **local**, where both interacting parties run on the same machine. For example, the Windows API offered by the Operating System to its applications, the Standard C Library offered by any C compiler to the programs being compiled, or the TensorFlow API offered by this machine learning library to programs using it.

This documentation, though, focuses on **remote** APIs, where the interacting parties run on separate machines and communicate over a network. For example, a public weather service offering up machine-readable forecasts to be consumed by web pages or mobile applications, or Twitter allowing third-party applications to send messages through its network.

To wrap up the definitions, the party offering up its services through an API is called the **provider** and the one requesting these services is the **consumer**.

Using APIs is an everyday practice in computer science since their benefits are unquestionable. To name only the most prominent:

- APIs provide **information hiding**: neither side of the API (the provider and the consumer) know the implementation details of the other one. As long as both adhere to the API, they can be changed as much as needed without the other party even noticing.

- APIs are also called **Contracts**, because they are assumed to be unbreakable: The provider **promises** not to change its API and to keep honoring it in the years to come. With this promise in hand consumers can start developing their parts and rely on the functionality offered up by the API with confidence.

Now, in order for all involved parties to adhere to the same API it has to be precisely defined. The next section describes how this has traditionally been achieved.

## API Definition Through Documentation

APIs are typically accompanied by a **reference guide**; a piece of literature explaining to a developer how to use the API.

Unfortunately, everybody working on software development is familiar with one or more of the following problems:

- Unclear documentation, leading to mistakes due to interpretation differences.
- Incomplete or non-existing documentation.
- Outdated information.
- Information in a language the reader does not understand.

In these cases, to find the information they require developers might have to read source code (if available), debug programs or analyze network traffic, which are gigantic **time sinks**.

Furthermore, errors in the usage of an API defined through its documentation cannot be discovered until runtime, which is another time sink.

The next section shows how some of these problems can be alleviated by specifying APIs in a format that automated tools can use.

## API Definition Through a Description File

An **API description file** (sometimes called Contract) is a **machine-readable** specification of an API. It should strive to be as **complete**, and **fully-detailed** as possible, although absolute completeness is not usually a requirement. Also, just like legal contracts, the more **unambiguous** it is, the more useful it becomes.

Its main advantage over documentation which only humans can read is that it enables **automated processing**, opening the door to the benefits listed at [the beginning of this guide](start-here).

To begin with, documentation for humans including the list of available methods and their details can be easily generated from the API description file. Done as a step in the build process, this easily prevents out-of-sync docs.

Furthermore, a tool can use the API description to **generate boilerplate code** (in any programming language) to build provider and consumer applications. Only the business logic needs to be added and the generated code takes care of all the API handling, removing another source of mistakes and making sure that the code and the documentation match.
Additionally, if the data passed to the API must satisfy any constraint it can be automatically verified by the boilerplate code, removing even more manual code.

To name only another possibility, the API description file might include examples, and these examples can be used as responses from **auto-generated mock servers**. This enables early API testing, even before the API provider code is written.

For all the above reasons and many more it is highly advisable to use a machine-readable description when designing a new API.

Over the years several API description formats (called Specifications) emerged. The following section lists the benefits of **OpenAPI**, the most widely used specification when creating new APIs.

## The OpenAPI Specification

The OpenAPI Specification (**OAS**) is a **vendor neutral** description format for HTTP-based remote APIs. It was originally based on the Swagger 2.0 Specification, donated by SmartBear Software in 2015.

Currently, the OAS is maintained, evolved and promoted by the OpenAPI Initiative (**OAI**), a consortium of industry experts with an open governance structure under the Linux Foundation umbrella. This means all meetings and decisions are public and changes to the OAS can be proposed and discussed by anyone.

This openness has encouraged the creation of a vast amount of tools (take a look at [the OpenAPI tools list](https://tools.openapis.org/), for example) which perfectly showcase the power of open, machine-readable API descriptions (called **documents** in OpenAPI).

It's probably because of the amount of tools available when working with OpenAPI that it has become **the most broadly adopted industry standard for describing modern APIs**.

It is also worth mentioning that the OAS does not aim at being able to describe **every possible API**, since doing so would require a rather large and unwieldy specification. Instead, it tries to **describe efficiently the most common use cases**. Still, the benefits provided by OpenAPI are so numerous that it is usually worth it to design your API so it can be fully defined using the OAS.

If parts of your API cannot be described using the OAS, and they cannot be redesigned, they can still be left out of the OAS document: OpenAPI lists operations that you can do, but it does not assert anything regarding operations not in the OAS document.

Finally, OpenAPI can describe APIs based on the HTTP protocol (like RESTful ones) but also APIs based on **HTTP-like protocols** like CoAP (Constrained Application Protocol) or WebSockets. This allows OpenAPI to be used in resource-restricted scenarios like IoT (Internet of Things), for example.

Feel free to jump now to the next chapter, [The OpenAPI Specification explained](specification), to start learning how to use the OAS. Or stay a bit longer to gain historical perspective with a comparison of the evolution of local and remote API descriptions.

## A Brief Historical Comparison

**Machine-readable API descriptions are not a new thing**, they have been present in local APIs for a long time: For instance, C has method signatures and higher-level languages like Java or C# have Interface definitions. The remote API descriptions shown in this page serve exactly the same purpose and this section should make it clearer what this purpose is to readers more familiar with traditional local APIs.

In the dawn of computer science there existed only the **Assembly Language**. In this language, to call a method provided by another developer, you write your parameters in some agreed-upon memory address using an agreed-upon format and then you transfer control of the program to another agreed-upon memory address. Eventually control returns to your program and you can retrieve any results from yet another agreed-upon memory address.

As you can see, there are a lot of items to agree upon, and all of them must be properly **documented**. A mistake or misunderstanding in any of these items is undetectable while writing the code, and they lead to runtime issues ranging from program malfunction to system crashes.

Fortunately, higher-level languages were created which, among other things, provide **method signatures**. These signatures are part of the code and are therefore **machine-readable**, allowing for compile-time detection of mismatches: The API provider publishes the signatures of all its methods and the consumer's compiler ensures that the API is used correctly (to a greater extent than documentation alone).

Later on, the Internet arrived and with it appeared **remote APIs**. HTTP-based APIs, for instance, request a certain resource from a server and expect the response to contain information in a certain format. Initially all this was specified through documentation and the **same problems that existed in the Assembly language** resurfaced again, namely, if the request was not made in the format expected by the server things would not work, and errors could not be detected at compile-time.

Machine-readable API descriptions (including **OpenAPI**) were then invented to bring to remote APIs the same degree of robustness that method signatures brought to local APIs. Tools do exist now which check that requests are made in the correct format, or even ensure it by generating the request code themselves.

The benefits delivered by machine-readable descriptions of remote APIs, though, have far surpassed those of method signatures. For instance, OpenAPI can attach examples and notes to most API sections, to complement the automatically-generated documents, or reuse parts of the description to make the whole file leaner.

Learn about all these capabilities and more in the next chapter, [The OpenAPI Specification explained](specification).
