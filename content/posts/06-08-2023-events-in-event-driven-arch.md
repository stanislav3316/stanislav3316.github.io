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

 - Domain events (Business events, related to a specific domain)
![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/1/2.jpg)



----

We have different types of events, but they should be under some constraints and have rigit structure:
 - in past tense (ReportFilled, CardExpired, ....)
 - immutable
 - should have schema and version (evolving)
 - have separated data (payload) and meta (created_at, event_id, ...) blocks of a event (do not mix it)


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

