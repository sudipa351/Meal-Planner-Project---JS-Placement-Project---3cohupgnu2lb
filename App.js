const height = document.getElementById("height");
const weight = document.getElementById("weight");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const activity = document.getElementById("activity");
const form = document.getElementById("mealForm");

const submitbtn = document.getElementById("submitBtn");

let bmr = 0;
let calories = 0;
let ingredients;
let steps;
let equipements;

const authId = "8d724cd1d2b844058f34606479cf1c96";

let getData = () => {
  let url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${authId}&timeFrame=day&targetCalories=${calories}`;
  fetch(url)
    .then((res) => res.json())
    .then((responseData) => {
      console.log(responseData.meals);
      document.getElementById("meals").innerHTML = "";
      responseData.meals.forEach((data, index) => {
        let url2 = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${authId}`;
        fetch(url2)
          .then((res) => res.json())
          .then((res) => {
            let imgurl = res.image;
            const htmlData = `
            <div class="car-col">
                <div>
                    <h3>${
                      data.readyInMinutes < 20
                        ? "Brakfast"
                        : index === 1
                        ? "Lunch"
                        : "Dinner"
                    }</h3>
                    <div class="card mealCard">
                        <img src="${imgurl}" alt="meal" class="cardimg">
                        <div class="card-content">
                            <p class="mealName">${data.title}</p>
                            <p class="calories">Calories: ${
                              responseData.nutrients.calories
                            }</p>
                            <button class="reciepbtn" onclick="getRecipe(${
                              data.id
                            })">Get Recipe</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            document.getElementById("meals").innerHTML += htmlData;
          });
      });
      getRecipe(responseData.meals[0].id);
    });
};

function getRecipe(id) {
  console.log(id);
  let url2 = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${authId}`;
  fetch(url2)
    .then((res) => res.json())
    .then((responseData) => {
      console.log(responseData);
      document.getElementById("tabContent").innerHTML = "";

      steps = responseData.analyzedInstructions[0].steps;
      ingredients = responseData.extendedIngredients;
      console.log(ingredients);
      console.log(steps);
      equipements = [];
      steps.forEach((e) => {
        if (e.equipment.length != 0) {
          equipements.push(e.equipment[0]);
        }
      });
      console.log(equipements);
      getIngradients();
    });
}

function getIngradients() {
  document.getElementById("tabContent").innerHTML = "";
  ingredients.forEach((e, index) => {
    const inGradientData = `
            <div class="ingradientItem">
                <p class="itemname">${e.name}</p>
                <span>${e.amount} ${e.unit}</span>
            </div>
        `;
    document.getElementById("tabContent").innerHTML += inGradientData;
  });
}

function getSteps() {
  document.getElementById("tabContent").innerHTML = "";
  steps.forEach((e, index) => {
    const inGradientData = `
            <div class="stepsItem">
                <span class="itemname">Step - ${e.number}</span>
                <span>${e.step}</span>
            </div>
        `;
    document.getElementById("tabContent").innerHTML += inGradientData;
  });
}

function getEquipments() {
  document.getElementById("tabContent").innerHTML = "";
  equipements.forEach((e, index) => {
    const inGradientData = `
            <div class="ingradientItem">
                <p class="itemname">${e.name}</p>
            </div>
        `;
    document.getElementById("tabContent").innerHTML += inGradientData;
  });
}

submitbtn.addEventListener("click", (event) => {
  event.preventDefault();
  const h = parseFloat(height.value);
  const w = parseFloat(weight.value);
  const a = parseFloat(age.value);

  if (gender.value === "woman") {
    bmr = 655.1 + 9.563 * w + 1.85 * h - 4.676 * a;
  } else if (gender.value === "men") {
    bmr = 655.1 + 9.563 * w + 1.85 * h - 4.676 * a;
  }

  if (bmr > 0 && activity.value) {
    if (activity.value === "light") {
      calories = bmr * 1.375;
    } else if (activity.value === "moderate") {
      calories = bmr * 1.55;
    } else if (activity.value === "active") {
      calories = bmr * 1.725;
    }
  }

  getData();
});
