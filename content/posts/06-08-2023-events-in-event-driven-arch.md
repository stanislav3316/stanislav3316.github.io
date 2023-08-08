---
title: "Events in Event-Driver Architecture"
date: 2023-08-06T09:03:20-08:00
draft: false
---

### Event types
Building Event-Driven or Async architecture it's important to pay a lot of attention to events in the system.
They are core elements of data flows, and should be designed properly and with care. Any futrher refactoring of these events will be painful and difficult - strict structure is our helper.

There are event types:
 - CUD events (create-update-delete, it carries full information about changes of the entities in the system)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/1.jpeg)

The main reason for CUD events is streaming data through the system to have different local data replicas for local usage. It helps us to eliminate network calls and use local DB instead (warehouse can access user's data locally).

 - Domain events (Business events, related to a specific domain)
![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/2.jpg)

The domain events are about business processes and triggers. They help us to build coordination between services and accomplish business goals.

---

### Delta or full payload
Events can carry the whole payload or delta only. The right choice depends on business requirements and cases. Moreover, full event's payload helps us to re-play events fro new services, and something not to store local state.

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/3.jpg)

---

### Structure and event's rules
There are different types of events and all of them should be under some constraints and follow these rules:
 - name in past tense (ReportFilled, CardExpired, ....)
 - immutable
 - should have schema and version (evolving)
 - have separated data (payload) and meta (created_at, event_id, ...) blocks of a event (do not mix it)

(To break these rules you should fully understand you business domain and own bounded context where are events.)


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
7. [optional] "meta.parent_event_id" - parent identificator for ordering


---

### Anti-corruption layer
![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/4.jpg)

When you got events from external system, different bounded context or send events outside it's important not to send events as is.
Instead, use different event's models not internal ones (to make system flexible and robust).

## Conclusion
- carefully approach the design of events
- think about evolvability
- learn more about your domain and bounded context


## Links
1. [Cloud Events Specification](https://cloudevents.io)
2. [Anti-corruption Layer pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer)
3. [Event-Driven](https://martinfowler.com/articles/201701-event-driven.html)
