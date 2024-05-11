const login = document.getElementById("login");

//MAKE SURE FAVORITES ARE SHOWN ONLY IF THE USER IS LOGGED IN

//checks if the user is logged in
document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("/check-login");
  const data = await response.json();
  console.log(data.loggedIn);
  //perform action if the user is logged in
  if (data.loggedIn) {
    login.innerText = "Logout";
    login.href = "/logout";

    /* Rest of the code will probably go here */
    
  } else {
    console.log("Logged out");
    login.innerText = "Login/Sign-up";
    login.href = "/login";
  }
});
