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
    // "passengers" should be the 'role' variable - either 'driver' or 'passenger', so that when they click
    // go after selecting their destination, they're added to the appropriate object list in firebase
    var ref = database.ref(role + "s");
    // testUser here should be replaced with the name of the current logged in user
    var usersRef = ref.child(testUser);
    usersRef.set({
        dbOriginLat: originLat,
        dbOriginLong: originLong,
        dbDestLat: destLat,
        dbDestLong: destLong
    });
    if (role === "driver") {
        console.log("enter driver flow");
    } else if (role === "passenger") {
        console.log("enter passenger flow");
    }
});

//
function driver() {

}

//
function passenger() {
    
}
