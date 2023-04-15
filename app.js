const input = document.querySelector('input');
const searchBtn = document.querySelector('.search');
const randomBtn = document.querySelector('.random');
const mealsContainer = document.querySelector('.meals__container');
const modalOverlay = document.querySelector('.modal__overlay');
// const API_KEY = 'ea6b8eb1aecc43139ab034bf99ba82bd';
const API_KEY = '366ad20a87354522acbe141c1fc4a381';
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

async function getMeal(term) {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${term}`
  );
  const data = await res.json();
  return data;
}

function createMeals(mealsData) {
  mealsContainer.innerHTML = '';
  mealsData.results.forEach((mealData) => {
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.dataset.id = mealData.id;
    meal.innerHTML = `
    <img class="meal__img" src="${mealData.image}" alt="" />
    <div class="info">
      <h2 class="meal__name">${mealData.title}</h2>
      <button class="meal__details">Meal details</button>
    </div>
    `;
    mealsContainer.append(meal);
  });
}

async function showMeal() {
  const mealsData = await getMeal(input.value);
  createMeals(mealsData);
  mealsContainer.classList.remove('random__meal__container');
}

async function mealDetails(id) {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
  );
  const data = await res.json();
  return data;
}

//

async function showModal(e) {
  if (e.target.classList.contains('meal__details')) {
    const id = e.target.parentElement.parentElement.dataset.id;
    const info = await mealDetails(id);

    const ingredients = info.extendedIngredients.map((item) => {
      return item.name;
    });

    const wrapper = document.createElement('div');
    ingredients.forEach((item) => {
      const span = document.createElement('span');
      span.textContent = item;
      wrapper.append(span);
    });

    wrapper.classList.add('ingredients');

    modalOverlay.innerHTML = `
    <div class="meal__modal">
    <button class="close__modal"><i class="fa-solid fa-x"></i></button>
    <h2 class="recipe__title">${info.title}</h2>
    <img class="recipe__img" src="${info.image}" alt="" />
    <p class="recipe__description">${info.instructions}</p>
    <p class="ingredients__title">ingredients</p>
  </div>
    `;
    const mealModal = modalOverlay.querySelector('.meal__modal');
    mealModal.append(wrapper);
    modalOverlay.style.display = 'flex';
  }
}

async function getRandomMeal() {
  const res = await fetch(
    `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}`
  );
  const data = await res.json();
  return data;
}

async function showRandomMeal() {
  mealsContainer.innerHTML = '';
  const randomMealData = await getRandomMeal();

  const ingredients = randomMealData.recipes[0].extendedIngredients.map(
    (item) => {
      return item.name;
    }
  );

  const wrapper = document.createElement('div'); // ingredients container
  ingredients.forEach((item) => {
    const span = document.createElement('span');
    span.textContent = item;
    wrapper.append(span);
  });
  wrapper.classList.add('ingredients');

  const randomMealElm = document.createElement('div'); //main container
  randomMealElm.classList.add('random__recipe');
  randomMealElm.innerHTML = `
    <h2 class="recipe__title">${randomMealData.recipes[0].title}</h2>
    <img class="recipe__img" src="${randomMealData.recipes[0].image}" alt="" />
    <p class="recipe__description">${randomMealData.recipes[0].instructions}</p>
    <p class="ingredients__title">ingredients</p>
    `;
  randomMealElm.append(wrapper);
  mealsContainer.append(randomMealElm);
  mealsContainer.classList.add('random__meal__container');
}

searchBtn.addEventListener('click', showMeal);

randomBtn.addEventListener('click', showRandomMeal);

document.body.addEventListener('click', showModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target.classList.contains('close__modal')) {
    modalOverlay.style.display = 'none';
  }
});
