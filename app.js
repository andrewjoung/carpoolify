
let looper = 0

let database = firebase.database()

let account = "accounts"










// Checks Username upon registering. Will return either true or false
let checkUserName = () => {

  let firstName = $("#registerFirstName").val()
  let lastName = $("#registerLastName").val()
  let email = $("#registerEmail").val()
  let password = $("#registerPassword").val()
  let address = $("#registerAddress").val()
  let city = $("#registerCity").val()
  let state = $("#registerState").val()
  let phone = $("#registerPhone").val()
  let userName = $("#registerUserName").val()


  let count = 0;
  let looper = 0;

  database.ref("accounts").on("value", function (data) {

    looper++

    let value = data.val()
    // console.log(data.val())
    let keysArray = Object.keys(value);
    console.log(keysArray)









    for (var i = 0; i < 5; i++) {

      if (keysArray[i] === userName) {

        // console.log("checked")
        count = 1
      }

    }
    if (count === 0) {
      // console.log("pushing")

      database.ref("accounts/" + userName).push({

        firstName: firstName,
        lastName: lastName,
        username: userName,
        email: email,
        password: password,
        address: address,
        city: city,
        state: state,
        phone: phone

      })

      window.location.href = "index.html"
      // console.log($("#transfer-button")[0])

      // console.log("looping")
    }

    else if (count === 1 && looper === 1) {
      // document.getElementById("sign-in").disabled = true
      $(".container").attr("id", "shake-me")
      $("#change-title").text("Please Choose a Different Username")
      $("#change-title").css("color", "red")
      $("#transfer-button").attr("href", "#")
      $("#registerUserName").val("")
      setTimeout(function () {
        // document.getElementById("sign-in").disabled = false
        $(".container").attr("id", "")


      }, 1000)
      setTimeout(function () {
        $("#change-title").css("color", "#1DB954")
        $("#change-title").text("Sign Up")
      }, 2000)

    }

  })
}


let checkSignIn = () => {

  let userSignIn = $("#userName").val().trim()
  let userPassword = $("#user-password").val().trim()

  database.ref("accounts").on("value", function (data) {
    let keys = Object.keys(data.val());
    for (var i = 0; i < keys.length; i++) {
      // console.log(keys)
      // console.log(userSignIn)
      if (userSignIn == keys[i]) {

        database.ref("accounts/" + userSignIn).on("value", function (data) {
          let userKeysArray = Object.keys(data.val())
          console.log(data.val()[userKeysArray[0]].password)
          console.log(userPassword)

          if (userPassword == data.val()[userKeysArray[0]].password) {
            console.log("loading correctly")
            window.location.href = "landingPage.html"




          }

        })
      }

    }
    setTimeout(function () {
      $(".container").attr("id", "shake-me")
      $("#change-title-sign-in").text("Incorrect Username Or Password")
      $("#change-title-sign-in").css("color", "red")
      $("#transfer-button").attr("href", "#")
      setTimeout(function () {
        $(".container").attr("id", "")
        // document.getElementById("sign-in").disabled = false


      }, 1000)
      setTimeout(function () {
        $("#change-title-sign-in").css("color", "#1DB954")
        $("#change-title-sign-in").text("Sign Up")


      }, 2000)
    }, 500)

  })
}



$(".btn-lg").on("click", function () {
  var id = $(this).attr("id");
  if (id === "startRide") {
    role = "driver";
  } else if (id === "findRide") {
    role = "passenger";
  }
  console.log(role);
});

$("#startRide").on("click", function () {
  // "passengers" should be the 'role' variable - either 'driver' or 'passenger', so that when they click
  // go after selecting their destination, they're added to the appropriate object list in firebase

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









//start of next part of function, put ins ame function due to asyncrhonous check






$("#submit-button").on("click", function () {

  checkUserName()

})


$("#sign-in").on("click", function () {

  checkSignIn()


})












