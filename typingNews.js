const textGoal = document.getElementById("textGoal");
const typeZone = document.getElementById("typeZone");
const state = document.getElementById("state");
var goal = "Esta es una prueba para el texto objetivo, despues ira aqui una noticia";

function textVisualFormat (userInput)
{
let visualText = "";

for(let i = 0; i < goal.length; i++)
{
    const goalLetter = goal[i];
    const userLetter = userInput[i];

    if(userLetter === undefined)
    {
        visualText +=`<span class="pendiente">${goalLetter}</span>`;
    }
    else if(userLetter === goalLetter)
    {
        visualText += `<span class="correcta">${goalLetter}</span>`;
    }
    else
    {
        visualText += `<span class="incorrecta">${goalLetter}</span>`;
    }
}
textGoal.innerHTML = visualText;
}

typeZone.addEventListener(
"input", () => 
{
    const userText = typeZone.value;

    textVisualFormat(userText);

    if (userText === goal) {
        state.textContent = "finished!!";
        typeZone.disabled = true;
    }
    else
    {
        state.textContent = "";
    }
}
);
textVisualFormat("");
