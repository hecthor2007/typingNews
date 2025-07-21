const textGoal = document.getElementById("textGoal");
const typeZone = document.getElementById("typeZone");
const wpmDisplay = document.getElementById("wpmDisplay");
const state = document.getElementById("state");
var goal = "Esta es una prueba para el texto objetivo, despues ira aqui una noticia";
var startTimer = null;
var settings = {
    lazyUpperCase: false,
    lazySpecialCase: false
};
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
    currentIndex++;
}

async function resetTyping() {
    typeZone.disabled = false;
    typeZone.value = "";
    startTimer = null;
    state.textContent = "";
    wpmDisplay.textContent = "WPM: 0";

    // Si se acabaron las noticias, espera nuevas
    if (currentIndex >= newsList.length) {
        await fetchNews();
    }

    // Después de obtener nuevas noticias, asegúrate de tener un goal válido
    if (newsList.length > 0) {
        goal = newsList[currentIndex];
        goalFormat();
        currentIndex++;
        textVisualFormat("");
    } else {
        goal = "No hay noticias disponibles.";
        textVisualFormat("");
    }

    typeZone.focus();
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
        visualText +=`<span class="correct">${goalLetter}</span>`;
    }
    else
    {
        visualText +=`<span class="incorrect">${goalLetter}</span>`;
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

function goalFormat()
{
    if(settings.lazyUpperCase)
    {
        goal = goal.toLowerCase();
    }
    if(settings.lazySpecialCase)
    {
    goal = goal.replace(/[^a-zA-Z0-9\s]/g, '');
    }
}

function tabSwitch(actualTab)
{
    switch(actualTab)
    {
        case "focus":
        document.getElementById("container").style.display = "flex";
        document.getElementById("noFocus").style.display = "none";
        document.getElementById("resultsScreen").style.display = "none";
        break;
        case "noFocus":
        document.getElementById("container").style.display = "none";
        document.getElementById("noFocus").style.display = "block";
        document.getElementById("resultsScreen").style.display = "none";
        break;
        case "finished":
        document.getElementById("container").style.display = "none";
        document.getElementById("noFocus").style.display = "none";
        document.getElementById("resultsScreen").style.display = "block";
        break;
    }
}

function focusCheck()
{
        const container = document.getElementById("container");
    container.addEventListener("click", () => {
        tabSwitch("focus");
        typeZone.focus();
    });
    const noFocus = document.getElementById("noFocus");
    noFocus.addEventListener("click", () => {
        tabSwitch("focus");
        typeZone.focus();
    });

typeZone.addEventListener("blur", () => {
    tabSwitch("noFocus");
});

typeZone.addEventListener("focus", () => {
    tabSwitch("focus");
});
}

function configCheck()
{
    const UpperCaseCheckbox = document.getElementById("lazyUpperCaseBox");
    UpperCaseCheckbox.addEventListener("change", function () {
    settings.lazyUpperCase = UpperCaseCheckbox.checked;
    goalFormat();                     // reformat
    textVisualFormat(typeZone.value);
});
    const specialCaseCheckbox = document.getElementById("lazySpecialCaseBox");
    specialCaseCheckbox.addEventListener("change", function () {
    settings.lazySpecialCase = specialCaseCheckbox.checked;
    goalFormat();                     // reformat
    textVisualFormat(typeZone.value);
});
}

//no para-code start

typeZone.addEventListener
(
"input", () => 
{
    const userText = typeZone.value;

    if (startTimer === null && userText.length > 0) {
        startTimer = Date.now();//start timer
    }

    textVisualFormat(userText);
    wpmCalculate(userText);

    if (userText.length === goal.length) {
        state.textContent = "finished!! press space to continue";
        typeZone.disabled = true;
        tabSwitch("finished");
        startTimer = null;//finish timer
    }
    else
    {
        state.textContent = "";
    }
}
);
document.addEventListener("keydown", (event) => {
    if (typeZone.disabled && (event.key === " ")) {
        event.preventDefault();
        resetTyping();
        tabSwitch("focus");
        typeZone.focus();
    }
});

focusCheck();
configCheck();
resetTyping();//for text init 