---
title: "Components stability in distributed systems"
date: 2023-09-26T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Components stability in distributed systems

Understanding the stability of components is crucial before making any changes to your system. 
Therefore, it's essential to assess a component's stability using various metrics before proceeding with any modifications. 
Let's explore some of these metrics that can aid in measuring stability.

### Instability metric

Instability is a measure of how dependent a component is on other components, and how likely it is to be affected by changes in those components.
It can be easily calculated `I = (outgoing) / (outgoing + incoming)`

![!\[Alt text\](../assets/img/26-09-2023-component-stability-metrics/1.jpeg)](/7/1.jpg)

### Chatty metric

Components that excessively communicate can be highly susceptible to failures in other components, leading to a decrease in their own stability.

It is caused by the following cases:

- sending commands to other components to apply some actions
- fetching information / aggregates to complete local operations

In both cases there are signals to merge these components and perform these actions in local operation/transaction manners (of course it's only signals to consider, not required actions).

To avoid such situations you can consider using cached, asynchronous communication patterns and replication data to local usage. 

### Transactional boundaries

If there is transactional behaviour/operation inside a components it's significant signal not to split it and keep it as is within single transactional boundaries.

## Conclusion

Before splitting components consider these metrics and keep in mind that better to have more coarse-grained services than fine-grained ones in operational and maintainability perspective.

## Further Reading
