var infoWindow;

var originLat;
var originLong;
var destLat;
var destLong;

var departureTime;
var pickupRange;
var seatsAvailable;

var dropoffRange;

var waypoints = [];

var directionsService;
var directionDisplay;

var distance;
var pos;

var role;

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 18,
        disableDefaultUI: true,
        styles: [
            // refactor these styling calls
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1DB954" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ weight: "1" }] },
            { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#17D4C4" }] },
            { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#FFFFFF" }] },
            { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#16C7B8" }] }
        ]
    });

    directionsService = new google.maps.DirectionsService;
    directionDisplay = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: { strokeColor: "#191414" }
    });

    // TODO: Account for the fact that unless the user actually clicks one of the autocomplete suggestions, nothing is passed to this to get the dest. lat/long
    function initializeAutocomplete() {
        var input = document.getElementById('destinationSearch');
        //var input = $("#destinationSearch");
        var autocomplete = new google.maps.places.Autocomplete(input);

        google.maps.event.addListener(autocomplete, "place_changed", function () {
            var place = autocomplete.getPlace();
            // console.log(place);
            destLat = place.geometry.location.lat();
            destLong = place.geometry.location.lng();
            console.log("destination lat: " + destLat, "destination long: " + destLong);
            $("#goButton").attr("data-dismiss", "modal");
        })
    }

    google.maps.event.addDomListener(window, "load", initializeAutocomplete);

    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //console.log(navigator.geolocation);
            //console.log(position);
            originLat = pos.lat;
            originLong = pos.lng;
            console.log("origin lat: " + originLat, "origin long:" + originLong);

            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

//
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

$("#goButton").on("click", function () {
    $("#mapButtons").css("display", "none");

    // this directions flow is going to likely have to be refactored into a generalized function as we'll have to call it quite a bit
    // var request = {
    //     origin: originLat + "," + originLong,
    //     destination: destLat + "," + destLong,
    //     travelMode: 'DRIVING'
    // };
    // directionsService.route(request, function (response, status) {
    //     if (status == 'OK') {
    //         directionDisplay.setDirections(response);
    //     }
    // });
});

// records whether driver or passenger and prompts for address
$(".btn-lg").on("click", function() {
    var id = $(this).attr("id");
    if (id === "startRide") {
        role = "driver";
    } else if (id === "findRide") {
        role = "passenger";
    }
    console.log(role);
});

