const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.getElementById("submit");
const passGenerateBtn = document.querySelector(".pass-btn");
const generatePasswordBtn = document.getElementById("generate");
const resultEl = document.querySelector(".result");
const resultContainer = document.querySelector(".result-container");
const lengthEl = document.getElementById("length");
const popup = document.getElementById("popup");
const clipboard = document.getElementById('clipboard')

// function to validate name
function validateName(name) {
  const pattern = /^[a-zA-Z]+$/;
  return pattern.test(name);
}

//function to validate username contains letters and numbers
function validUsername(username) {
  const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
  return pattern.test(username);
}

//function to validate email
function validateEmail(email) {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
}

//function to validate password contains lowercase and uppercase letters, symbols, numbers and at least 8 characters long
function validatePassword(password) {
  const pattern =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return pattern.test(password);
}

//when submit button is clicked validate all the input fields
submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!validateName(firstName.value)) {
    alert("Invalid first name");
  }
  if (!validateName(lastName.value)) {
    alert("Invalide last name");
  }
  if (!validUsername(username.value)) {
    alert("Invalid user name. Please use letters and numbers");
  }
  if (!validateEmail(email.value)) {
    alert("Invalid email");
  }
  if (!validatePassword(password.value)) {
    alert(
      "Invalid password. Please make the password at least 8 characters long with uppercase and lowercase letter, symbols and numbers"
    );
  }
});

//generate password button to open pop up
passGenerateBtn.addEventListener("click", (event) => {
  event.preventDefault();
  popup.style.display = "block";
});
const randomFunc = {
  lower: getRandomLower,
  upper: getRandomUpper,
  number: getRandomNumber,
  symbol: getRandomSymbol,
};

generatePasswordBtn.addEventListener("click", (event) => {
    event.preventDefault();
  let len = lengthEl.value;
resultContainer.style.padding = "5px"
  resultEl.innerText = generatePassword(len);
});

function generatePassword(len) {
  let generatedPassword = "";
  const typesArr = ["lower", "upper", "number", "symbol"];
  for (let i = 0; i < len; i++) {
    typesArr.forEach((type) => {
      generatedPassword += randomFunc[type]();
    });
  }
  const finalPass = generatedPassword.slice(0,len);
  return finalPass
}
clipboard.addEventListener("click", (event)=>{
    event.preventDefault()
    const textArea = document.createElement('textarea');
    const password = resultEl.innerText;
    if(!password){
        return
    }
    textArea.value = password;
    document.body.appendChild(textArea);
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
})
function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
  const symbols = "!@#$%^&*(){}[]=<>?,.";
  return symbols[Math.floor(Math.random() * symbols.length)];
}

