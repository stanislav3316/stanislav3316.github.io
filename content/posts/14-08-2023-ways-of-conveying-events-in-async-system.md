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
- guarantees ordering of messages within a partition but not across partitions (Achieving global ordering might be complex)
- it is optimized for small to medium-sized messages (handling very large messages can be challenging).

### 3. Webhooks (Rest)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/3.jpg)

In Webhooks case, service sends events on specified/registered REST endpoint, so that app could process them.

Pros:
- implementing Webhooks is often straightforward, requiring a simple HTTP POST request to the configured endpoint
- an effective integration pattern for external systems
- no extra complexity in your architecture and operational overhead

Cons:
- webhooks rely on the availability and responsiveness of the receiver's server, making them susceptible to network issues and downtime
- it's crucial to give careful thought to retry logic in the event of an outage of the receiver's server
- can introduce notable latency into inter-service communications
- You need to implement logic for registering and updating callback URLs in your application
- no method for re-processing already received events (only persist them when you get it)
- implementing proper authentication and authorization mechanisms for Webhooks can be challenging, especially in multi-tenant or public-facing systems

### 4. Polling (Rest)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/4.jpg)

In the case of polling, an external system or application periodically makes GET requests to the /events endpoint to retrieve the latest events.

Pros:
- implementing polling is relatively simple, as it only involves making regular requests to a specific endpoint
- the client has control over when to fetch new data, making it easy to manage data retrieval based on its specific needs
- an effective integration pattern for external systems: polling can work with a wide range of systems and technologies
- no extra complexity in your architecture and operational overhead

Cons:
- cases of network and external service outages should be addressed with extended retry mechanisms
- polling introduces latency
- frequent polling can result in unnecessary network traffic
- polling is not suitable for real-time applications where immediate data updates are required
- no method for re-processing already received events (only persist them when you get it)

### 5. WS / SSE / HTTP/2.0

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/5.jpg)

In the case of WebSocket (WS), Server-Sent Events (SSE), or HTTP/2.0, external systems or applications establish long-lived connections to receive an event stream.

Pros:
- long-lived connections enable real-time data updates, making them ideal for applications requiring instant notifications and live data feeds
- these technologies are designed for low-latency communication
- implementing long-lived connections can be simpler than managing complex polling or callback mechanisms
- no extra complexity in your architecture and operational overhead

Cons:
- you need to carefully consider the logic for acknowledging events to guarantee delivery
- you need to consider implementing ping/pong messages to allow the connection to be closed in the event of prolonged inactivity
- organizing retry logic can be challenging
- implementing and managing long-lived connections can be more complex than traditional request-response mechanisms, especially when dealing with reconnects and error handling
- both clients and servers must maintain open connections, which can consume resources
- long-lived connections may encounter issues with certain network configurations, firewalls, and proxies, potentially requiring additional configuration

## Conclusion
Each option comes with its own set of trade-offs that you should carefully evaluate within the context of your architecture and domain. To make the right choice, be sure to take into account your DevOps environment, your team's expertise, and any business or domain-specific constraints.

## Further Reading
1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
2. [Publisher-Subscriber pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber)
