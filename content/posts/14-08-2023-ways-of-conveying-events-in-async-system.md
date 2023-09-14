---
title: "Events communication in Event-Driven architecture"
date: 2023-08-14T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Events communication in Event-Driven architecture

In this article we cover most popular approaches how to organize events communiction in the system.

### 1. Queus (RabbitMQ, ...)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/1.jpg)

In the case of queues, the application sends events to a queue broker, which then transfers these events to all bound queues (fan out), or to a single specified queue.

> consider use insrastructure-as-code pattern to achieve maintainability and simplicity

Pros:
- events remain in the queue until the application's consumer processes them (events being processed are deleted - clean up space)
- quite low latency approach
- simple publish-subscribe pattern
- message brokers decouple producers from consumers, allowing them to work independently
- message brokers often provide mechanisms for guaranteed message delivery and persistence
- brokers can route messages to specific queues or topics, allowing for fine-grained control
- protocol agnostic: many message brokers support multiple communication protocols (e.g., AMQP, MQTT, STOMP), making it easier to integrate diverse systems

Cons:
- it adds complexity to your architecture and operational overhead
- it introduces some latency into the system due to message processing and routing
- message broker can become a single point of failure in your system
- no way how to re-process old events (they are being deleted after processing)
- while it can be quite tricky, but it is possible to organize retry logic
- It can be challenging to implement advanced consumer logic patterns, such as partitioning events by ID (criteria) per consumer (from single queue)

### 2. Messages log (Kafka, ...)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/2.jpg)

In the case of Kafka topics, the server sends events to a broker, and the broker persists these events in specified topics, and in the case of Kafka, it also distributes them to specified partitions based on the partition key.

> consider use insrastructure-as-code pattern to achieve maintainability and simplicity

Pros:
- usually designed for high-throughput data streaming
- good horizontally scalable possibilities
- store messages persistently, which means data is not lost even if a consumer is not actively listening or already processed events
- events can be easily re-processed (all events are persisted)
- message brokers decouple producers from consumers, allowing them to work independently
- simple consumer scaling logic based on some cryteria, as example, by entity ID per consumer (based on assigment topic's partitons to different application's instances in consumer group)
- usually there are integrations with various data processing frameworks, making it a suitable choice for building data pipelines

Cons:
- it adds complexity to your architecture and operational overhead
- it introduces some latency into the system due to message processing and routing
- message broker can become a single point of failure in your system
- tricky to organise retry logic (but processing can be stopped until failure would be fixed)
- persists all received events for some renetion periud (volume consuming approach)
- partition key should be carefully chosen
- guarantees ordering of messages within a partition but not across partitions (Achieving global ordering might be complex).
- it is optimized for small to medium-sized messages (handling very large messages can be challenging).

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
