---
title: "Ways of conveying/transferring events in Asynchronous systems"
date: 2023-08-14T09:03:20-08:00
draft: true
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

### Ways of conveying/transferring events

1. Queus (RabbitMQ, ...)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/2/1.jpeg)


2. Messages log (Kafka, ...)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/2/2.jpeg)

3. Webhooks (Rest)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/2/3.jpeg)


4. Polling (Rest)

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/2/4.jpeg)


5. WS / SSE / HTTP/2.0

![!\[Alt text\](../assets/img/2023--8-06-events-in-event-driver-arch/1.jpeg)](/2/5.jpeg)


## Conclusion
each variant is a trade-off, consider you devops environment, expertise and domain constraints to make right choice. 


## Further Reading
1. 
