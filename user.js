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
  if(keyName.driver === "false"){
    $("#form7").val("No License Info")
    $("#form8").val("No Car Make Info")
    $("#form9").val("No Car Model Info")
    $("#form10").val("No Car year Info")
    $("#form11").val("No MPG Info")
  }
  else{
    $("#form7").val(keyName.license)
    $("#form8").val(keyName.carMake)
    $("#form9").val(keyName.carModel)
    $("#form10").val(keyName.year)
    $("#form11").val(keyName.MPG)
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



