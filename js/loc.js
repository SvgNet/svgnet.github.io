var watchID = "";
var userLoc = "NTL";

function toggleLocation() {

    if (document.querySelector("#TrackIcon").innerHTML === "location_off") {
        getLocation();
        console.log("getlocation");
        notification.MaterialSnackbar.showSnackbar({
            message: "SvgNet is tracking your device's GPS Location "
        });
    }
    if (document.querySelector("#TrackIcon").innerHTML === "location_on") {
        stopLocation();
        console.log("stoplocation");
        document.getElementById("Datalat").value = document.getElementById("Datalon").value = "";
        document.getElementById("AccLoc").innerHTML = "Location not taken from device";
        notification.MaterialSnackbar.showSnackbar({
            message: "SvgNet has stopped tracking your device's GPS Location"
        });
        document.getElementById("Datalat").parentNode.classList.remove("is-dirty");
        document.getElementById("Datalon").parentNode.classList.remove("is-dirty");
    }
    toggleEditLoc();
}


function showLocError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("AccLoc").innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("AccLoc").innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("AccLoc").innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("AccLoc").innerHTML = "An unknown error occurred.";
            break;
    }
}

function showPosition(position) {

    document.getElementById("Datalat").parentNode.classList.add("is-dirty");
    document.getElementById("Datalon").parentNode.classList.add("is-dirty");

    document.getElementById("Datalat").value = position.coords.latitude;
    document.getElementById("Datalon").value = position.coords.longitude;
    document.getElementById("AccLoc").innerHTML = position.coords.accuracy.toFixed(3) + "m";
    userLoc = position;
}

function getLocation() {
    var options = {
        enableHighAccuracy: true, // Hint to try to use true GPS instead of other location proxies like WiFi or cell towers
        timeout: 50000, // Maximum number of milliseconds to wait before timing out
        maximumAge: Infinity // Maximum of milliseconds since last position fix
    };
    if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(showPosition, showLocError, options)
    } else {
        document.getElementById("AccLoc").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function stopLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchID);
    }
    userLoc = "NTL";
}

function toggleEditLoc() {
    if (document.querySelector("#TrackIcon").innerHTML === "location_on") {
        document.getElementById("Datalat").removeAttribute("disabled");
        document.getElementById("Datalon").removeAttribute("disabled");
        document.querySelector("#TrackIcon").innerHTML = "location_off";

    } else {
        document.getElementById("Datalat").setAttribute("disabled", true);
        document.getElementById("Datalon").setAttribute("disabled", true);
        document.querySelector("#TrackIcon").innerHTML = "location_on";
    }
    document.getElementById("Datalat").parentNode.classList.toggle("is-disabled");
    document.getElementById("Datalon").parentNode.classList.toggle("is-disabled");
}
