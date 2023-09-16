---
title: "Consumer retry logic in Event-Driven architecture"
date: 2023-09-04T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

## Consumer retry logic

When processing events from any message broker, such as RabbitMQ or Kafka, it's essential to consider implementing retry logic to handle outages or errors effectively.

## Retrayable and Non-retrayable exceptions

There are two types of exceptions:
1. retrayable - you can try a little bit later, after some time to complete operation
2. non-retrayable - this kind of exceptions can't be fixed over time

The primary benefit of categorizing exceptions into different types is the ability to make decisions based on the specific type of exception. Retry mechanisms should only be employed for exceptions categorized as retryable during event processing

### Retrayable
1. network errors
2. service Unavailability
3. rate limiting
4. temporary connectivity issues
6. optimistic lock conditions
7. ...

Retryable exceptions are errors that occur during event consumption but are expected to be temporary or transient in nature. These exceptions are suitable for retrying the same operation, as it is possible that the issue causing the error may be resolved with a subsequent attempt. 

When encountering retryable exceptions, it's common to implement retry logic that includes:

- defining a maximum retry count to limit the number of retry attempts.
- implementing an incremental or exponential backoff strategy to avoid overloading the system with immediate retries.
- adding jitter to retry intervals to prevent synchronized retries.
- logging and monitoring to keep track of retry attempts and detect patterns of recurring failures.

Retryable exceptions should be handled in a way that allows the consuming application to automatically recover from transient issues without manual intervention, thereby improving the robustness and reliability of event processing.

### Non-Retrayable
1. data validation errors
2. authentication and authorization failures
3. bad request (4xx) responses form external system or services
4. business logic errors
5. ...

Non-retrayable exceptions are errors that occur during event consumption and should not be retried because they are unlikely to be resolved by retrying the same operation. These exceptions typically represent issues that are beyond the scope of retry logic and require manual intervention or a different approach to handling.

Handling non-retrayable exceptions typically involves logging the error, notifying relevant parties, and implementing appropriate error-handling strategies, such as moving problematic messages to a dead-letter queue or taking corrective actions based on the specific error type.

## Correlated events

Consider an Order Service that is responsible for managing Order entities. For example, when processing an order, it might generate events like "OrderPlacedEvent," "PaymentProcessedEvent," "InventoryReservedEvent," and "ShippingScheduledEvent." Each of these events is associated `with the same order ID` to maintain the relationship.

It means that these events have causal consistency and it's important to process each event in strict order.

1. If `non-retrayable` exception occurs you should stop processing all subsequent events with the same entity ID to keep up with consistency
2. If `retrayable` exception occurs you should retry not only failed event, but all subsequent events with the same entity ID to keep up with consistency

To maintain consistency, when you retry one of the order events with a specific order ID, you should also trigger the retry of other related events with the same order ID. This ensures that all parts of the order processing workflow are retried together (by retrying all related events together, you maintain the integrity and consistency of the order processing workflow).

## Retry options

### Stop processing

At times, there is an option to halt the entire event processing in case of any errors. The system should notify the monitoring system and await manual intervention.

1. by restarting application pod (k8s) with alerting
2. by producing metrics about problem
3. by failing health check pod probes
4. ...

### Retry logic

For non-retrayable retryable exceptions:
1. log errors
2. push this event into Deal-Letter quque with information about exception (for further analysis)
3. push information about failed event into metrics system (business metrics like count of failed events in last minute/second ...)

For retrayable retryable exceptions:
1. you can attempt to retry the event with an in-memory backoff mechanism for 2-3 times, using short intervals between retries
2. if it continues to fail, increment the record's 'retry' counter in the record headers and publish it to the retry topic/queue
3. periodically, attempt to consume records (in a separate process or thread) from the retry topic/queue and proceed with trying to apply the events
4. when the number of re-processing attempts exceeds a certain threshold (e.g., 10 times), push both the event and its correlated ones to a Dead-Letter topic/queue for manual intervention and analysis

![!\[Alt text\](../assets/img/04-09-2023-consumer-retry-logic/1.jpeg)](/4/1.jpg)

## Example: RabbitMQ Delayed Message Plugin (for backoff)

- rabbitMQ offers a Delayed Message Plugin that allows you to implement delayed message delivery with more precision.
- this plugin introduces a new exchange type called "x-delayed-message," which retains messages in a queue until a specified delay period has passed.
- to use this plugin, you need to install it and configure your RabbitMQ server to enable the "x-delayed-message" exchange type.
- once configured, you can publish messages to this exchange with a delay specified in milliseconds. The messages will be held until the delay period has elapsed before being delivered to the queue.

```
#RabbitMQ Delayed Message
// ... elided code ...
byte[] messageBodyBytes = "delayed payload".getBytes();
AMQP.BasicProperties.Builder props = new AMQP.BasicProperties.Builder();
headers = new HashMap<String, Object>();
headers.put("x-delay", 5000);
props.headers(headers);
channel.basicPublish("my-exchange", "", props.build(), messageBodyBytes);
```

![!\[Alt text\](../assets/img/04-09-2023-consumer-retry-logic/1.jpeg)](/4/2.jpg)

## Example: Kafka Delayed Messages (for backoff)

Apache Kafka does not have built-in support for delayed message delivery like some other messaging systems. Kafka is designed for high-throughput, real-time event streaming, and its primary focus is on the reliable and ordered delivery of messages. However, you can implement delayed message delivery in Kafka:

1. create intermediate Kafka topics where messages with future timestamps are initially published
2. implement a separate consumer process that continuously checks the timestamps of messages in the intermediate topics (using `pause` and `resume` kafka Api methods)
3. when a message's timestamp matches the current time or exceeds it, move the message to the target topic for further processing by other consumers.

![!\[Alt text\](../assets/img/04-09-2023-consumer-retry-logic/1.jpeg)](/4/3.jpg)

## Conclusion

Define a retry policy that specifies the maximum number of retry attempts allowed and the delay between retries (to avoid overloading the system with retries). Adjust these parameters based on your application's needs and message importance.

Set up monitoring and alerting to notify you when messages are being retried frequently, which may indicate an issue that needs attention.

## Further Reading

1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
2. [Retry Mechanism and Delay Queues in Apache Kafka](https://medium.com/naukri-engineering/retry-mechanism-and-delay-queues-in-apache-kafka-528a6524f722)
3. [RabbitMQ Delayed Messages 101: How to Delay & Schedule Messages Made Easy](https://hevodata.com/learn/rabbitmq-delayed-message/#:~:text=To%20delay%20a%20message%2C%20the,to%20queues%20or%20other%20exchanges.)
