let database = firebase.database()


$("#password-reset-button").on("click", function(e){
  
  let username = $("#passwordResetUsername").val().trim()
  let phone = $("#passwordResetPhone").val().trim()
  let email = $("#passwordResetEmail").val().trim()



  if(username === "" || phone === ""){
    console.log("not valid response")
    shakeMe()
  }

  database.ref(username).on("value", function(data){
    let keys = Object.keys(data.val())
    if (username === data.val()[keys[0]].username && phone === data.val()[keys[0]].phone && email === data.val()[keys[0]].email){
      $("#displayPassword").css("display", "block");
      $("#displayPassword").val(data.val()[keys[0]].password)

     
    }

    else{
      shakeMe()
    }
  })



  e.preventDefault()
})




let shakeMe = () => {
  document.getElementById("password-reset-button").disabled = true
  
  let container = $("#password-container")
  container.attr("id", "shake-me")
  let header = $("#change-header");
  header.css("color", "red");
  header.text("User Credentials Not Recognized")
  $("#passwordResetUsername").val("")
  $("#passwordResetPhone").val("")
  $("#passwordResetEmail").val("")

  setTimeout(function(){
    container.attr("id", "password-container")

  },1000)

  setTimeout(function(){
    header.css("color", "#1DB954");
    header.text("Forgot Password")
    document.getElementById("password-reset-button").disabled = false
  },2000)
}