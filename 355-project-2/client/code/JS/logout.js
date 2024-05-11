const submitBtn = document.getElementById("submit");
const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");

//function to request server to logout
async function handleLogout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      console.log("logout success");
    } else {
      console.error("Logout failed!");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

//when submit button is clicked, if the user chooses yes for logout, he gets logged out else, redirected to home page
submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (yesBtn.checked) {
    handleLogout();
  } else {
    window.location.href = "/";
  }
});
