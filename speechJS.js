const view = document.querySelector("#text-area p");

const startPause = document.querySelector("#startstop");
const startPauseSpan = document.querySelector("#startstop span");

const startPauseCMD = document.querySelector("#startstop-cmd");
const startPauseCMDSpan = document.querySelector("#startstop-cmd span");

const clear = document.querySelector("#clear");
const clearCMD = document.querySelector("#clear-cmd");
const copy = document.querySelector("#copy");

const language = document.querySelector("#language");
const languageChange = document.querySelector("#language-change");

const loading = document.querySelector("#loading");

const speechToTextArea = document.querySelector("#speech-to-text");
const commandArea = document.querySelector("#command-area");

const speechToText = document.querySelector("#speech-to");
const command = document.querySelector("#command");

const addCommand = document.querySelector("#add-cmd");
const editCommand = document.querySelector("#edit-cmd");

const addCommandInput = document.querySelector(".add-command");
const addActionInput = document.querySelector(".add-action");

const addCmdSave = document.querySelector("#add-save");
const addCommandInputID = document.querySelector("#add-command");
const addActionInputID = document.querySelector("#add-action");

let giveCommand;


let runOrNot = false; // false = stopped
let savedText = "";

let SpeechRecognition;
let recognition;

let commandText = "";

let editCommndActive = false;
let addCommndActive = false;

let commandMap = new Map();

try {
    SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
} catch (err) {
    loading.style.transform = "scale(1)";
    throw new Error("Browser unsupported for Speech Recognition");
}
recognition.lang = 'en-US';

recognition.onresult = function (event) {
    const text = Array.from(event.results)
        .map(results => results[0])
        .map(results => results.transcript)
        .join(' ');


    if (commandArea.style.display === "flex") {
        giveCommand[giveCommand.length - 1].innerHTML = "<i>" + text + "</i>";
        commandText = text;
    } else {
        view.innerHTML = savedText + " " + text;
    }
}

recognition.onend = function () {
    if (runOrNot) {
        savedText = view.textContent;
        recognition.start();
    }

    if (commandArea.style.display === "flex" && runOrNot) {
        commandReaction();
        createCommandRecieve();

    }
}

recognition.onerror = function (event) {
    console.log(event);
    recognition.stop();
    runOrNot = false;
    startPauseSpan.textContent = "play_arrow";
    startPauseCMDSpan.textContent = "play_arrow";
    buttonEnable();
    language.disabled = false;
    language.className = "";
    animation("Listning stop...");

    if (commandArea.style.display === "flex") {
        giveCommand[giveCommand.length - 1].innerHTML = "<i> Waiting for start... </i>";
    }
}


startPause.onclick = function () {

    if (!runOrNot) {
        recognition.start();
        runOrNot = true;
        startPauseSpan.textContent = "close";
        buttonDisable();
        language.disabled = true;
        language.className = "disabled";
        animation("Listning started...");

    } else {
        recognition.stop();
        runOrNot = false;
        startPauseSpan.textContent = "play_arrow";
        buttonEnable();
        language.disabled = false;
        language.className = "";
        animation("Listning stopped...");
    }

}

clear.onclick = function () {
    savedText = "";
    view.innerHTML = "<i>Say Something...</i>";
    buttonDisable();
    animation("Text removed...");
}

copy.onclick = function () {
    let input = document.createElement("textarea");
    input.value = view.textContent;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
    input.remove();
    console.log(input.value);
    animation("Text copied...");
}

language.onclick = function () {
    switch (recognition.lang) {
        case 'en-US':
            recognition.lang = 'si-LK';
            languageChange.textContent = 'සිංහල';
            break;
        case 'si-LK':
            recognition.lang = 'ta-LK';
            languageChange.textContent = 'தமிழ்';
            break;
        default:
            recognition.lang = 'en-US';
            languageChange.textContent = 'English';
    }

}

command.onclick = function () {
    commandArea.style.display = "flex";
    speechToTextArea.style.display = "none";
    command.className = "selected-one";
    speechToText.className = "";
    commandText = "";
    if (runOrNot) {
        startPause.click();
    }

}

speechToText.onclick = function () {
    commandArea.style.display = "none";
    speechToTextArea.style.display = "block";
    command.className = "";
    speechToText.className = "selected-one";
    commandText = "";
    if (runOrNot) {
        startPauseCMD.click();
    }
}


startPauseCMD.onclick = function () {
    addCommandInput.style.display = "none";
    addCmdSave.style.display = "none";
    addActionInput.style.display = "none";
    addCommndActive = false;
    editCommndActive = false;
    removeEditItems();
    clearCMD.disabled = false;
    clearCMD.className = "";

    if (!runOrNot) {
        createCommandMap();
        recognition.start();
        runOrNot = true;
        startPauseCMDSpan.textContent = "close";
        editCommand.className  ="";
        addCommand.className = "";
        animation("Listning started...");
        createCommandRecieve();

    } else {
        recognition.stop();
        runOrNot = false;
        startPauseCMDSpan.textContent = "play_arrow";
        animation("Listning stopped...");
        giveCommand[giveCommand.length - 1].innerHTML = "<i> Waiting for start... </i>";
    }
}

addCommand.onclick = function(){
    editCommand.className  ="";
    if(runOrNot){
        startPauseCMD.onclick();
    }
    removeCmdResult();
    removeEditItems();

    if(!addCommndActive){
        addCommand.className = "button-active";
        addCommndActive = true;
        editCommndActive = false;
        clearCMD.disabled = true;
        clearCMD.className = "disabled"
        addCommandInput.style.display = "block";
        addCmdSave.style.display = "block";
        addActionInput.style.display = "block";
    }else{
        addCommand.className = "";
        addCommndActive = false;
        clearCMD.disabled = false;
        clearCMD.className = "";
        addCommandInput.style.display = "none";
        addCmdSave.style.display = "none";
        addActionInput.style.display = "none";
    }

}

editCommand.onclick = function(){

    addCommand.className = "";
    addCommandInput.style.display = "none";
    addCmdSave.style.display = "none";
    addActionInput.style.display = "none";
    if(runOrNot){
        startPauseCMD.onclick();
    }
    removeCmdResult();
    
    if(!editCommndActive){
        editCommand.className = "button-active";
        editCommndActive = true;
        addCommndActive = false;
        clearCMD.disabled = true;
        clearCMD.className = "disabled"
        editItems();
        
    }else{
        editCommand.className = "";
        editCommndActive = false;
        clearCMD.disabled = false;
        clearCMD.className = "";
        removeEditItems();
    }

}

clearCMD.onclick = function(){
    removeCmdResult();
    createCommandRecieve();
}

addCmdSave.onclick = function(){

    if(addCommandInputID.value.length !== 0  &&  addActionInputID.value.length !== 0){
        localStorage.setItem(addCommandInputID.value , addActionInputID.value);
        animation("Command saved");
        addCommandInputID.value = "";
        addActionInputID.value = "";
    }else{
        animation("Can't add empty values");
    }
    
}

function buttonDisable() {
    clear.disabled = true;
    clear.className = "disabled";
    copy.disabled = true;
    copy.className = "disabled";
}

function buttonEnable() {
    clear.disabled = false;
    clear.className = "";
    copy.disabled = false;
    copy.className = "";
}

function animation(value) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    div.id = "notification";
    p.id = "details";
    p.textContent = value;
    document.body.appendChild(div);
    div.appendChild(p);
}

function commandReaction() {

    if (commandText.length === 0) {
        return;
    }

    let div = document.createElement("div");
    let p = document.createElement("p");
    div.classList = "give-result command-chat";
    commandArea.appendChild(div);

    if(commandText.toUpperCase().includes("SEARCH")){
        p.innerHTML = "<i>Success!</i>";
        let tempVal = commandText.substring(7);
        tempVal = tempVal.replace(" ", "+");
        window.open("https://google.com/search?q="+tempVal);
    }else if (commandMap.has(commandText.toUpperCase())) {
        p.innerHTML = "<i>Success!</i>";
        window.open(commandMap.get(commandText.toUpperCase()));
    } else {
        p.innerHTML = "<i>Command not found!</i>";
    }
    commandText = "";
    div.appendChild(p);
}

function createCommandRecieve() {

    if (document.querySelectorAll('.teke-command').length ===
        document.querySelectorAll('.give-result').length) {

        let div = document.createElement("div");
        let p = document.createElement("p");
        div.classList = "teke-command command-chat";
        commandArea.appendChild(div);
        div.appendChild(p);
    }

    giveCommand = document.querySelectorAll('.teke-command p');
    giveCommand[giveCommand.length - 1].innerHTML = "<i> Listning... </i>";
}

function removeCmdResult(){
    for(let itm of document.querySelectorAll('.teke-command')){
        itm.remove();
    }

    for(let itm of document.querySelectorAll('.give-result')){
        itm.remove();
    }
}

function editItems(){

    let count = 0;
    let tempKyes = [];

    for(let val of Object.entries(localStorage)){

        let command = document.createElement("div");
        let action = document.createElement("div");
        let save = document.createElement("button");
        let deletebtn = document.createElement("button");
        let btnDiv = document.createElement("div");
    
        let commandInpt = document.createElement("input");
        let actionInpt = document.createElement("input");
    
        let span = document.createElement('span');
        let span2 = document.createElement('span');
    
        command.classList = "add-command command-chat display-block";
        action.classList = "add-action command-chat display-block"
        save.classList = "check-btn display-block";
        deletebtn.classList = "check-btn display-block delete-btn"
        btnDiv.classList = "btn-div";

        commandInpt.id = count + "c";
        actionInpt.id = count + "a";
        save.id = count + "s";
        deletebtn.id = count + "d";
    
        span.className = "material-symbols-outlined";
        span.textContent = "check";

        span2.className = "material-symbols-outlined";
        span2.textContent = "close";

        commandInpt.value = val[0];
        actionInpt.value = val[1];
        tempKyes.push(val[0]);

        commandArea.appendChild(command);
        commandArea.appendChild(action);
        commandArea.appendChild(btnDiv);
        btnDiv.appendChild(deletebtn);
        btnDiv.appendChild(save);
        command.appendChild(commandInpt);
        action.appendChild(actionInpt);
        save.appendChild(span);
        deletebtn.appendChild(span2);

        save.onclick = function(){
            let ids = save.id.substring(0 , save.id.length - 1);
            let comId =  ids + "c";
            let actId =  ids + "a";
            localStorage.removeItem(tempKyes[ids]);
            localStorage.setItem(document.getElementById(comId).value ,
            document.getElementById(actId).value);
            animation("Command updated");
        }

        deletebtn.onclick = function(){
            let ids = save.id.substring(0 , save.id.length - 1);
            localStorage.removeItem(tempKyes[ids]);
            animation("Command deleted");
            document.getElementById(ids+"c").parentElement.remove();
            document.getElementById(ids+"a").parentElement.remove();
            document.getElementById(ids+"s").remove();
            document.getElementById(ids+"d").remove();
        }
        count++;
    }
}

function createCommandMap(){
    commandMap.clear();

    for(let val of Object.entries(localStorage)){
        commandMap.set(val[0].toUpperCase() , val[1]);
    }
}

function removeEditItems(){
    for(let i of document.querySelectorAll(".display-block")){
        i.remove();
    }
}
