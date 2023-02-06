import bot from './assets/bot.svg'
import user from './assets/user.svg'
import data from './prompt.json' assert {type: 'json'};

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const domain = urlParams.get("domain");
const question = urlParams.get("question");




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




function preguntaPrompt(){

    const text = data.question[question].prompt + data.domain[domain].url;

    document.getElementById("form").style.display = "none";


    console.log("se ejecuta a los 2 segundos");
    const uniqueId = generateUniqueId()
   // chatContainer.innerHTML += chatStripe(false, " ", uniqueId)
    const messageDiv = document.getElementById(uniqueId)
    chatContainer.innerHTML += chatStripe(false, text)
    //typeText(messageDiv, text);
    setTimeout(respuestaPromt, 1000);

}

async function respuestaPromt (){

    const text = data.question[question].prompt + data.domain[domain].url;

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
if (domain !== null &&  question !== null){
    setTimeout(preguntaPrompt, 3000);
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://dentsu-ai.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
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

        messageDiv.innerHTML = "Something went wrong"
        console.log(err)
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})


//chatContainer.innerHTML += chatStripe(false, ' 1. Banca \n 2. Finanzas\n 3. Servicios bancarios\n 4. Tarjetas de crédito\n 5. Préstamos\n 6. Inversiones\n 7. Seguros\n 8. Servicios de ahorro y planificación financiera\n 9. Servicios de banca en línea\n10. Servicios de tarjetas de débito')