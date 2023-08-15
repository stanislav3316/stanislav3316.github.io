---
title: "Ways of conveying/transferring events in Asynchronous systems"
date: 2023-08-14T09:03:20-08:00
draft: false
---

> **ℹ️ disclaimer**
>
> This article represented my mental model at the time of writing, but I’m always iterating on it.

### Ways of conveying/transferring events

1. Queus (RabbitMQ, ...)

![!Example](/static/2/1.jpg)

2. Messages log (Kafka, ...)

![!Example](/static/2/2.jpg)

3. Webhooks (Rest)

![!Example](/static/2/3.jpg)

4. Polling (Rest)

![!Example](/static/2/4.jpg)

5. WS / SSE / HTTP/2.0 (streaming)

![!Example](/static/2/5.jpg)


## Conclusion
each variant is a trade-off, consider you devops environment, expertise and domain constraints to make right choice. 


## Further Reading
1. 
