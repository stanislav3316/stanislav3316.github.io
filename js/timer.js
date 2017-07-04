setInterval(function() {
    var textNode = document.getElementById("timer");
    var currentTime = new Date();

    textNode.innerHTML = "сейчас  " +
        currentTime.getHours() +
        ":" +
        currentTime.getMinutes() +
        ":" +
        currentTime.getSeconds();
}, 1000);