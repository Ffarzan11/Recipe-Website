const login = document.getElementById("login");
document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("/check-login");
  const data = await response.json();
  //perform action if the user is logged in
  if (data.loggedIn) {
    login.innerText = "Logout";
    login.href = "/logout";
  } else {
    login.innerText = "Login/Sign-up";
    login.href = "/login";
  }
});
