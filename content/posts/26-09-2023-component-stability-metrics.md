---
title: "Components stability in distributed systems"
date: 2023-09-26T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Components stability in distributed systems

Understanding the stability of components is crucial for making any changes to your system. 
So, it's essential to assess a component's stability using various metrics before proceeding with any modifications. 
Let's explore some of these metrics that can aid in measuring stability.

### Instability metric

Instability is a measure of how dependent a component is on other components, and how likely it is to be affected by changes in those components.
It can be easily calculated `I = (outgoing) / (outgoing + incoming)`

![!\[Alt text\](../assets/img/26-09-2023-component-stability-metrics/1.jpeg)](/7/1.jpg)

It's always better to keep this value as min as you can for the sake of the stability of your system (as much as you can of course).

### Chatty metric

Components that excessively communicative can be highly vulnerable to failures in other components, leading to a decrease in their own stability.

It might be caused by the following cases:

- sending synchronous commands to other components to apply some actions
- fetching information / aggregates to complete local business flow

![!\[Alt text\](../assets/img/26-09-2023-component-stability-metrics/1.jpeg)](/7/2.jpg)

In both cases there are signals to merge these components and perform these actions in local business/transaction flows (of course it's only signals to consider, not required actions).

To overcome some of these problems you can try using: 
- cache data pattern
- asynchronous communication pattern
- local data replications pattern for local usage and so on

### cyclic dependencies between components

Cyclic dependency means that outage of one service might affect another one and vice versa, so better to break this interconnections if possible.
Asynchronous communications patterns can help you to mitigate some consequences of cyclic dependency between components.  

![!\[Alt text\](../assets/img/26-09-2023-component-stability-metrics/1.jpeg)](/7/3.jpg)

### Transactional boundaries

If there is transactional behaviour/operation inside a components it's significant signal not to split it and keep it as is within single transactional boundaries.
One of the worst things in distributed systems is to use distributed transactions (two-phase commit etc.), better to avoid it.

![!\[Alt text\](../assets/img/26-09-2023-component-stability-metrics/1.jpeg)](/7/4.jpg)

## Conclusion

Before splitting components consider these metrics and keep in mind that better to have more coarse-grained services than fine-grained ones in operational and maintainability perspective.
Meanwhile, connected components form the system and components cannot be built in isolation, so it's about trade-offs.

## Further Reading
