const quoteBtn    = document.getElementById("quoteBtn");
const activityBtn = document.getElementById("activityBtn");
const adviceBtn   = document.getElementById("adviceBtn");

const quoteEl    = document.getElementById("quote");
const activityEl = document.getElementById("activity");
const adviceEl   = document.getElementById("advice");

quoteBtn.addEventListener("click", getQuote);
activityBtn.addEventListener("click", getActivity);
adviceBtn.addEventListener("click", getAdvice);

async function getQuote() {
    quoteEl.innerText = "Loading...";

    try {
        const response = await fetch("https://dummyjson.com/quotes/random");
        const data = await response.json();
        quoteEl.innerText = '"' + data.quote + '" — ' + data.author;
    } catch (error) {
        quoteEl.innerText = "Failed to load quote.";
    }
}

async function getActivity() {
    activityEl.innerText = "Loading...";

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
        const data = await response.json();
        const meal     = data.meals[0].strMeal;
        const category = data.meals[0].strCategory;
        activityEl.innerText = "Try cooking: " + meal + " (" + category + ")";
    } catch (error) {
        activityEl.innerText = "Failed to load activity.";
    }
}

async function getAdvice() {
    adviceEl.innerText = "Loading...";

    try {
        const response = await fetch("https://api.adviceslip.com/advice?t=" + Date.now());
        const data = await response.json();
        adviceEl.innerText = data.slip.advice;
    } catch (error) {
        adviceEl.innerText = "Failed to load advice.";
    }
}