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
var testUser = "Tyrion";
var driversRef;

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
    // TODO: prevent this 
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

    // get current time
    // difference between current time and departure time
    // set timeout to the length of the difference and run function on timeout
    plotAndStartRoute();

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

//var driverPool = [];

var availableDrivers = $("#availableDrivers");

$("#passengerSubmitRide").on("click", function () {

    // temporarily set lat/long to my home address
    originLat = 47.668403;
    originLong = -122.313996;

    dropoffRange = parseFloat($("#dropoffRange").val()) * 1609.344;
    dropoffRange = parseInt(dropoffRange.toFixed(0));
    //console.log(dropoffRange);

    var ref = database.ref("passengers");
    // testUser here should be replaced with the name of the current logged in user
    var usersRef = ref.child(localStorage.getItem("username"));
    // change to .push on deploy - .set is just easier for debugging and testing
    usersRef.set({
        dbOriginLat: originLat,
        dbOriginLong: originLong,
        dbDestLat: destLat,
        dbDestLong: destLong,
        dbDropoffRange: dropoffRange
        // waypoints updated and pushed to firebase as riders join ride
        // dbWaypoints: waypoints
    });
    database.ref("/drivers").on("value", function (snapshot) {
        var snapObject = snapshot.val();
        // var counter = 1;
        for (driver in snapObject) {
            //driverName = driver;
            console.log(driver);
            driverOriginLat = snapObject[driver].dbOriginLat;
            console.log(driverOriginLat);
            driverOriginLong = snapObject[driver].dbOriginLong;
            driverDestLat = snapObject[driver].dbDestLat;
            driverDestLong = snapObject[driver].dbDestLong;
            driverPickupRange = snapObject[driver].dbPickupRange;
            driverSeatsLeft = snapObject[driver].dbSeatsAvail;

            matchRiders(originLat, originLong, destLat, destLong, driverOriginLat, driverOriginLong, driverDestLat, driverDestLong, driverPickupRange, dropoffRange, driverSeatsLeft, driver);
        }
    });
});

// must make sure passed in range and caluclated distance are the same unit of measurement
function matchRiders(passOLat, passOLong, passDLat, passDLong, driverOLat, driverOLong, driverDLat, driverDLong, pickupRange, dropoffRange, seatsLeft, driverName) {
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
                console.log("Passenger is in pickup range of " + driverName);
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
                        if (dropoffDistance <= dropoffRange) {
                            console.log(driverName + " is a driver candidate");
                            displayDriver(driverName, seatsLeft, driverOLat, driverOLong, driverDLat, driverDLong);
                        }
                    }
                });
            }
        }
    });
}

//
function displayDriver(name, seats) {
    $('#passengerInfoInputModal').modal('hide');
    var newDriver = $("<button>").addClass("list-group-item list-group-item-action driver");
    newDriver.attr("id", name);

    var driverName = $("<span>").text(name);
    driverName.addClass("driverName");

    var domSeatsLeft = $("<span>").text(" Open Seats:  ");
    domSeatsLeft.addClass("seatsLeft");

    var seatsBadge = $("<span>").addClass("badge badge-primary badge-pill");
    seatsBadge.text(seats);
    //domSeatsLeft.css("text-align", "center");
    //var arrivalTime;
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
            console.log(response);
        }
    });

    var estArrival = $("<span>").text("12:34pm");
    estArrival.addClass("estArrival");
    //estArrival.css("text-align", "right");



    newDriver.append(driverName, domSeatsLeft, seatsBadge, estArrival);
    availableDrivers.append(newDriver);
    availableDrivers.css("display", "block");
}