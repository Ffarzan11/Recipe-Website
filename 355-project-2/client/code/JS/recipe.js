const login = document.getElementById("login");
const ratings = document.querySelectorAll(".rating");
const ratingsContainer = document.querySelector(".ratings-container");
const sendBtn = document.querySelector("#send");
const panel = document.querySelector("#panel");
const favoriteBtn = document.querySelector(".heart-btn");
const recipeName = document.getElementById("recipe-name");
const recipeImg = document.getElementById("recipe-img");
const ingredientsList = document.querySelector(".ingredients-list");
const instructionDesc = document.querySelector(".instructions-desc");
const toasts = document.getElementById("toasts");
let selectedRating = "Yes";
const message = "Recipe saved to favorites!";
const msgType = "success";
let mealId;
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

  const queryParams = new URLSearchParams(window.location.search);
  mealId = queryParams.get("id");
  if (mealId) {
    await fetchRecipeDetails(mealId);
    console.log(mealId);
  }
});

async function fetchRecipeDetails(mealId) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const jsonResponse = await response.json();
  const recipe = jsonResponse.meals[0];
  displayRecipe(recipe);
}

function displayRecipe(recipe) {
  recipeName.textContent = recipe["strMeal"];
  //appending recipe image
  if (recipe.strMealThumb != null) {
    recipeImg.src = recipe.strMealThumb;
  }

  //appending ingredients to recipe page
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const listItem = document.createElement("li");
      listItem.textContent = `${ingredient} - ${measure}`;
      ingredientsList.appendChild(listItem);
    }
  }

  const instructions = recipe["strInstructions"];
  instructionDesc.textContent = instructions;
}

favoriteBtn.addEventListener("click", async () => {
  const response = await fetch("/check-login");
  const data = await response.json();
  if (data.loggedIn) {
    try {
      const response = await fetch("/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: mealId,
          recipeName: recipeName.textContent,
          recipeImgSrc: recipeImg.src,
        }),
      });
      if (response.ok) {
        createNotification();
      }
    } catch (error) {
      console.error("Error adding favorites", error);
    }
  } else {
    alert("Please log in to add favorites");
  }
});

function createNotification() {
  const notif = document.createElement("div");
  notif.classList.add("toast");
  notif.classList.add(msgType);

  notif.innerText = message;

  toasts.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 3000);
}

ratingsContainer.addEventListener("click", (e) => {
  if (
    e.target.parentNode.classList.contains("rating") &&
    e.target.nextElementSibling
  ) {
    removeActive();
    e.target.parentNode.classList.add("active");
    selectedRating = e.target.nextElementSibling.innerHTML;
  } else if (
    e.target.parentNode.classList.contains("rating") &&
    e.target.previousSibling &&
    e.target.previousElementSibling.nodeName === "IMG"
  ) {
    removeActive();
    e.target.parentNode.classList.add("active");
    selectedRating = e.target.innerHTML;
  }
});

//actions to submit feeback
sendBtn.addEventListener("click", async (e) => {
  const response = await fetch("/check-login");
  const data = await response.json();
  if (data.loggedIn) {
    try {
      const response = await fetch("/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName: recipeName.textContent,
          feedback: selectedRating,
        }),
      });
      if (response.ok) {
        panel.innerHTML = `
        <img src="img/emoji/heart.png" alt="" />
        <strong>Thank You!</strong>
        <br>
        <strong>Feedback: ${selectedRating}</strong>
        <p>We'll use your feedback to improve our customer support</p>
    `;
      }
    } catch (err) {
      console.log("Error submitting feedback: " + err);
    }
  } else {
    alert("Please log in to submit a feedback");
  }
});

function removeActive() {
  for (let i = 0; i < ratings.length; i++) {
    ratings[i].classList.remove("active");
  }
}
