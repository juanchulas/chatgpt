import bot from './assets/bot.svg';
import user from './assets/user.svg';
import dataJson from './prompt.json' assert {type: 'json'};

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if(urlParams.get("processid")){
    var processid = urlParams.get("processid"); //domain
}else{
    var processid = urlParams.get("ProcessId"); //domain
}

if(urlParams.get("lang")){
    var lang = urlParams.get("lang").toLowerCase(); //question
}else if(urlParams.get("Lang")){
    var lang = urlParams.get("Lang").toLowerCase(); //question
}


console.log(dataJson);

var prompt = dataJson;


// diable submit

   function doThing(){
    var inputs = document.querySelector("#wildcard").getElementsByTagName("input");
    var flag = 0;
    for (const input of inputs){
        if(input.value == ''){
            flag = 1;
        }
     }
     if(flag == 0){
        console.log(flag);
        document.getElementById("submit").disabled = false;
     }else{
        document.getElementById("submit").disabled = true;
     }
 }

//buscar y reemplazar en cadena

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

// buscar en un json
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

// construir el prompt
function setPrompt(stringoption, option){
    if(option == 2 && document.querySelector(".wrapper") != null){
       document.querySelectorAll('.wrapper').forEach(e => e.remove())
    }
    const uniqueId = generateUniqueId()
    const messageDiv = document.getElementById(uniqueId)
    const splitInit  = stringoption.split('[%');
    const wildcard = splitInit.map(word => word.split('%]').shift());
    wildcard.shift();
    const noDuplicateWildcard = [...new Set(wildcard)]
   var child = document.querySelector("#wildcard").lastElementChild; 
   while (child) {
    document.querySelector("#wildcard").removeChild(child);
       child = document.querySelector("#wildcard").lastElementChild;
   }
    const inputGenerate = noDuplicateWildcard.map((element, index) => { 
        console.log("[%"+element+"%]")
        const newDiv = document.createElement("div");
        newDiv.setAttribute("id","input-" + index)
        const label = document.createElement("label");
        label.innerHTML = element.toLowerCase(); 
        const input = document.createElement("INPUT");
        input.setAttribute("type", "text");
        //input.setAttribute("onkeyup", "disableSubmit()");
        input.setAttribute("id", element.toLowerCase());
        input.setAttribute("name", element.toLowerCase());
        document.querySelector("#wildcard").appendChild(newDiv);
        document.querySelector("#input-" + index).appendChild(label);
        document.querySelector("#input-" + index).appendChild(input);
        document.getElementsByName(element.toLowerCase())[0].addEventListener('change', doThing);

    })
    var stringoptionFormat = stringoption;
   // console.log(stringoptionFormat)
    for (const pair of noDuplicateWildcard) {
        console.log(pair)
        stringoptionFormat = stringoptionFormat.replaceAll("[%"+pair+"%]", "<span>[%"+pair+"%]</span>");
      }
    console.log(stringoptionFormat)
    chatContainer.innerHTML += chatStripe(false, "<p>"+stringoptionFormat+"</p>", "uniqueId")
   // chatContainer.innerHTML += chatStripe(false, "<p>"+stringoption+"</p>", "uniqueId")


}

//carga de la ventana
 window.onload = (event) => {
    let ele = document.getElementById('process-id');
    for (let i = 0; i < prompt.process.length; i++) {
        // POPULATE SELECT ELEMENT WITH JSON.
        ele.innerHTML = ele.innerHTML +
            '<option value="' + prompt.process[i].processid + '">' + prompt.process[i].processid     + '</option>';
    }
    let ele2 = document.getElementById('language');
    for (let i = 0; i < prompt.languages.length; i++) {
        // POPULATE SELECT ELEMENT WITH JSON.
        ele2.innerHTML = ele2.innerHTML +
            '<option value="' + [i] + '">' + prompt.languages[i].name + '</option>';
    }

    // refactorizar
    if (processid !== null &&  lang !== null){
        var searchjson = getObjects(prompt,'processid',processid);
        var setCopy = getObjects(prompt.languages,'name', lang.toLocaleUpperCase());
        document.getElementById('help').innerHTML = setCopy[0].copy;
        switch (lang) {
            case 'es':
                var stringoption = searchjson[0].languaje[0].prompt;
                var idoption = 0;
                break;
            case 'en':
                var stringoption = searchjson[0].languaje[1].prompt;
                var idoption = 1;
                break;
            case 'pt':
                var stringoption = searchjson[0].languaje[2].prompt;
                var idoption = 2;
                break;
            default:
                var stringoption = searchjson[0].languaje[0].prompt;
                var idoption = 0;
                break;
        }
        document.getElementById('process-id').value = processid;
        document.getElementById('language').value = idoption;
        setPrompt(stringoption, 1);
     }else{
        var searchjson = getObjects(prompt,'processid',document.getElementById('process-id').value);
        switch (document.getElementById('language').value) {
            case 'es':
                var stringoption = searchjson[0].languaje[0].prompt;
                var idoption = 0;
                break;
            case 'en':
                var stringoption = searchjson[0].languaje[1].prompt;
                var idoption = 1;
                break;
            case 'pt':
                var stringoption = searchjson[0].languaje[2].prompt;
                var idoption = 2;
                break;
            default:
                var stringoption = searchjson[0].languaje[0].prompt;
                var idoption = 0;
                break;
        }
        setPrompt(stringoption, 1);
     }
 }


 document.getElementById('process-id').addEventListener('change', function() {
    doThing();
    var language = document.getElementById('language');
   // console.log(this.options[this.selectedIndex].text, this.options[this.selectedIndex].value);
    //console.log(language.options[language.selectedIndex].text)
    //console.log(document.getElementById('language').options[document.getElementById('language').selectedIndex].text)
   
    var searchjson = getObjects(prompt,'processid',this.options[this.selectedIndex].value);

    switch (document.getElementById('language').options[document.getElementById('language').selectedIndex].text) {
        case 'ES':
            var stringoption = searchjson[0].languaje[0].prompt;
            var idoption = 0;
            break;
        case 'EN':
            var stringoption = searchjson[0].languaje[1].prompt;
            var idoption = 1;
            break;
        case 'PT':
            var stringoption = searchjson[0].languaje[2].prompt;
            var idoption = 2;
            break;
        default:
            var stringoption = searchjson[0].languaje[0].prompt;
            var idoption = 0;
            break;
    }

    setPrompt(stringoption, 2);

  });

  //refactorizar
  document.getElementById('language').addEventListener('change', function() {
    //console.log(this.options[this.selectedIndex].text);

    var searchjson = getObjects(prompt,'processid',document.getElementById('process-id').value);
    var setCopy = getObjects(prompt.languages,'name', this.options[this.selectedIndex].text);
    document.getElementById('help').innerHTML = setCopy[0].copy;
    switch (this.options[this.selectedIndex].text) {
        case 'ES':
            var stringoption = searchjson[0].languaje[0].prompt;
            var idoption = 0;
            break;
        case 'EN':
            var stringoption = searchjson[0].languaje[1].prompt;
            var idoption = 1;
            break;
        case 'PT':
            var stringoption = searchjson[0].languaje[2].prompt;
            var idoption = 2;
            break;
        default:
            var stringoption = searchjson[0].languaje[0].prompt;
            var idoption = 0;
            break;
    }

    setPrompt(stringoption, 2);

  });

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
    }, 10)
}

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

const handleSubmit = async (e) => {

    e.preventDefault();
    const data = new FormData(form);

    var searchjson = getObjects(prompt,'processid',data.get("process-id"));
    switch (data.get("language")) {
        case "0":
            var stringoption = searchjson[0].languaje[0].prompt;
            var idoption = 0;
            break;
        case "1":
            var stringoption = searchjson[0].languaje[1].prompt;
            var idoption = 1;
            break;
        case "2":
            var stringoption = searchjson[0].languaje[2].prompt;
            var idoption = 2;
            break;
        default:
            var stringoption = searchjson[0].languaje[0].prompt;
            var idoption = 0;
            break;
    }
        
        for (const pair of data.entries()) {
            pair[0] = "[%"+pair[0].toLocaleUpperCase()+"%]";
            console.log(pair[0])
            stringoption = stringoption.replaceAll(pair[0], pair[1]);
          }
    respuestaPromt(stringoption);
}


form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})



async function respuestaPromt (stringoption){

   const text = stringoption;
    console.log(stringoption)
   // const text = "hola como estás";
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId)
    loader(messageDiv);


    const response = await fetch('https://dentsu-ai.onrender.com', {
    //const response = await fetch('http://localhost:3000', {
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