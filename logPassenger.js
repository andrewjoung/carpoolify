// var firebaseConfig = {
//     apiKey: "AIzaSyBxUaoNSvhJ13OIN9O_ryg6V9XFpABJYD0",
//     authDomain: "carpoolify.firebaseapp.com",
//     databaseURL: "https://carpoolify.firebaseio.com",
//     projectId: "carpoolify",
//     storageBucket: "",
//     messagingSenderId: "144701142261",
//     appId: "1:144701142261:web:8eb8f2f55b5181ac"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

//var database = firebase.database();

// firgure out how to make this the name of the current user from the user authentication
//var testUser = "Tyrion";
//var driversRef;

$("#goButton").on("click", function () {
    if (role === "driver") {
        driverFlow();
        console.log("enter driver flow");
    } else if (role === "passenger") {
        passengerFlow();
        console.log("enter passenger flow");
    }
});

//--------------------------------------------------------------
// define user flows

//--------------------------------------------------------------
// driver flow

//
function driverFlow() { 
    $("#driverSubmitRide").attr("data-dismiss", "modal");
    promptDriverInput();
}

//
function promptDriverInput() {
    $('#driverInfoInputModal').modal('show');
}

// executes when the departure time the user entered is reached
// code out when user flow is finished
function plotAndStartRoute() {
    // hide waiting for riders
    console.log("entering plot and start");

    var userDriver = localStorage.getItem("username");
    //console.log("this is stupid: " + userDriver);

    //we'll have to change this to be "drivers/ + userDriver"
    database.ref("drivers/" + userDriver).on("value", function(snapshot) {

        console.log("entering database");
        //riders have chosen to carpool and db has been populated with a waypoint child element
        console.log(snapshot);
        console.log(snapshot.child("dbWaypoints").exists());

        if(snapshot.child("dbWaypoints").exists()) {

            console.log("riders have joined and we're doing waypoint stuff");
            var dbWaypoints = snapshot.val()["dbWaypoints"];
            var dbWaypointKeys = Object.keys(dbWaypoints); //array of keys 

            var waypointsToAdd = [];

            console.log(dbWaypointKeys);

            var firstKey = dbWaypointKeys[0];
            var secondKey = dbWaypointKeys[1];

            console.log(snapshot.val()['dbWaypoints'][firstKey]);
            console.log(snapshot.val()["dbWaypoints"][secondKey]);

            for(var i = 0; i < dbWaypointKeys.length; i++) {
                var key = dbWaypointKeys[i];
                //array with length of 2 that holds lat/lng for each key
                var coordinateArray = snapshot.val()["dbWaypoints"][key];
                var lat = coordinateArray[0];
                var lng = coordinateArray[1];

                var latLng = new google.maps.LatLng(lat, lng);

                waypointsToAdd.push({location: latLng});
            }

            var request = {
                origin: originLat + "," + originLong,
                destination: destLat + "," + destLong,
                waypoints: waypointsToAdd,
                travelMode: 'DRIVING'
            };
            directionsService.route(request, function (response, status) {
                if (status == 'OK') {
                    directionDisplay.setDirections(response);
                }
            });
        } else {
            //just plot the route
            var soloRequest = {
                origin: originLat + "," + originLong,
                destination: destLat + "," + destLong,
                travelMode: 'DRIVING'
            };
            directionsService.route(soloRequest, function (response, status) {
                if (status == 'OK') {
                    directionDisplay.setDirections(response);
                }
            });
        }

    });
}

// handle edge cases
$("#driverSubmitRide").on("click", function () {
    // TODO: Ensure that user is inputting correctly formatted data ie '.25' for range instead of '1/4'

    departureTime = $("#departureTime").val();
    // convert miles input my user to meters
    pickupRange = parseFloat($("#pickupRange").val()) * 1609.344;
    pickupRange = parseInt(pickupRange.toFixed(0));
    seatsAvailable = parseInt($("#availableSeats").val());
    console.log("depart: " + departureTime + " pickup range: " + pickupRange + " available seats: " + seatsAvailable);

    // "passengers" should be the 'role' variable - either 'driver' or 'passenger', so that when they click
    // go after selecting their destination, they're added to the appropriate object list in firebase
    driversRef = database.ref("drivers");
    // testUser here should be replaced with the name of the current logged in user
    var currentDriver = driversRef.child(localStorage.getItem("username"));
    // change to .push on deploy - .set is just easier for debugging and testing
    currentDriver.set({
        dbOriginLat: originLat,
        dbOriginLong: originLong,
        dbDestLat: destLat,
        dbDestLong: destLong,
        dbPickupRange: pickupRange,
        dbDepartTime: departureTime,
        dbSeatsAvail: seatsAvailable
        // waypoints updated and pushed to firebase as riders join ride
        // dbWaypoints: waypoints
    });

    var departTime = moment(departureTime, "HH:mm");

    var timeframe = departTime.diff(moment(), "milliseconds");

    var routeTimeout = setTimeout(plotAndStartRoute, timeframe);

    $('#driverInfoInputModal').modal('hide');
});

//---------------------------------------------------------------
// passenger flow

//
function passengerFlow() {
    $('#passengerInfoInputModal').modal('show');
}

var driverOriginLat;
var driverOriginLong;
var driverDestLat;
var driverDestLong;
var driverPickupRange;
var driverSeatsLeft;
var driverName;

var clickCount = 0;
//var driverPool = [];

var availableDrivers = $("#availableDrivers");

$("#passengerSubmitRide").on("click", function () {

    // temporarily set lat/long to my home address
    originLat = 47.630507;
    originLong = -122.154106;

    dropoffRange = parseFloat($("#dropoffRange").val()) * 1609.344;
    dropoffRange = parseInt(dropoffRange.toFixed(0));
    //console.log(dropoffRange);

    var ref = database.ref("passengers");
    // testUser here should be replaced with the name of the current logged in user
    var usersRef = ref.child(localStorage.getItem("username"));
    // change to .push on deploy - .set is just easier for debugging and testing
    console.log(usersRef);

    usersRef.set({
        dbOriginLat: originLat,
        dbOriginLong: originLong,
        dbDestLat: destLat,
        dbDestLong: destLong,
        dbDropoffRange: dropoffRange
        // waypoints updated and pushed to firebase as riders join ride
        // dbWaypoints: waypoints
    });

    //clickCount = 0;

    database.ref("/drivers").on("value", function (snapshot) {

        var snapObject = snapshot.val();
        // var counter = 1;
        for (driver in snapObject) {
            //driverName = driver;
           // console.log(driver);
            driverOriginLat = snapObject[driver].dbOriginLat;
            //console.log(driverOriginLat);
            driverOriginLong = snapObject[driver].dbOriginLong;
            driverDestLat = snapObject[driver].dbDestLat;
            driverDestLong = snapObject[driver].dbDestLong;
            driverPickupRange = snapObject[driver].dbPickupRange;
            driverSeatsLeft = snapObject[driver].dbSeatsAvail;
            driverDepartureTime = snapObject[driver].dbDepartTime;

            matchRiders(originLat, originLong, destLat, destLong, driverOriginLat, driverOriginLong, driverDestLat, driverDestLong, driverPickupRange, dropoffRange, driverSeatsLeft, driverDepartureTime, driver);
        }
        clickCount++;
    });
});

// must make sure passed in range and caluclated distance are the same unit of measurement
function matchRiders(passOLat, passOLong, passDLat, passDLong, driverOLat, driverOLong, driverDLat, driverDLong, pickupRange, dropoffRange, seatsLeft, depart, driverName) {
    var passOLatLng = new google.maps.LatLng(passOLat, passOLong);
    var driverOLatLng = new google.maps.LatLng(driverOLat, driverOLong);    
    distanceService.getDistanceMatrix({
        origins: [passOLatLng],
        destinations: [driverOLatLng],
        travelMode: "DRIVING"
    },
    function (originResponse, originStatus) {
        if (originStatus !== google.maps.DistanceMatrixStatus.OK) {
            console.log('Error:', originStatus);
        } else {
            var pickupDistance = originResponse.rows[0].elements[0].distance.value;
            if (pickupDistance <= pickupRange && seatsLeft > 0) {
                //console.log("Passenger is in pickup range of " + driverName);
                var passDLatLng = new google.maps.LatLng(passDLat, passDLong);
                var driverDLatLng = new google.maps.LatLng(driverDLat, driverDLong);
                distanceService.getDistanceMatrix({
                    origins: [passDLatLng],
                    destinations: [driverDLatLng],
                    // possibly change to walking, as that will likely be how passengers will be getting to their final destinations
                    travelMode: "DRIVING"
                },
                function (destinationResponse, destinationStatus) {
                    if (destinationStatus !== google.maps.DistanceMatrixStatus.OK) {
                        console.log('Error:', destinationStatus);
                    } else {
                        var dropoffDistance = destinationResponse.rows[0].elements[0].distance.value;
                        console.log(clickCount);
                        if (dropoffDistance <= dropoffRange && clickCount === 1) {
                            //console.log(driverName + " is a driver candidate");
                            displayDriver(driverName, seatsLeft, driverOLat, driverOLong, driverDLat, driverDLong, depart);
                        }
                    }
                });
            }
        }
    });
}

// Displays the information of potential drivers to the passenger screen
function displayDriver(name, seats, driverOLat, driverOLong, driverDLat, driverDLong, depart) {
    $('#passengerInfoInputModal').modal('hide');
    var newDriver = $("<button>").addClass("list-group-item list-group-item-action driver");
    newDriver.attr("id", name);

    var driverName = $("<span>").text(name);
    driverName.addClass("driverName");

    var domSeatsLeft = $("<span>").text(" Open Seats:  ");
    domSeatsLeft.addClass("seatsLeft");

    var seatsBadge = $("<span>").addClass("badge badge-primary badge-pill");
    seatsBadge.attr("id", name + "SeatsLeft");
    seatsBadge.text(seats);

    var estArrival = $("<span>");
    estArrival.addClass("estArrival");

    var estArrivalTime;

    var driverOrigin = new google.maps.LatLng(driverOLat, driverOLong);
    var driverDestination = new google.maps.LatLng(driverDLat, driverDLong);

    distanceService.getDistanceMatrix({
        origins: [driverOrigin],
        destinations: [driverDestination],
        travelMode: "DRIVING"
    },
    function (response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
            console.log('Error:', destinationStatus);
        } else {
            var travelTime = response.rows[0].elements[0].duration.value;
            var departureTime = moment(depart, "HH:mm");
            estArrivalTime = departureTime.add(travelTime, "seconds");
            estArrival.text(estArrivalTime.format("hh:mm a"));
        }
    });

    newDriver.append(driverName, domSeatsLeft, seatsBadge, estArrival);
    availableDrivers.append(newDriver);
    availableDrivers.css("display", "block");

    var domTimeoutTime = moment(depart, "HH:mm");
    var driverTimeFrame = domTimeoutTime.diff(moment(), "milliseconds");
    console.log("driverTimeFrame for testing: " + driverTimeFrame);

    setTimeout(function () {
        $("#" + name).remove();
    }, driverTimeFrame);
}

var driverClicked;

//these set of buttons will only appear for the user flow
$(document).on("click", ".driver", function(event) {
    // this prevent default may not be necessary
    event.preventDefault();
    driverClicked = $(this).attr("id"); //the driver the rider wishes to ride with
    var driverNameConfirm = $("#driverNameConfirm");
    driverNameConfirm.text(driverClicked);
    $('#confirmDriverModal').modal('show');
});

$("#driverConfirmButton").on("click", function() {
    var driverConfirmClick = 0;
    $('#confirmDriverModal').modal('hide');
    $("#availableDrivers").css("display", "none");

    var rider= localStorage.getItem("username"); //the rider 
    
    //save the rider information to the driver database 
    var driverDbRef = database.ref("drivers/" + driverClicked);
    driverDbRef.child("/ridingPassengers").push(rider);
    
    //passengers pickup lat/long
    //console.log("testing lat: " + originLat);
    //console.log("testing long: " + originLong);
    
    var riderDbLatLngArray = [];
    riderDbLatLngArray.push(originLat);
    riderDbLatLngArray.push(originLong);
    
    database.ref("drivers/" + driverClicked + "/dbWaypoints").push(riderDbLatLngArray);

    database.ref("drivers/" + driverClicked + "/dbSeatsAvail").on("value", function(snapshot) {
        if (driverConfirmClick === 0) {
            driverConfirmClick++;
            // console.log("Current seats in " + driverClicked + "'s car: " + snapshot.val());
            var updatedSeats = snapshot.val();
            updatedSeats--;
            if (updatedSeats > 0) {
                updateSeatCount(updatedSeats);
                database.ref("drivers/" + driverClicked + "/").update({
                    dbSeatsAvail: updatedSeats
                });
            } else if (updatedSeats === 0) {
                removeDriver(driverClicked);
            }
        }
    });
});

function updateSeatCount(newSeatCount) {
    $("#" + driverClicked + "SeatsLeft").text(newSeatCount);
}

function removeDriver(name) {
    $("#" + name).remove();
}
    