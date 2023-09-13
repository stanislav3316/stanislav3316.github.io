---
title: "Events communication in Event-Driven architecture"
date: 2023-08-14T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Events communication in Event-Driven architecture

### 1. Queus (RabbitMQ, ...)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/1.jpg)

In queues case, service sends events to queue broker and broker can send events to all binded queus (fanous), or to only one business process queue.
> consider use insrastructure-as-code pattern to achieve maintainability and simplicity

Pros:
- event is in queue until app's consumer processed it (queue doesn't persist events when they were already processed)
- low latency approach
- simple publish-subscribe pattern

Cons:
- no way how to re-process old events (they are deleting after being processed)
- difficult to organise retry logic
- difficult consumer scaling logic (to read events from one queue and shard event by some criteria like entity ID)

### 2. Messages log (Kafka, ...)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/2.jpg)

In Topics case, server sends events to broker and broker persists events in specified topics (regarding kafka, in specified partitions too based on partition key).
> consider use insrastructure-as-code pattern to achieve maintainability and simplicity

Pros:
- events can be easily re-processed (all events are persisted)
- data inside topics can be partitioned using partition key (kafka partitions)
- simple consumer scaling logic (based on assigment topic's partitons to different node's instances)

Cons:
- difficult to organise retry logic (but processing can be stopped until failure would be fixed)
- persist all received events (volume)
- partition key should be carefully be chosen
- more sophisticated settings

### 3. Webhooks (Rest)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/3.jpg)

In Webhooks case, service sends events on specified/registered REST endpoint, so that app could process them.

Pros:
- simple publish-subscribe pattern
- good integration pattern for external systems
- no DevOps activities

Cons:
- network and external service outage cases should be covered with long retries
- high latency approach
- you have to implement callback URL registering / updating logic for external systems
- no way how to re-process old events

### 4. Polling (Rest)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/4.jpg)

In polling case, external system or app periodically calls GET /events endpoint to receive the latest events.

Pros:
- simple publish-subscribe pattern
- good integration pattern for external systems
- no DevOps activities

Cons:
- netfork and external service outage cases should be covered with long retries
- high latency approach
- no way how to re-process old events

### 5. WS / SSE / HTTP/2.0

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/5.jpg)

In WS / SSE / HTTP/2.0 case, external system or app established long living connections to receive events stream.

Pros:
- low latency approach
- no DevOps activities

Cons:
- you have to think over acknowledge event's logic (guarantee delivery)
- you have to think over ping/pong messages so that conection could be closed in case of inactivity for long time
- difficult to organise retry logic
- difficult consumer scaling logic

## Conclusion
Each option has trade-offs to consider in you architecture and domain.
So that you could make right choice, make sure you think over you DevOps environment, team's  expertise, business and domain restrictions.

## Further Reading
1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
2. [Publisher-Subscriber pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber)
