const login = document.getElementById("login");
const favorites = document.querySelector(".favorites");
const toasts = document.getElementById("toasts");
const messageSuccess = "Deleted successfully ";
const messageError = "Delete failed";
const msgTypeSuccess = "success";
const msgTypeError = "error";

//checks if the user is logged in
document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("/check-login");
  const data = await response.json();
  //perform action if the user is logged in
  if (data.loggedIn) {
    login.innerText = "Logout";
    login.href = "/logout";
    await fetchFavDetails();
  } else {
    login.innerText = "Login/Sign-up";
    login.href = "/login";
  }
});

//fetch favorite recipes of the user
async function fetchFavDetails() {
  const response = await fetch("/favoriteMeals");
  const data = await response.json();
  if (data.hasFav) {
    data.favorites.forEach((fav) => {
      let recipeContainer = document.createElement("div");
      recipeContainer.classList.add("recipe-container");

      let recipeImgDiv = document.createElement("div");
      recipeImgDiv.classList.add("recipe-image");
      let recipeImg = document.createElement("img");
      recipeImg.src = fav.image;
      recipeImg.alt = fav.recipe;
      recipeImgDiv.appendChild(recipeImg);

      let recipeNameDiv = document.createElement("div");
      recipeNameDiv.classList.add("recipe-name");
      let recipeLink = document.createElement("a");
      recipeLink.href = `/recipe?id=${fav.id}`;
      recipeLink.textContent = fav.recipe;
      recipeNameDiv.appendChild(recipeLink);

      let deleteBtnDiv = document.createElement("div");
      deleteBtnDiv.classList.add("delete-recipe");
      let deleteBtn = document.createElement("button");
      deleteBtn.classList.add("deleteBtn");
      deleteBtn.id = fav.id;
      let trashIcon = document.createElement("i");
      trashIcon.classList.add("fa", "fa-trash");
      deleteBtn.appendChild(trashIcon);
      deleteBtnDiv.appendChild(deleteBtn);

      recipeContainer.appendChild(recipeImgDiv);
      recipeContainer.appendChild(recipeNameDiv);
      recipeContainer.appendChild(deleteBtnDiv);

      favorites.appendChild(recipeContainer);

      deleteBtn.addEventListener("click", async (req, res) => {
        try {
          const response = await fetch("/deleteFavorite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ recipeId: deleteBtn.id }),
          });
          if (response.ok) {
            createNotificationSucess();
            recipeContainer.remove();
          } else {
            createNotificationError();
          }
        } catch (err) {
          console.log("Error in delete " + err);
        }
      });
    });
  } else {
    alert("Unable to show favorites");
  }
}

function createNotificationSucess() {
  const notif = document.createElement("div");
  notif.classList.add("toast");
  notif.classList.add(msgTypeSuccess);

  notif.innerText = messageSuccess;

  toasts.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 3000);
}

function createNotificationError() {
  const notif = document.createElement("div");
  notif.classList.add("toast");
  notif.classList.add(msgTypeError);

  notif.innerText = messageError;

  toasts.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 3000);
}
