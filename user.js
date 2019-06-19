let a = 0;
let t = 0;



let fillUserName = () => {
  let accountName = localStorage.getItem("username")
  return accountName
}
let database = firebase.database()
let username = fillUserName()




database.ref("accounts").child(username).on("value", function (data) {
  if (t === 0) {

    let keys = Object.keys(data.val())
    let keyName = data.val()[keys[0]]
    $("#form1").val(keyName.username)
    $("#form2").val(keyName.firstName)
    $("#form6").val(keyName.email)
    $("#form4").val(`${keyName.address}`)
    $("#form5").val(keyName.password)
    $("#form3").val(keyName.lastName)
    $("#form12").val(keyName.phone)
    if (keyName.driver === "false") {
      $("#form7").val("No License Info")
      $("#form8").val("No Car Make Info")
      $("#form9").val("No Car Model Info")
      $("#form10").val("No Car year Info")
      $("#form11").val("No MPG Info")
    }
    else {
      $("#form7").val(keyName.license)
      $("#form8").val(keyName.carMake)
      $("#form9").val(keyName.carModel)
      $("#form10").val(keyName.year)
      $("#form11").val(keyName.MPG)
    }
  }
  t++
})

let user = fillUserName()
$("#user-change-btn").on("click", function () {

  let ref = database.ref("accounts").child(user)
  ref.remove()
  database.ref("accounts").child(user).push({
    firstName: $("#form2").val(),
    lastName: $("#form3").val(),
    username: $("#form1").val(),
    email: $("#form6").val(),
    password: $("#form5").val(),
    address: $("#form4").val(),
    phone: $("#form12").val(),
    license: $("#form7").val(),
    carMake: $("#form8").val(),
    carModel: $("#form9").val(),
    MPG: $("#form11").val(),
    year: $("#form10").val(),

  })
  location.reload()

})

$("#password-button").on("click", function () {
  if (a === 0) {
    $("#form5").attr("type", "text")
    $("#password-button").text("Hide")
    a = 1
  }
  else if (a === 1) {
    $("#form5").attr("type", "password")
    $("#password-button").text("Show")
    a = 0
  }

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



