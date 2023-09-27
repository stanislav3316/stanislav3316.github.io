---
title: "Coupling and Cohesion"
date: 2023-09-27T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Coupling and cohesion

### Cohesion

Cohesion is a concept that refers to the degree to which the elements (such as functions, classes, or modules) within a software component or module are related to each other and perform a specific, well-defined, and focused set of tasks. (it is a crucial principle for designing maintainable, modular, and understandable software systems)

### Coupling

Coupling in software refers to the degree of connection between different modules or components in a software system. It measures how closely one module relies on or interacts with another. Low coupling is desirable because it leads to more modular and maintainable code, while high coupling can make a system more complex and harder to modify (because we don't need to modify another module when making changes to one).

--

![!\[Alt text\](../assets/img/27-09-2023-coupling-and-cohesion/1.jpeg)](/8/1.jpg)

## Conclusion

Coupling measures how modules rely on each other, while cohesion assesses how well tasks within a module fit together (striving for low coupling and high cohesion is key to constructing a robust and modular system).

## Further Reading
1. [Different ways of couplings](https://stanislav3316.github.io/posts/21-09-2023-different-couplings/)
