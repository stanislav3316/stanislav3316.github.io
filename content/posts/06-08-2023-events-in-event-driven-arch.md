---
title: "Events in Event-Driven architecture"
date: 2023-08-06T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

### Event types
Building Event-Driven or Asynchronous architecture it's important to pay a lot of attention to events in the system.
They are core elements of data flows, and should be designed properly and with care. Any futrher refactoring of these events will be painful and difficult - strict structure is our helper.

There are event types:
 - CUD events (create-update-delete, they carry information about changes of the entities (aggregates) in the system)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/1.jpeg)

The main reason for CUD events is streaming data through the system to have different local data replicas for local usage. It helps us to eliminate network calls and use local DB instead (warehouse can access user's data locally).

 - Domain events (Business events, related to a specific domain)
![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/2.jpg)

The domain events are about business processes and triggers. They help us to build coordination between services and accomplish business goals.

---

### Delta or full payload
Events can carry the whole payload or delta only (changed parts only). The right choice depends on business/technical requirements and cases. Moreover, full event's payload helps us to re-play events for new services, and sometimes not to store local state because full state is in every event you have to work with.

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/3.jpg)

---

### Structure and event's rules
There are different types of events and all of them should be under constraints and follow these rules:
 - name in past tense (ReportFilled, CardExpired, ....)
 - immutable
 - should have schema and version (evolving)
 - have separated data (payload) and meta (created_at, event_id, ...) blocks of a event (do not mix it)

(To break these rules you should fully understand you business domain and own bounded context where are events)


It's important to have unified structure with evolution, changeability possibilities. So, it's always better to enrich events with meta information along with data or payload block. Meta block helps us to manage, evolve events and handle them in idempotency and the right way.
```
{
  "data | payload": {...},
  "meta": {
    "created_at": ...,
    # or schema_id as ref
    "schema": {
      "name": "...",
      "version": "..."
    },
    "trace_id": "",
    "owner_id": "",
    "event_id": "",
    "parent_event_id": "...",
    ...
  }
}
```


1. "data or payload" - carries event's information about what happened in the system (this block is versioning using "meta.schema")
2. "meta.created_at" - time when event was created
3. "meta.schema" or "meta.schema_id" - schema of the data (payload) block
4. [optional] "meta.trace_id" - for tracing (Jaeger, ...)
5. [optional] "meta.owner_id" - the owner of the event
6. "meta.event_id" - unique event identificator for idempotency
7. [optional] "meta.parent_event_id" - parent identificator for ordering or chains


---

### Anti-corruption layer
![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/4.jpg)

When you got events from external system, different bounded context or send events outside it's important not to send events as is.
Instead, use different event's models not internal ones (to make system flexible and robust for further changes).

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
