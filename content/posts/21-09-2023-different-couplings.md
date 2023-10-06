---
title: "Different ways of couplings"
date: 2023-09-21T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Couplings

### Temporal coupling

Temporal coupling is a concept in software design and architecture that refers to a situation where two or more components or modules in a software system depend on each other with respect to the timing or sequence of their execution. In other words, these components are tightly coupled in terms of when they should be executed, which can lead to various issues in software development and maintenance. It's ok to have this type of coupling in your system but you should keep it in mind and control  it (not to get caught up in the distributed monolith).

- add item to the cart and pay for it

- synchronous call to another one service to apply some actions based on current business flow/process


![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/1.jpg)

### Functional coupling

Temporal coupling is a concept in software design and architecture that refers to a situation where two or more components or modules in a software system depend on some business logic. When we change these business logic we have to change it in all places for consistency.

- the same business validations rules

- the same way of creation aggreagtes like `User` with all checks and etc

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/2.jpg)

### Implementation coupling

Implementation coupling is a term used in software design and architecture to describe a type of coupling that occurs when different modules, components, or parts of a software system are tightly connected due to their shared implementation details. It means that these modules or components rely on specific details of each other's implementation, making them highly dependent on one another in terms of how they are coded or implemented.

- multiple components directly access a specific database table by writing raw SQL queries. Each component relies on the specific schema and structure of that table

-  multiple modules in a program read and write data directly to files, assuming a specific file format and path

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/3.jpg)

### Static coupling

Static coupling refers to a type of coupling in software design and architecture where two or more components, modules, or parts of a software system are interrelated at compile time or during the static analysis phase of development. This coupling occurs because the components have dependencies that are determined at the earliest stages of the software's lifecycle, often at compile time, and are not flexible or changeable at runtime.

- frameworks and libraries

- foreign keys in DBs

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/4.jpg)

### Dynamic coupling

Dynamic coupling is a term used in software design and architecture to describe a type of coupling between different components, modules, or parts of a software system that occurs at runtime. In dynamic coupling, the interaction between components is determined and established while the software is running, rather than being fixed at compile time or during static analysis (it helps to find communication dependencies in the system).

- synchronous and asynchronous calls between services (http/rpc/events)

- function/method calls in a single process

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/5.jpg)

### Afferent coupling

Afferent coupling is a software metric used in software engineering and software design to quantify and measure the number of external dependencies that a particular module or component has. In simpler terms, it counts how many other modules or components depend on a specific module. Afferent coupling provides insight into the complexity and potential impact of changes to a module or component within a software system (helps to calculate `distance from the main sequence` metric).

- auth service, user service and etc

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/6.jpg)

### Efferent coupling

Efferent coupling is a software metric used in software engineering and software design to measure and quantify the number of external modules or components that depend on a specific module or component. In other words, efferent coupling assesses how many other parts of the software system are directly influenced or used by a particular module (helps to calculate `distance from the main sequence` metric).

-- payment service and all payment providers

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/7.jpg)

### Through resources coupling

Through resources coupling is a infractucture coupling between different elements.

- like shared node CPU, Memory, files, DBs and etc

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/8.jpg)

### Semantic coupling

Semantic coupling, also known as content coupling or logical coupling, is a concept in software design and architecture that describes a type of coupling between different components or modules based on the meaning or semantics of the data they exchange.

- knowledges about shared protocol semantic (Websockets, files format, etc)

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/9.jpg)

### Deployment coupling 

Deployment coupling refers to a type of coupling in software architecture and design that occurs when different components or modules within a software system are tightly linked due to the way they are deployed or distributed across hardware or network resources. In other words, it reflects the degree to which the deployment of one component depends on the deployment of another component.

- case when upgrading of one service you have to upgrade another one too (as example, distributed modular monolith)

![!\[Alt text\](../assets/img/21-09-2023-different-couplings/1.jpg)](/6/10.jpg)

11. ...

## Conclusion

Managing and understanding these couplings are crucial for achieving modular, maintainable, and adaptable software systems. Reducing tight coupling and promoting loose coupling are key principles in software development to enhance flexibility and ease of maintenance.

## Further Reading
1. [Software package metrics](https://en.wikipedia.org/wiki/Software_package_metrics)
