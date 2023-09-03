---
title: "Delivery guarantee for events"
date: 2023-08-31T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

### Delivery guarantee for events

When application saves some information about entity to data store and then propogates this change to a broker (RabbitMQ, Kafka, ...) there are two transactions:
1. between app and data store
2. between app and broker

So, in case of app failure, network problem between app and a broker or by any other coincident, this change may not be sent to the broker (change will be saved in data store, but not propogated to broker).

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/3/1.png)

In code this problem might look something like this: 
```
fun changeUserAddress(userId: String, newAddress: String) {
  ... todo
  
  dataStore.persist(user)
  publisher.publish(user)
}
```

## Transactional outbox pattern

So that you could deliver events exactly once you can use Transactional outbox pattern.

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/3/2.png)

The main idea of this pattern is to use only one transactions, data store transaction:
1. persist entity (entity_table)
2. persist event for propagation (delivery_table)

In this single transaction we can achieve atomic behaviour regarding data store. And then another app's background process can read this `delivery_table` and send the event to the broker eventually (with at least one semantic).

To reduce latency for delivering event (of course background process brings some latency) to the broker, app can try sending the event after data store transactions is applied and remove this event from `delivery_table` (all exceptions regarding sendind event should not affect main business flow, in case of failure background process will eventually re-send it).

Pattern actions:
1. persist entity and event in a single data store transaction
2. try sending event in safe mode in main business flow, in case of success - remove this event from `delivery_table`
3. in case of failure (2), background process will eventually re-send it

```
fun changeUserAddress(userId: String, newAddress: String) {
  ... todo

  var eventId: String? = null
  tx {
    dataStore.persist(user)
    eventId = dataStore.persist(event)
  }

  try {
    publisher.publish(event)
    dataStore.remove(eventId)
  } catch (e: Exception) {
    logger.debug("Could not send event ${event}, background process will send it later")
  }
}
```

## Conclusion

Transactional outbox pattern works well to overcome distributed transactions in your app, it helps to build more robust and 
resistent to failures applications.

## Further Reading
1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
2. [Pattern: Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html)
