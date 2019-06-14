// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var infoWindow;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 18,
        disableDefaultUI: true,
        //mapTypeId: "roadmap",
        styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1DB954" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ weight: "1" }] },
            { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#17D4C4" }] },
            { featureType: "landscape.man_made", elementType: "geometry.fill", stylers: [{ color: "#FFFFFF" }] },
            { featureType: "landscape.man_made", elementType: "geometry.stroke", stylers: [{ color: "#16C7B8" }] }



        ]
    });

    // var input = $("#destinationSearch");
    // var searchBox = new google.maps.places.SearchBox(input);

    // // var autocomplete = new google.maps.places.Autocomplete(input);
    // // autocomplete.setFields(
    // //     ['address_components', 'geometry', 'icon', 'name']);

    // var markers = [];
    // // Listen for the event fired when the user selects a prediction and retrieve
    // // more details for that place.
    // searchBox.addListener('places_changed', function () {
    //     var places = searchBox.getPlaces();

    //     if (places.length == 0) {
    //         return;
    //     }

    //     // Clear out the old markers.
    //     markers.forEach(function (marker) {
    //         marker.setMap(null);
    //     });
    //     markers = [];

    //     // For each place, get the icon, name and location.
    //     var bounds = new google.maps.LatLngBounds();
    //     places.forEach(function (place) {
    //         if (!place.geometry) {
    //             console.log("Returned place contains no geometry");
    //             return;
    //         }
    //         var icon = {
    //             url: place.icon,
    //             size: new google.maps.Size(71, 71),
    //             origin: new google.maps.Point(0, 0),
    //             anchor: new google.maps.Point(17, 34),
    //             scaledSize: new google.maps.Size(25, 25)
    //         };

    //         // Create a marker for each place.
    //         markers.push(new google.maps.Marker({
    //             map: map,
    //             icon: icon,
    //             title: place.name,
    //             position: place.geometry.location
    //         }));

    //         if (place.geometry.viewport) {
    //             // Only geocodes have viewport.
    //             bounds.union(place.geometry.viewport);
    //         } else {
    //             bounds.extend(place.geometry.location);
    //         }
    //     });
    //     map.fitBounds(bounds);
    // });



    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}