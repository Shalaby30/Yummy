let row = document.getElementById("rowMeal");
let rowSearch = document.getElementById("rowSearch");
let allCategories = [];
let allMeals = [];
let allArea = [];
let allMealsByArea = [];
let allIngredients = [];
let searchResults = [];


//////////////////////////////////  first Page  ///////////////////////////////////

window.addEventListener("load", function() {
  load()
});

function load() {
  $("body").css("overflow", "hidden"); 
  $(".loading").fadeIn(1200, function() {
    $(".loading").fadeOut(1200, function() {
      $("body").css("overflow", "visible"); 
    });
  });
}

NameSearch("")

//////////////////////////////////  Display Meals  ///////////////////////////////////

function displayMeals(meals) {
  row.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    row.innerHTML  += `
    <div class="col-md-3 ">
      <div class="inner click position-relative" onclick="getMealDetails('${meals[i].idMeal}')">
        <div>
          <img src="${meals[i].strMealThumb}" class="w-100 rounded-2" alt="">
        </div>
        <div class="layer rounded-2 text-center">
          <h3 class="mt-2" id="${meals[i].strMeal}">${meals[i].strMeal}</h3>
        </div>
      </div>
    </div>`;  
  }
  
}

//////////////////////////////////  Categories  ///////////////////////////////////

async function getCategories() {
  close()
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  let Categories = await response.json();
  allCategories = Categories.categories;
  displayCategories();
  load();
}


function displayCategories() {
  rowSearch.innerHTML = "";
  row.innerHTML  = "";
  for (let i = 0; i < allCategories.length; i++) {
    row.innerHTML += `
    <div class="col-md-3 ">
      <div class="inner click position-relative" onclick="getMealsByCategory('${allCategories[i].strCategory}')">
        <div>
          <img src="${allCategories[i].strCategoryThumb}" class="w-100 rounded-2 bg-white" alt="">
        </div>
        <div class="layer rounded-2 text-center">
          <h3 class="mt-2" id="${allCategories[i].strCategory}">${allCategories[i].strCategory}</h3>
          <p>${allCategories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
      </div>
    </div>
    `; 
  }
  
}

async function getMealsByCategory(category) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  let meals = await response.json();
  allMeals = meals.meals;
  load()
  displayMeals(allMeals);
}

//////////////////////////////////  Areas  ///////////////////////////////////

async function getArea() {
  load()
  rowSearch.innerHTML = "";
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  let Areas = await response.json();
  allArea = Areas.meals;
  displayArea();
}

function displayArea() {
  close()
  row.innerHTML = "";
  for (let i = 0; i < allArea.length; i++) {
    row.innerHTML += `
    <div class="col-md-3 ">
      <div onclick="getAreaMeals('${allArea[i].strArea}')" class="rounded-2 text-center text-white click ">
        <i class="fa-solid fa-house-laptop fa-4x"></i>
        <h3>${allArea[i].strArea}</h3>
      </div>
    </div>
    `
  }
}

async function getAreaMeals(area) {
  row.innerHTML = '';
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let meals = await response.json();
  allMealsByArea = meals.meals;
  load()
  displayMeals(allMealsByArea);
}

//////////////////////////////////  Ingredients  ///////////////////////////////////

async function getIngredients() {
  load()
  row.innerHTML
  row.innerHTML = '';
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  let Ingredients = await response.json();
  allIngredients = Ingredients.meals;
  displayIngredients();
  close()
}



function displayIngredients() {
  rowSearch.innerHTML = "";
  row.innerHTML = '';
  for (let i = 0; i < 20; i++) {
    row.innerHTML += `
    <div class="col-md-3 ">
                <div onclick="getIngredientsMeals('${allIngredients[i].strIngredient}')" class="rounded-2 text-center click text-white">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${allIngredients[i].strIngredient}</h3>
                        <p>${allIngredients[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
    `
  }
}

async function getIngredientsMeals(ingredient) {
  row.innerHTML = '';
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  let meals = await response.json();
  allMealsByIngredients = meals.meals;
  load()
  displayMeals(allMealsByIngredients);
}

//////////////////////////////////  Meal Details  ///////////////////////////////////

async function getMealDetails(mealID) {
  load()
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  let meal = await response.json();
  mealDetails = meal.meals[0];
  displayMealDetails();
  close()
}

function displayMealDetails() {

  let Cards = "";

  // Assuming mealDetails is populated with the meal data
  let allMealIngredients = [];
  for (let i = 1; i <= allMealIngredients.length; i++) {
      if (mealDetails[`strIngredient${i}`]) {
          allMealIngredients.push({
              ingredient: mealDetails[`strIngredient${i}`],
              measure: mealDetails[`strMeasure${i}`]
          });
      }
  }

  Cards += `
  <div class="row">
      <div class="col-md-4">
          <img class="w-100 rounded-3" src="${mealDetails.strMealThumb}" alt="${mealDetails.strMeal}" />
          <h1 class="mt-3">${mealDetails.strMeal}</h1>
      </div>
      <div class="col-md-8">
          <h2>Instructions</h2>
          <p>${mealDetails.strInstructions}</p>
          <h2><span class="fw-bolder">Area: </span>${mealDetails.strArea}</h2>
          <h2><span class="fw-bolder">Category: </span>${mealDetails.strCategory}</h2>
          <h3 class="fw-bolder mt-2">Recipes:</h3>
          <ul class="list-unstyled d-flex ms-0 g-3 flex-wrap" id="ingredients-list">
  `;

  // Generating ingredients list
  allMealIngredients.forEach(ingredient => {
      Cards += `
          <li class="alert alert-info m-2 p-1">${ingredient.measure} ${ingredient.ingredient}</li>
      `;
  });

  Cards += `
          </ul>
  `;

  // Only add the tags section if tags are not null
  if (mealDetails.strTags) {
      Cards += `
          <h3>Tags</h3>
          <ul class="list-unstyled d-flex ms-0 g-3">
              <li class="bg-info rounded-2 m-2 p-1">${mealDetails.strTags}</li>
          </ul>
      `;
  }

  Cards += `
          <a target="_blank" href="${mealDetails.strSource}" class="btn btn-success">Source</a>
          <a target="_blank" href="${mealDetails.strYoutube}" class="btn btn-danger">Youtube</a>
      </div>
  </div>
  `;

  row.innerHTML = Cards;
}


//////////////////////////////////  Meal Search  ///////////////////////////////////

function displaySearch() {
  load()
  close()
  row.innerHTML = ""
  rowSearch.innerHTML = `
  
      <div class="col-md-6  ">
          <input onkeyup="NameSearch(this.value)" class="form-control bg-white  " type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input onkeyup="letterSearch(this.value)" class="form-control bg-white " maxlength="1" type="text" placeholder="Search By First Letter">
      </div>
  `

 
}

async function NameSearch(mealName) {
  
  row.innerHTML = ""
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
  let data = await response.json()
  let searchResults = data.meals
  displayMeals(searchResults)
}

async function letterSearch(letter) {
  load()
  row.innerHTML = ""
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
  let data = await response.json()
  let searchResults = data.meals
  displayMeals(searchResults)
}





//////////////////////////////////  Contact us  ///////////////////////////////////


function displayContacts() {
  load()
  close()
    // Assuming `row` is defined elsewhere in your code
    row.innerHTML = `
        <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
            <div class="container w-75 text-center">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" onkeyup="nameValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" onkeyup="emailValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Email not valid (example@yyy.zzz)
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" onkeyup="phoneValidation()" type="text" class="form-control" placeholder="Enter Your Phone">
                        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid Phone Number
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" onkeyup="ageValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid age
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" onkeyup="passValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Enter valid password (Minimum eight characters, at least one letter and one number)
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" onkeyup="pass2Validation()" type="password" class="form-control" placeholder="Re-enter Your Password">
                        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                            Passwords do not match
                        </div>
                    </div>
                </div>
                <button id="submitBtn"  class="btn btn-outline-danger click px-2 mt-3">Submit</button>
            </div>
        </div>
    `;
  }
  
  let inputTouched = {
    name: false,
    email: false,
    phone: false,
    age: false,
    password: false,
    repassword: false
  };
  
  
  function nameValidation() {
    var pattern = new RegExp(/^[a-zA-Z\s]+$/);
    if (!pattern.test(document.getElementById("nameInput").value)) {
      document.getElementById("nameAlert").classList.remove("d-none");
      return true;
    } else {
      document.getElementById("nameAlert").classList.add("d-none");
      return false;
    }
  }
  
  function emailValidation() {
    var pattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
    if (!pattern.test(document.getElementById("emailInput").value)) {
    document.getElementById("emailAlert").classList.remove("d-none");
    return true;
  } else {
    document.getElementById("emailAlert").classList.add("d-none");
    return false;
  }
}

function phoneValidation() {
  var pattern = new RegExp(/^01[0-2,5]{1}[0-9]{8}$/);
  if (!pattern.test(document.getElementById("phoneInput").value)) {
    document.getElementById("phoneAlert").classList.remove("d-none");
    return true;
  } else {
    document.getElementById("phoneAlert").classList.add("d-none");
    return false;
  }
}

function ageValidation() {
  var pattern = new RegExp(/^[0-9]+$/);
  if (!pattern.test(document.getElementById("ageInput").value)) {
    document.getElementById("ageAlert").classList.remove("d-none");
    return true;
  } else {
    document.getElementById("ageAlert").classList.add("d-none");
    return false;
  }
}

function passValidation() {
  var pattern = new RegExp(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/);
  if (!pattern.test(document.getElementById("passwordInput").value)) {
    document.getElementById("passwordAlert").classList.remove("d-none");
    return true;
  } else {
    document.getElementById("passwordAlert").classList.add("d-none");
    return false;
  } 
}

function pass2Validation() {
  if (document.getElementById("passwordInput").value !== document.getElementById("repasswordInput").value) {
    document.getElementById("repasswordAlert").classList.remove("d-none");
    return true;
  } else {
    document.getElementById("repasswordAlert").classList.add("d-none");
    return false;
  }
}




//////////////////////////////////  SiteBar a  ///////////////////////////////////

document.getElementById("activeSearch").addEventListener("click", displaySearch );
document.getElementById("activeCategories").addEventListener("click", getCategories );
document.getElementById("activeArea").addEventListener("click", getArea ); 
document.getElementById("activeIngredients").addEventListener("click", getIngredients );
document.getElementById("activeContact").addEventListener("click", displayContacts);

//////////////////////////////////  SiteBar   ///////////////////////////////////

$(document).ready(function() {
  let leftWidth = $("#leftSide").innerWidth();
  $("#sideBar").css('left', -leftWidth);
  function openSideNav() {
    $("#sideBar").animate({ left: 0 }, 650);
    $(".Buttn").attr("class", "fas fa-xmark fs-2 Buttn click");
  }


  function closeSideNav() {
    $("#sideBar").animate({ left: -leftWidth }, 650);
    $(".Buttn").attr("class", "fas fa-align-justify fs-2 Buttn click");
  }


  closeSideNav();

 
  $("#rightSide .Buttn").on("click", function() {
    let offset = $("#sideBar").offset().left;
    if (offset === 0) {
      closeSideNav();
    } else {
      openSideNav();
    }
  });

});


function close() {
  $(".Buttn").attr("class", "fas fa-align-justify fs-2 Buttn click");
  let leftWidth = $("#leftSide").innerWidth();
  $("#sideBar").animate({ left: -leftWidth }, 500);
}


