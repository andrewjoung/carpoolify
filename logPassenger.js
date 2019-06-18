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

//var driverPool = [];

var availableDrivers = $("#availableDrivers");

$("#passengerSubmitRide").on("click", function () {
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

    database.ref("/drivers").on("value", function (snapshot) {
        var snapObject = snapshot.val();
        var counter = 1;
        for (driver in snapObject) {
            console.log(driver);
            driverOriginLat = snapObject[driver].dbOriginLat;
            driverOriginLong = snapObject[driver].dbOriginLong;
            driverDestLat = snapObject[driver].dbDestLat;
            driverDestLong = snapObject[driver].dbDestLong;
            driverPickupRange = snapObject[driver].dbPickupRange;
            driverSeatsLeft = snapObject[driver].dbSeatsAvail;

            var passOriginLatLng = new google.maps.LatLng(originLat, originLong);
            var driverOriginLatLng = new google.maps.LatLng(driverOriginLat, driverOriginLong);

            var inRange = false;

            distanceService.getDistanceMatrix({
                origins: [passOriginLatLng],
                destinations: [driverOriginLatLng],
                travelMode: "DRIVING"
            }, function (response, status) {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    console.log('Error:', status);
                } else {
                    var pickupDistance = response.rows[0].elements[0].distance.value;
                    console.log(response);
                    if (pickupDistance <= driverPickupRange) {
                        console.log("Passenger is within pickup range of " + driver);

                        var passDestLatLng = new google.maps.LatLng(destLat, destLong);
                        var driverDestLatLng = new google.maps.LatLng(driverDestLat, driverDestLong);

                        distanceService.getDistanceMatrix({
                            origins: [passDestLatLng],
                            destinations: [driverDestLatLng],
                            travelMode: "DRIVING"
                        },
                        function (response, status) {
                            if (status !== google.maps.DistanceMatrixStatus.OK) {
                                console.log('Error:', status);
                            } else {
                                var dropoffDistance = response.rows[0].elements[0].distance.value;
                                console.log(dropoffDistance);
                                if (dropoffDistance <= dropoffRange) {
                                    console.log(driver + "'s destination is within passenger's specified dropoff range");
                                    inRange = true;
                                    console.log(inRange);
                                }
                            }
                        });
                    }
                }
            });
            



    // var inPickupRange = matchRiders(originLat, originLong, driverOriginLat, driverOriginLong, driverPickupRange);
    // //console.log(inPickupRange);
    // var inDropoffRange = matchRiders(destLat, destLong, driverDestLat, driverDestLong, dropoffRange);
    // //console.log(inDropoffRange);
    // if (inPickupRange && inDropoffRange && driverSeatsLeft > 0) {
    //     //add driver to rider queue
    //     // driverPool.push(driver);
    //     // TODO: DOM manipulation
    //     var newDriver = $("<button>").addClass("list-group-item list-group-item-action");
    //     newDriver.attr("id", "driver" + counter);
    //     var driverName = $("<span>").text(driver);
    //     var domSeatsLeft = $("<span>").text("Seats Left: " + driverSeatsLeft);
    //     var estArrival = $("<span>").text("est. arrival time");
    //     newDriver.append({ driverName, domSeatsLeft, estArrival });
    //     availableDrivers.append(newDriver);
    // }
    // counter++;

    //console.log(snapObject[driver].dbDestLat);
        }
    });
});

// must make sure passed in range and caluclated distance are the same unit of measurement
function matchRiders(passLat, passLong, driverLat, driverLong, range) {
    // var passLatLng = new google.maps.LatLng(passLat, passLong);
    // var driverLatLng = new google.maps.LatLng(driverLat, driverLong);    
    // distanceService.getDistanceMatrix({
    //     origins: [passLatLng],
    //     destinations: [driverLatLng],
    //     travelMode: "DRIVING"
    // },
    // function (response, status) {
    //     if (status !== google.maps.DistanceMatrixStatus.OK) {
    //         console.log('Error:', status);
    //     } else {
    //         var distance = response.rows[0].elements[0].distance.value;
    //         if (distance <= range) {
    //             console.log("true");
    //             return true;
    //         }
    //         //console.log(response.rows[0].elements[0].distance.value);
    //     }
    //     console.log("false");
    //     return false;
    // });

    // var queryUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + driverLat + "," + driverLong + "&destinations=" + passLat + "," + passLong + "&key=AIzaSyBoXt6pSwA0glAnd484xWcSZiRDqXGczSM";
    // var distance;
    // $.ajax({
    //     url: queryUrl,
    //     method: "GET"
    // }).then(function(response) {
    //     // meters
    //     distance = response.rows.elements.distance.value;
    // });
    // if (distance <= range) {
    //     return true;
    // }
    // return false;
}