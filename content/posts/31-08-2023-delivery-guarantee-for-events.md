---
title: "Delivery guarantee for events"
date: 2023-08-31T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

### Delivery guarantee for events

When application saves some information about entity to data store and then propogates this changes to a broker (RabbitMQ, Kafka, ...) there are two transactions:
1. between application and data store
2. between application and broker

So, in case of application failure, network problem between application and a broker or by any other outage, this changes may not be sent to the broker (change will be saved in data store, but not propogated to broker).

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

So that you could deliver your events (changes) to broker with guarantee you have options to use Transactional outbox pattern.

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/3/2.png)

The main idea of this pattern is to use only one transaction - data store transaction:
1. persist entity (in entity_table)
2. persist event for propagation (in delivery_table)

In this single transaction we can achieve atomic behaviour regarding data store. And then another application's background process can read this `delivery_table` (pull it) and send the event to the broker eventually (with at least one semantic).

To reduce latency for delivering events (background process brings some latency to publishing) to the broker, application should try sending the event after data store transactions is successfully applied and remove this event from `delivery_table` in another data store independent transaction (all exceptions regarding sendind event should not affect main business flow, in case of failure background process will eventually re-send it).

Pattern actions:
1. persist entity and events in a single data store transaction
2. try sending event in safe mode in main business flow, in case of success - remove this event from `delivery_table` in another transaction
3. in case of failure (2), background process will eventually re-send it

```
fun changeUserAddress(userId: String, newAddress: String) {
  ... todo

  transaction {
    dataStore.persist(user)
    dataStore.persist(event)
  }

  var eventId = event.id
  try {
    publisher.publish(event)
    dataStore.remove(eventId)
  } catch (e: Exception) {
    logger.debug("Could not send event ${event}, background process will send it later")
  }
}
```

## What if database doesn't support transactions (NoSQL like):

If data store does not support transactions, you can achieve transactions behaviour appending events into entity payload:

{{< highlight "linenos=table" >}}
{
  "user_id: "usr-1",
  "payload": {
    "user_id: "usr-1",
    "first_name": "John",
    "last_name": "Wick",
    "version": 7,
    ...
  },
  "events": [
    {
      "event_id": "1",
      ...
    },
    {
      "event_id": "2",
      ...
    }
  ]
}
{{< /highlight >}}

Where:
1. `user_id` - entity id
2. `payload` - entity body
3. `events` - events to publish eventually

Now, to access this events and publish them we have several ways:
1. read `events` array in application's background process and use optimistic locks to clean it up (keep in mind, `events` array might be appended in next business transactions, so there is a change of race conditions, that's why it's recommened to use optimistic locks here)
2. use CDC approach (recommended way)

## CDC (Change Data Capture) stream

> Change data capture (CDC) refers to the tracking of all changes in a data source (databases, data warehouses, etc.) so they can be 
> captured in destination systems. In short, CDC allows organizations to achieve data integrity and consistency across all systems and 
> deployment environments.

It means when we insert, update or remove entities in data store, we can subscribe to all data store's changes events. So, we can capture this CDC events in application's background process, extract `events` array and publish it to the broker.

> as example, MongoDB has `watch` driver method to get CDC events stream to handle.

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/3/3.jpg)

## Conclusion

Transactional outbox pattern works well to overcome distributed transactions in your app, it helps to build more robust and 
resistent to failures applications.

## Further Reading
1. [Events in Event-Driver Architecture](https://stanislav3316.github.io/posts/06-08-2023-events-in-event-driven-arch/)
2. [Pattern: Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html)
3. [CDC: Change Data Capture](https://www.qlik.com/us/change-data-capture/cdc-change-data-capture#:~:text=Change%20data%20capture%20(CDC)%20refers,a%20downstream%20process%20or%20system.)
