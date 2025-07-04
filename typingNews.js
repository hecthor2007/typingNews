const textGoal = document.getElementById("textGoal");
const typeZone = document.getElementById("typeZone");
const wpmDisplay = document.getElementById("wpmDisplay");
const state = document.getElementById("state");
var goal = "Esta es una prueba para el texto objetivo, despues ira aqui una noticia";
var startTimer = null;
var newsList = [], currentIndex = 0;

async function fetchNews() {
    const response = await fetch("https://api.allorigins.win/raw?url=https://news.yahoo.com/rss");
    const textData = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(textData, "application/xml");
    const items = xml.querySelectorAll("item");
    
    newsList = Array.from(items).map(item => item.querySelector("title").textContent);
    currentIndex = 0;
    goal = newsList[currentIndex];
    textVisualFormat("");
}

async function resetTyping() {
    typeZone.disabled = false;
    typeZone.value = "";
    startTimer = null;
    state.textContent = "";
    wpmDisplay.textContent = "WPM: 0";

        if (currentIndex >= newsList.length) {
        await fetchNews();
}
    goal = newsList[currentIndex];
    currentIndex++;
    typeZone.focus();
    textVisualFormat("");
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
        document.getElementById("contenedor").style.display = "none";
        document.getElementById("resultsScreen").style.display = "block";
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
        document.getElementById("resultsScreen").style.display = "none";
        document.getElementById("contenedor").style.display = "flex";
    }
});

fetchNews();
textVisualFormat("");
currentIndex++;
