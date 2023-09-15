---
title: "Consumer retry logic in Event-Driven architecture"
date: 2023-09-04T09:03:20-08:00
draft: true
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

# Retrayable
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

# Non-Retrayable
1. data validation errors
2. authentication and authorization failures
3. bad request (4xx) responses form external system or services
4. business logic errors
5. ...

Non-retrayable exceptions are errors that occur during event consumption and should not be retried because they are unlikely to be resolved by retrying the same operation. These exceptions typically represent issues that are beyond the scope of retry logic and require manual intervention or a different approach to handling.

Handling non-retrayable exceptions typically involves logging the error, notifying relevant parties, and implementing appropriate error-handling strategies, such as moving problematic messages to a dead-letter queue or taking corrective actions based on the specific error type.

## Correlated events



## Conclusion

## Further Reading
1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
