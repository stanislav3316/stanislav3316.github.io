---
title: "Events in Event-Driven architecture"
date: 2023-08-06T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Inhabitants of Event-Driven architecture

In Event-Driven architecture there are two main inhabitants:
1. commands - intention to apply some actions / changes
2. events - what already happened in the system

Building Event-Driven architecture it's important to pay a lot of attention to events in the system.
They are core elements of data flows, and should be designed properly and with care. Any futrher refactoring of these events will be painful and difficult.

There are different types of events.

## 1. CUD events (create-update-delete)

CUD events carry information about changes of the entities (aggregates) in the system

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/1.jpeg)

The main reason for CUD events is streaming data through the system to have different local data replicas for local usage. It helps us to eliminate network calls and use local DB instead (warehouse can access user's data locally).

### Delta or full payload for CDC events

Events can carry the whole payload or delta only (changed parts only). The right choice depends on business/technical requirements and cases. Moreover, full event's payload helps us to re-play events for new services, and sometimes not to store local state because full state is in every event you have to work with.

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/3.jpg)

## 2. Domain events (Business events, related to a specific domain)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/2.jpg)

The domain events are about business processes and flows. They help us to build coordination between participants to accomplish business goals. Such events hold a full information about what happened in the business domain.

## 3. Notification events

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/4.jpg)

Notification events carry only information about event type and how to access this information (usually by making /GET request to the specified endpoint).

It helps to get the latest information using provided link and may require authorization mechanisms to access the payload (for external systems, as example).

## Structure and event's rules

There are different types of events and all of them should stick to these constraints:
 - name in past tense (ReportFilled, CardExpired, ....)
 - immutable
 - should have schema and version (to have evolving possibility)
 - have separated data (payload) and meta (created_at, event_id, ...) blocks of a event (do not mix it)

> To break these rules you should fully understand you business domain, teams communications map and risks)

It's always important to have unified structure to keep up with evolution, changeability possibilities. So, it's better to enrich events with `meta` information along with `payload` block. `Meta` block helps us to manage, evolve events and handle them in idempotent way.

{{< highlight "linenos=table" >}}
{
  "payload": {...},
  "meta": {
    "event_id": "",
    "created_at": ...,
    "schema": {
      "name": "...",
      "version": "..."
    },
    "trace_id": "",
    "owner_id": "",
    "parent_event_id": "...",
    ...
  }
}
{{< /highlight >}}

1. "payload" - carries event's information about what happened in the system (this block is versioning using "meta.schema")
2. "meta.event_id" - unique event identificator for idempotency
3. "meta.created_at" - time when event was created
4. "meta.schema" or "meta.schema_id" - schema of the `payload`
5. [optional] "meta.trace_id" - for tracing (Jaeger, ...)
6. [optional] "meta.owner_id" - the owner of the event
7. [optional] "meta.parent_event_id" - parent identificator for ordering or chains
8. ...

## Anti-corruption layer

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/5.jpg)

When you receive events from external systems or different bounded contexts, it's important not to use received events as is.
Instead, cast them into internal events to protect and fence your internal business logic from external changes (external system might change structure of it's events over time). It helps to make system more flexible and robust.

## Open host service

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/6.jpg)

When your service is publishing events, it's also important to protect your consumers from business logic changes (your internal events might be changed over time) and cast internal events into external events (defined into service protocol).

## Conclusion
- carefully approach the design of events (it's a core!)
- think about evolvability
- learn more about your domain and bounded context
- learn more about business/technical requirements and constraints


## Further Reading
1. [Cloud Events Specification](https://cloudevents.io)
2. [Anti-corruption Layer pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)
3. [Event-Driven](https://martinfowler.com/articles/201701-event-driven.html)
4. [What Is Event-Driven Architecture](https://blog.hubspot.com/website/event-driven-architecture#:~:text=Event%2Ddriven%20architecture%20(EDA),share%20information%20and%20accomplish%20tasks.)
