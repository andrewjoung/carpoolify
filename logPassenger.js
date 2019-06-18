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

// var database = firebase.database();

// firgure out how to make this the name of the current user from the user authentication
var testUser = "Tyrion";
var driversRef;

$("#goButton").on("click", function(){    
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
    console.log("hopefully this gets called afterward the submit ride button is pressed");

    $("#showPassengers").css("display", "none");
    $("#waitingForPassengerModal").modal("hide");

    var request = {
        origin: originLat + "," + originLong,
        destination: destLat + "," + destLong,
        travelMode: 'DRIVING'
    };

    directionsService.route(request, function (response, status) {
        if (status == 'OK') {
            directionDisplay.setDirections(response);
        }
    });

}

// handle edge cases
$("#driverSubmitRide").on("click", function() {
    // TODO: Ensure that user is inputting correctly formatted data ie '.25' for range instead of '1/4'
    $("#mapButtons").css("display", "none");
// function plotAndStartRoute() {
//     // hide waiting for riders
// }

// // handle edge cases
// $("#driverSubmitRide").on("click", function() {
//     // TODO: Ensure that user is inputting correctly formatted data ie '.25' for range instead of '1/4'

//     departureTime = $("#departureTime").val();    
//     // convert miles input my user to meters
//     pickupRange = parseFloat($("#pickupRange").val()) * 1609.344;
//     pickupRange = parseInt(pickupRange.toFixed(0));
//     seatsAvailable = parseInt($("#availableSeats").val());
//     console.log("depart: " + departureTime + " pickup range: " + pickupRange + " available seats: " + seatsAvailable);
    
    // "passengers" should be the 'role' variable - either 'driver' or 'passenger', so that when they click
    // go after selecting their destination, they're added to the appropriate object list in firebase
    // driversRef = database.ref("drivers");
    // // testUser here should be replaced with the name of the current logged in user
    // var currentDriver = driversRef.child(testUser);
    // // change to .push on deploy - .set is just easier for debugging and testing
    // currentDriver.push({
    //     dbOriginLat: originLat,
    //     dbOriginLong: originLong,
    //     dbDestLat: destLat,
    //     dbDestLong: destLong,
    //     dbPickupRange: pickupRange,
    //     dbDepartTime: departureTime,
    //     dbSeatsAvail: seatsAvailable
    //     // waypoints updated and pushed to firebase as riders join ride
    //     // dbWaypoints: waypoints
    // });    
    
    // //TODO 
    // // get current time
    // // difference between current time and departure time
    // // set timeout to the length of the difference and run function on timeout

    // //to test whenever the driver database is changed 
    // database.ref("drivers/Tyrion").on("value", function(snapshot){

    //     var currentTime = moment();
    //     var driverSet = snapshot.val();
    //     var departureTime = driverSet.dbDepartTime;

    //     console.log("departure time: " + departureTime);
    //     console.log("current time: " + moment(currentTime).format("hh:mm"));
    //     console.log(typeof(departureTime));

    //     var departureTimeConverted = moment(departureTime, "hh:mm").subtract();

    //     console.log(departureTimeConverted);

    //     //difference between time in milliseconds
    //     var timeWindow = moment(departureTimeConverted).diff(moment(), "milliseconds");

    //     var plotAndStartRouteTimeout = setTimeout(plotAndStartRoute, timeWindow);

    //     console.log(timeWindow);

    // });

    //TODO
    //show modal showing information about driver car information
    // ==> when riders join
    

    $('#driverInfoInputModal').modal('hide');
    $("#showPassengersButton").css("display", "block");
});

//loop through the users that have jumped into the car 
$("#showPassengersButton").on("click",function(){


    $("#waitingForPassengerModal").modal("show");


});



//---------------------------------------------------------------
// passenger flow
//     // get current time
//     // difference between current time and departure time
//     // set timeout to the length of the difference and run function on timeout
//     plotAndStartRoute();

//     $('#driverInfoInputModal').modal('hide');
// });

// //---------------------------------------------------------------
// // passenger flow

//
function passengerFlow() {
    $('#passengerInfoInputModal').modal('show');
}

$("#passengerSubmitRide").on("click", function() {
    dropoffRange = parseFloat($("#dropoffRange").val()) * 1609.344;
    dropoffRange = parseInt(dropoffRange.toFixed(0));
    console.log(dropoffRange);

    var ref = database.ref("passengers");
    // testUser here should be replaced with the name of the current logged in user
    var usersRef = ref.child(testUser);
    // change to .push on deploy - .set is just easier for debugging and testing
    usersRef.push({
        dbOriginLat: originLat,
        dbOriginLong: originLong,
        dbDestLat: destLat,
        dbDestLong: destLong,
        dbDropoffRange: dropoffRange
        // waypoints updated and pushed to firebase as riders join ride
        // dbWaypoints: waypoints
    });
    database.ref("/drivers").on("value", function(snapshot) {
        var snapObject = Object.keys(snapshot.val());
        console.log(snapObject);
        for (var i = 0; i < snapObject.length; i++) {
            console.log(snapObject[i]);
            let wow =  Object.keys( snapshot.val()[snapObject[i]])
            let test = snapshot.val()[snapObject[i]][wow[0]].dbDestLat;
            console.log(test);
        }
    });
});





