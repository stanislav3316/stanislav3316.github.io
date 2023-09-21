---
title: "Commands in Event-Driven architecture"
date: 2023-09-16T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Commands

A command is an intention to do, not something that has already happened in the system. Commands provide minimal but enough information for decision-making and can be sent synchronously or asynchronously.

![!\[Alt text\](../assets/img/16-09-2023-commands-in-event-driven-arch/1.jpeg)](/5/1.jpg)

Similar to events, commands should adhere to common principles and a structured format:
- use a verb-like syntax for their naming
- should include criteria, such as `command_id` for distinguishing them for idempotence
- should include criteria, such as `command_type` for applying actions based on different types (on consumer side for `commandBus` implementation)
- may include criteria, such as `expected_<entity>_version` for applying actions based on CAS (compare-and-swap) operations
- may include criteria, such as `trace_id` for enabling tracing capabilities
- ...

As example, `WithdrawUserWalletCommand`:

{{< highlight "linenos=table" >}}
{
    "command_id": "feabe53f-0444-4448-9dde-2f7d5e115da2",
    "command_type": "withdraw_wallet",
    "user_id": "1",
    "wallet_id": "abc",
    "amount": "100 USD",
    "expected_wallet_version": 7,
    "created_at": 1695309057,
    ...
}
{{< /highlight >}}

### Synchronous executions of commands

Commands can be executed in synchronous way using such ways like:
- Rest
- gRPC
- ...

It's common for commands to return the result of their execution, such as the last entity state or some outcome.

![!\[Alt text\](../assets/img/16-09-2023-commands-in-event-driven-arch/1.jpeg)](/5/2.jpg)

### Asynchronous executions of commands

Commands also can be executed in asynchronous way via messages buses or brokers:
- RabbitMQ
- kafka
- ...

![!\[Alt text\](../assets/img/16-09-2023-commands-in-event-driven-arch/1.jpeg)](/5/3.jpg)

In this scenario, the consumer may emit an event as a result of the command execution, indicating whether it was successful or not.

## Conclusion

Commands play a pivotal role in Event-Driven Architecture (EDA), serving as the triggers for actions within a distributed system. They offer a means of conveying intent, maintaining system reliability through idempotency, and fostering decoupling between components. As the backbone of EDA, understanding the significance and best practices of commands is essential for building resilient and responsive event-driven systems

## Further Reading

1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
2. [Delivery guarantee for events](https://stanislav3316.github.io/posts/31-08-2023-delivery-guarantee-for-events/)
