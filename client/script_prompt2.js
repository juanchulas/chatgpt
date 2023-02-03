import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}


// sin el prompt

const text = "Crear una lista de 10 nombres de categorías que agrupan palabras claves importantes para pagar en google para Bancolombia Banco y organizar la lista de mayor a menor relevancia incluyendo número de línea al princpio de cada línea siguiente el siguiente ejemplo 1:, luego al frente de cada nombre de categoría agregue : y luego la explicación del contenido de la categoría";


function preguntaPrompt(){
    console.log("se ejecuta a los 2 segundos");
    const uniqueId = generateUniqueId()
   // chatContainer.innerHTML += chatStripe(false, " ", uniqueId)
    const messageDiv = document.getElementById(uniqueId)
    chatContainer.innerHTML += chatStripe(false, text)
    //typeText(messageDiv, text);
    setTimeout(respuestaPromt, 1000);

}

async function respuestaPromt (){

    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId)
    loader(messageDiv);


    const response = await fetch('https://dentsu-ai.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: text
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "presentamos problemas actualmente"
        console.log(err)
    }

}

setTimeout(preguntaPrompt, 3000);
