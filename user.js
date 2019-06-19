let a = 0;
let b = 0;
let c = 0;
let d = 0;
let e = 0;


let fillUserName = () => {
  let accountName = localStorage.getItem("username")
  return accountName
}
let database = firebase.database()
let username = fillUserName()




database.ref("accounts").child(username).on("value", function (data) {




  let keys = Object.keys(data.val())
  let keyName = data.val()[keys[0]]
  $("#form1").val(keyName.username)
  $("#form2").val(keyName.firstName)
  $("#form6").val(keyName.email)
  $("#form4").val(`${keyName.address} ${keyName.city} ${keyName.state}`)
  $("#form5").val(keyName.password)
  $("#form3").val(keyName.lastName)
})


$("#username-button").on("click", function () {

  if (a === 0) {
    $("#form1").prop("disabled", false);
    a = 1
  }
  else if (a === 1) {
    $("#form1").prop("disabled", true);
    a = 0
  }
})


$("#name-button").on("click", function () {
  if (a === 0) {
    $("#form2").prop("disabled", false);
    a = 1
  }
  else if (a === 1) {
    $("#form2").prop("disabled", true);
    a = 0
  }
})

$("#email-button").on("click", function () {
  if (b === 0) {
    $("#form3").prop("disabled", false);
    b = 1
  }
  else if (b === 1) {
    $("#form3").prop("disabled", true);
    b = 0
  }
})

$("#address-button").on("click", function () {
  if (c === 0) {
    $("#form4").prop("disabled", false);
    c = 1
  }
  else if (c === 1) {
    $("#form4").prop("disabled", true);
    c = 0
  }
})

$("#password-button").on("click", function () {
  if (d === 0) {

    $("#form5").attr("type", "text")
    $("#form5").prop("disabled", false);
    d = 1
  }
  else if (d === 1) {
    $("#form5").prop("disabled", true);
    $("#form5").attr("type", "password")
    d = 0
  }
})


$("#save-changes").on("click", function () {


  database.ref("accounts").child($("#form1").val()).push({

  })
})


// database.ref("accounts").child(userName).push({

//   firstName: firstName,
//   lastName: lastName,
//   username: userName,
//   email: email,
//   password: password,
//   address: address, city, state,
//   phone: phone,
//   license: license,
//   carMake: make,
//   carModel: model,
//   MPG: pricePerMile,
//   year: year,
//   driver: driver




// })



