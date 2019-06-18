


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
  $("#form2").val(`${keyName.firstName} ${keyName.lastName}`)
  $("#form3").val(keyName.email)
  $("#form4").val(`${keyName.address} ${keyName.city} ${keyName.state}`)
  $("#form5").val(keyName.password)
})


$("#username-button").on("click", function () {
 $("#form1").prop("disabled",false);
 $("#username-button").attr("id", "a")
 console.log(this)

})


$("#a").on("click", function(){
  $("#form1").props("disabled",true);
  console.log("checking")
  $("#a").attr("id", "username-button")
})

$("#name-button").on("click", function () {
  $("#form1").prop("disabled", "true")
})

$("#email-button").on("click", function () {
  $("#form1").disabled = false
})

$("#address-button").on("click", function () {
  $("#form1").disabled = false
})

$("#password-button").on("click", function () {
  $("#form1").disabled = false
})

