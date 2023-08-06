---
title: "Events in Event-Driver Architecture"
date: 2023-08-06T09:03:20-08:00
draft: false
---
## Introduction

Building Event-Driven or Async architecture it's important to pay a lot of attention to events in the system.

There are diffrent event types:
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
    "schema": {
      // or schema_id as ref
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

