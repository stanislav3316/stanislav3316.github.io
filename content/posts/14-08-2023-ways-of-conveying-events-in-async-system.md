---
title: "Ways of conveying/transferring events in Asynchronous Systems"
date: 2023-08-14T09:03:20-08:00
draft: true
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

### Ways of conveying/transferring events

1. Queus (RabbitMQ, ...)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/1.jpg)

In queues case, service sends events to queue broker and broker can send events to all binded queus (fanous), or to only one business process queue.

Pros:
- event is in queue until app's consumer processed it (queue doesn't persist events when they ware already processed)
- low latency approach
- simple publish-subscribe pattern

Cons:
- no way how to reprocess old events (they are deleting after being processed)
- more difficult to organise retry logic
- more difficult consumer scaling logic (to read events from one queue and shard event by some criteria like entity ID)

2. Messages log (Kafka, ...)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/2.jpg)
+-

3. Webhooks (Rest)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/3.jpg)
+-

4. Polling (Rest)

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/4.jpg)
+-

5. WS / SSE / HTTP/2.0

![!\[Alt text\](../assets/img/14-08-2023-ways-of-conveying-events-in-async-system/1.jpeg)](/2/5.jpg)
+-

## Conclusion
each variant is a trade-off, consider you devops environment, expertise and domain constraints to make right choice. 
(+ infractructure as code)
## Further Reading
1. 
