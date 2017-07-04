function myTimer() {
    var date = new Date();
    var options ={
        hour: 'numeric',
        minute: 'numeric'
    };
    document.getElementById("time").innerText = date.toLocaleString("ru",options);
}