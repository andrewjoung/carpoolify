var firebaseConfig = {
    apiKey: "AIzaSyBxUaoNSvhJ13OIN9O_ryg6V9XFpABJYD0",
    authDomain: "carpoolify.firebaseapp.com",
    databaseURL: "https://carpoolify.firebaseio.com",
    projectId: "carpoolify",
    storageBucket: "",
    messagingSenderId: "144701142261",
    appId: "1:144701142261:web:8eb8f2f55b5181ac"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var testUser = "Tyrion";

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
}

// handle edge cases
$("#driverSubmitRide").on("click", function() {
    // TODO: Ensure that user is inputting correctly formatted data ie '.25' for range instead of '1/4'

    departureTime = $("#departureTime").val();    
    // convert miles input my user to meters
    pickupRange = parseFloat($("#pickupRange").val()) * 1609.344;
    pickupRange = parseInt(pickupRange.toFixed(0));
    seatsAvailable = parseInt($("#availableSeats").val());
    console.log("depart: " + departureTime + " pickup range: " + pickupRange + " available seats: " + seatsAvailable);
    
    // "passengers" should be the 'role' variable - either 'driver' or 'passenger', so that when they click
    // go after selecting their destination, they're added to the appropriate object list in firebase
    var ref = database.ref(role + "s");
    // testUser here should be replaced with the name of the current logged in user
    var usersRef = ref.child(testUser);
    // change to .push on deploy - .set is just easier for debugging and testing
    usersRef.set({
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
    
}
