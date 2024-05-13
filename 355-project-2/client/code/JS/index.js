const login = document.getElementById("login");
const searchInput = document.getElementById("search-input");
const recipeDisplay = document.getElementById("recipe-display");
const categoryMenu = document.getElementById("categoryMenu");
const categoryButton = document.getElementById("categoryButton"); 

let lastCategory = null; 

function toggleDropdown() {
  const menu = document.querySelector('.dropdown-menu');
  menu.classList.toggle('show'); 
}

categoryButton.addEventListener('click', toggleDropdown);

async function fetchCategories() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await response.json();
  data.categories.slice(0, 6).forEach(category => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<button class="dropdown-item" type="button" onclick="fetchCategoryRecipes('${category.strCategory}');">${category.strCategory}</button>`;
    categoryMenu.appendChild(listItem);
  });
}

window.fetchCategoryRecipes = async (category) => {
  if (lastCategory === category) {
    recipeDisplay.innerHTML = ""; 
    lastCategory = null; 
  } else {
    lastCategory = category; 
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    const recipeResponse = await fetch(url);
    const recipeData = await recipeResponse.json();
    if (recipeData.meals) {
      displayRecipes(recipeData.meals);
    } else {
      recipeDisplay.innerHTML = "<p>No recipes found in this category.</p>";
    }
  }
  toggleDropdown(); 
}

async function displayRandomMeals() {
  const randomMeals = [];
  for (let i = 0; i < 10; i++) {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    randomMeals.push(data.meals[0]);
  }
  displayRecipes(randomMeals);
}

function displayRecipes(meals) {
  recipeDisplay.innerHTML = meals.map(meal => `
    <div class="meal-display">
      <img class="recipe-display-img" src="${meal.strMealThumb}" alt="${meal.strMeal}" style="max-width: 100%; height: auto;">
      <h2>${meal.strMeal}</h2>
    </div>`
  ).join('');
}

document.addEventListener("DOMContentLoaded", async function () {
  await fetchCategories(); 
  await displayRandomMeals(); 

  const loginResponse = await fetch("/check-login");
  const loginData = await loginResponse.json();

  if (loginData.loggedIn) {
    login.innerText = "Logout";
    login.href = "/logout";
  } else {
    login.innerText = "Login/Sign-up";
    login.href = "/login";
  }

  searchInput.addEventListener("input", async function () {
    const query = searchInput.value.trim();
    let url;
    if (query.length === 1) {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`;
    } else if (query.length > 1) {
      url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
    }

    if (url) {
      const recipeResponse = await fetch(url);
      const recipeData = await recipeResponse.json();

      if (recipeData.meals) {
        displayRecipes([recipeData.meals[0]]); 
      } else {
        recipeDisplay.innerHTML = "<p>Recipe not found. Please try another search.</p>";
      }
    } else {
      recipeDisplay.innerHTML = "";
    }
  });
});

const slideContainer = document.querySelector('.slide-container')
const slideRight = document.querySelector('.right-slide')
const slideLeft = document.querySelector('.left-slide')
const upButton = document.querySelector('.up-button')
const downButton = document.querySelector('.down-button')
const slidesLength = slideRight.querySelectorAll('div').length

let activeSlideIndex = 0

slideLeft.style.top = `-${(slidesLength - 1) * 30}vh`

upButton.addEventListener('click', () => changeSlide('up'))
downButton.addEventListener('click', () => changeSlide('down'))

const changeSlide = (direction) => {
    const sliderHeight = slideContainer.clientHeight
    if(direction === 'up') {
        activeSlideIndex++
        if(activeSlideIndex > slidesLength - 1) {
            activeSlideIndex = 0
        }
    } else if(direction === 'down') {
        activeSlideIndex--
        if(activeSlideIndex < 0) {
            activeSlideIndex = slidesLength - 1
        }
    }

    slideRight.style.transform = `translateY(-${activeSlideIndex * sliderHeight}px)`
    slideLeft.style.transform = `translateY(${activeSlideIndex * sliderHeight}px)`
}