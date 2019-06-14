
var infoWindow;
var lat;
var long;
var directionsService;
var directionDisplay;
var pos;

var role;

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 18,
        disableDefaultUI: true,
        styles: [
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

    function initializeAutocomplete() {
        var input = document.getElementById('destinationSearch');
        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, "place_changed", function () {
            var place = autocomplete.getPlace();
            console.log(place);
            lat = place.geometry.location.lat();
            long = place.geometry.location.lng();
            console.log("lat: " + lat, "long: " + long);
            $("#goButton").attr("data-dismiss", "modal");
        })
    }

    google.maps.event.addDomListener(window, "load", initializeAutocomplete);

    $("#goButton").on("click", function() {
        $("#mapButtons").css("display", "none");
        
        var request = {
            origin: pos.lat + "," + pos.lng,
            destination: lat + "," + long,
            travelMode: 'DRIVING'
        };
        directionsService.route(request, function (response, status) {
            if (status == 'OK') {
                directionDisplay.setDirections(response);
            }
        });
    });


    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log(navigator.geolocation);
            console.log(position);
            console.log("current lat: " + pos.lat, "current long:" + pos.lng);

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

