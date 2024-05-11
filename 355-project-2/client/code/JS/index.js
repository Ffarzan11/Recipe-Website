const login = document.getElementById("login");

//checks if the user is logged in
document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("/check-login");
  const data = await response.json();
  console.log(data.loggedIn);
  //updates navigation is the user is logged in
  if (data.loggedIn) {
    login.innerText = "Logout";
    login.href = "/logout";
  } else {
    console.log("Logged out");
    login.innerText = "Login/Sign-up";
    login.href = "/login";
  }
});
