const textGoal = document.getElementById("textGoal");
const typeZone = document.getElementById("typeZone");
const wpmDisplay = document.getElementById("wpmDisplay");
const state = document.getElementById("state");
var goal = "Esta es una prueba para el texto objetivo, despues ira aqui una noticia";
var startTimer = null;

const apiKey = "beced55d853b46769ce4a2b96bddc744";
const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;

function fetchNews()
{
    fetch(url)
    .then(response => response.json())
    .then(data => {
        goal = data.articles[0].title;
        textVisualFormat("");
    });
}

function textVisualFormat (userInput)
{
let visualText = "";

for(let i = 0; i < goal.length; i++)
{
    const goalLetter = goal[i];
    const userLetter = userInput[i];

    if(userLetter === undefined)
    {
        visualText +=`<span class="pending">${goalLetter}</span>`;
    }
    else if(userLetter === goalLetter)
    {
        visualText += `<span class="correct">${goalLetter}</span>`;
    }
    else
    {
        visualText += `<span class="incorrect">${goalLetter}</span>`;
    }
}
textGoal.innerHTML = visualText;
}

function wpmCalculate(userText)
{
    if (startTimer !== null) {
        const now = Date.now();
        const elapsedTimeInMinutes = (now - startTimer) / 1000 / 60;
    
        const characterCount = userText.length;
        const wpm = Math.round((characterCount / 5) / elapsedTimeInMinutes);

        wpmDisplay.textContent = `WPM:${wpm}`;
    }
}

function resetTyping() {
    typeZone.disabled = false;
    typeZone.value = "";
    startTimer = null;
    state.textContent = "";
    wpmDisplay.textContent = "WPM: 0";
    textVisualFormat("");
    typeZone.focus();
    goal = data.articles[requestCont].title;
}

typeZone.addEventListener
(
"input", () => 
{
    const userText = typeZone.value;

    if (startTimer === null && userText.length > 0) {
        startTimer = Date.now();//empieza el contador
    }

    textVisualFormat(userText);
    wpmCalculate(userText);

    if (userText.length === goal.length) {
        state.textContent = "finished!! press space to continue";
        typeZone.disabled = true;
        startTimer = null;//termina el contador
    }
    else
    {
        state.textContent = "";
    }
}
);
document.addEventListener("keydown", (event) => {
    if (typeZone.disabled && (event.key === " ")) {
        resetTyping();
    }
});

fetchNews();
textVisualFormat("");
