const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");

//function to request server to login
async function handleLogin(email, password) {
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    if (response.ok) {
      window.location.href = "/"
      console.log("logged in");
    } else {
      console.error("Login request failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  handleLogin(email.value, password.value);
});
