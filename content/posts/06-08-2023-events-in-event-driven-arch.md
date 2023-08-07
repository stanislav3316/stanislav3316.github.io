---
title: "Events in Event-Driver Architecture"
date: 2023-08-06T09:03:20-08:00
draft: false
---
## Introduction

Building Event-Driven or Async architecture it's important to pay a lot of attention to events in the system.
They are core elements of data flows, and should be designed properly and with care. Any futrher refactoring of these events will be painful and difficult - structure is our helper.

There are event types:
 - CUD events (create-update-delete, it carries full information about changes of the entities in the system)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/1.jpeg)

The main reason for CUD events is streaming data through the system to have different local data replicas for local usage (user data, as example, in warehouse service). It helps us to eliminate network calls and use local DB instead.

 - Domain events (Business events, related to a specific domain)
![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/2.jpg)

The domain events are about business processes and triggers. They help us to build coordination between services and accomplish business goals.


----

There are different types of events and all of them should be under some constraints and follow these rules:
 - name in past tense (ReportFilled, CardExpired, ....)
 - immutable
 - should have schema and version (evolving)
 - have separated data (payload) and meta (created_at, event_id, ...) blocks of a event (do not mix it)



It's important to have unified structure with evolution, changeability possibilities. And it's always better to enrich events with meta information along with data or payload block. Meta block helps us to manage, evolve events and handle them in idempotency and the right way.
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


## Conclusion