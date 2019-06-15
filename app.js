
let looper = 0

let database = firebase.database()





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

  database.ref().on("value", function (data) {

    looper++

    let value = data.val()
    // console.log(data.val())
    let keysArray = Object.keys(value);






    for (var i = 0; i < keysArray.length; i++) {

      if (keysArray[i] === userName) {

        // console.log("checked")
        count = 1


      }


    }

    if (count === 0) {
      // console.log("pushing")




      database.ref(userName).push({

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
      document.getElementById("submit-button").disabled=true;

      $(".container").attr("id", "shake-me")
      $("#change-title").text("Username is Unavailable")
      $("#change-title").css("color", "red")
      $("#transfer-button").attr("href", "#")
      $("#registerFirstName").val()
      let lastName = $("#registerLastName").val()

      //Reset all text fields to empty
      $("#registerEmail").val('')
      $("#registerPassword").val('')
      $("#registerAddress").val('')
      $("#registerCity").val('')
      $("#registerState").val('')
      $("#registerPhone").val('')
      $("#registerUserName").val('')
      $("#registerFirstName").val('')
      $("#registerLastName").val('')
      setTimeout(function () {
        // document.getElementById("sign-in").disabled = false
        $(".container").attr("id", "")


      }, 1000)
      setTimeout(function () {
        document.getElementById("submit-button").disabled=false;
        $("#change-title").css("color", "#1DB954")
        $("#change-title").text("Sign Up")
      }, 2000)

    }

  })
}


let checkSignIn = () => {

  let userSignIn = $("#userName").val().trim()
  let userPassword = $("#user-password").val().trim()

  database.ref().on("value", function (data) {
    let keys = Object.keys(data.val());
    for (var i = 0; i < keys.length; i++) {
      // console.log(keys)
      // console.log(userSignIn)
      if (userSignIn == keys[i]) {

        database.ref(userSignIn).on("value", function (data) {
          let userKeysArray = Object.keys(data.val())
          console.log(data.val()[userKeysArray[0]].password)
          console.log(userPassword)

          if (userPassword == data.val()[userKeysArray[0]].password) {
            console.log("loading correctly")
            window.location.href = "signedIn.html"




          }

        })
      }

    }
    setTimeout(function () {
      document.getElementById("sign-in").disabled=true;
      $(".container").attr("id", "shake-me")
      $("#change-title-sign-in").text("Incorrect Username Or Password")
      $("#change-title-sign-in").css("color", "red")
      $("#transfer-button").attr("href", "#")
      $("#userName").val('')
      $("#user-password").val('')

      setTimeout(function () {
        $(".container").attr("id", "")
        // document.getElementById("sign-in").disabled = false


      }, 1000)
      setTimeout(function () {
        document.getElementById("sign-in").disabled=false;
        $("#change-title-sign-in").css("color", "#1DB954")
        $("#change-title-sign-in").text("Sign Up")


      }, 2000)
    }, 500)

  })
}









//start of next part of function, put ins ame function due to asyncrhonous check






$("#submit-button").on("click", function () {

  checkUserName()

})


$("#sign-in").on("click", function () {

  checkSignIn()


})

// function initialize() {
//   var input = document.getElementById('search-text-field');
//   new google.maps.places.Autocomplete(input);
// }

// google.maps.event.addDomListener(window, 'load', initialize);










