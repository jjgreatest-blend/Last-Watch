/* =====================================================
   LAST WATCH
   Build 0.2
   game.js
   Часть 1 — ядро движка
===================================================== */

const Game = {

    version: "0.2",

    activePlayer: 0,

    players: [],

    rooms: {},

    currentRoom: "reception",

    journal: [],

    saveKey: "lastwatch-save"

};



const UI = {

    roomTitle: document.getElementById("roomTitle"),

    roomDescription: document.getElementById("roomDescription"),

    inventory1: document.getElementById("inventory1"),

    inventory2: document.getElementById("inventory2"),

    journal: document.getElementById("journal"),

    endTurn: document.getElementById("endTurn")

};



class Player{

    constructor(id,name){

        this.id=id;

        this.name=name;

        this.hp=100;

        this.inventory=[];

    }

}



Game.players.push(

    new Player(1,"Константин")

);

Game.players.push(

    new Player(2,"Напарник")

);



function addJournal(text){

    Game.journal.unshift(text);

    UI.journal.innerHTML=Game.journal.join("<br><br>");

}



function switchPlayer(){

    Game.activePlayer++;

    if(Game.activePlayer>1)

        Game.activePlayer=0;

    addJournal(

        "Ход игрока: "

        +

        Game.players[Game.activePlayer].name

    );

}



UI.endTurn.onclick=function(){

    switchPlayer();

};



function renderInventories(){

    UI.inventory1.innerHTML="";

    UI.inventory2.innerHTML="";



    if(Game.players[0].inventory.length===0){

        UI.inventory1.innerHTML="<li>Пусто</li>";

    }

    else{

        Game.players[0].inventory.forEach(item=>{

            UI.inventory1.innerHTML+=`<li>${item}</li>`;

        });

    }



    if(Game.players[1].inventory.length===0){

        UI.inventory2.innerHTML="<li>Пусто</li>";

    }

    else{

        Game.players[1].inventory.forEach(item=>{

            UI.inventory2.innerHTML+=`<li>${item}</li>`;

        });

    }

}



function saveGame(){

    localStorage.setItem(

        Game.saveKey,

        JSON.stringify(Game)

    );

}



function loadGame(){

    const save=localStorage.getItem(Game.saveKey);

    if(!save)

        return;

    const data=JSON.parse(save);

    Game.activePlayer=data.activePlayer;

    Game.currentRoom=data.currentRoom;

    Game.journal=data.journal;

}



renderInventories();

addJournal("Добро пожаловать в Last Watch.");

addJournal("Build 0.2 запущен.");
/* =====================================================
   Build 0.2
   Часть 2
   Загрузка комнат
===================================================== */

async function loadRooms(){

    const response = await fetch("data/rooms.json");

    Game.rooms = await response.json();

    showRoom(Game.currentRoom);

}

function showRoom(roomId){

    Game.currentRoom = roomId;

    const room = Game.rooms[roomId];

    if(!room){

        UI.roomTitle.innerHTML="Ошибка";

        UI.roomDescription.innerHTML="Комната не найдена.";

        return;

    }

    UI.roomTitle.innerHTML = room.title;

    UI.roomDescription.innerHTML = parseRoomText(room.description);

    addJournal("Вы вошли: " + room.title);

}

function parseRoomText(text){

    return text.replace(

        /\[\[(.*?)\]\]/g,

        function(match,id){

            const object = Game.objects[id];

            const title = object ? object.title : id;

            return `<a class="game-link"
                      href="#"
                      onclick="inspectObject('${id}');return false;">
                      ${title}
                    </a>`;

        }

    );

}
function inspectObject(id){

    const object = Game.objects[id];

    if(!object){

        addJournal("Объект не найден.");

        return;

    }

    let html = "";

    html += `<h3>${object.title}</h3>`;

    html += `<p>${object.description}</p>`;

    html += "<br>";

    if(object.actions){

        object.actions.forEach(action=>{

            html += `
<button
class="objectButton"
onclick="objectAction('${id}','${action.id}')">
${action.text}
</button>
`;

        });

    }

    html += `
<br><br>

<button onclick="returnToRoom()">

Назад

</button>
`;

    UI.roomDescription.innerHTML = html;

    addJournal("Осмотрен объект: " + object.title);

}
function objectAction(id,action){

    const object = Game.objects[id];

    switch(action){

        case "inspect":

            addJournal("Вы внимательно осматриваете " + object.title + ".");

            break;

        case "takeJournal":

            addJournal("Получен предмет: Журнал посетителей.");

            Game.players[Game.activePlayer].inventory.push("Журнал посетителей");

            renderInventories();

            break;

        default:

            addJournal("Пока это действие ещё не реализовано.");

    }

}

function returnToRoom(){

    showRoom(Game.currentRoom);

}

async function startGame(){

    await loadObjects();

    await loadRooms();

    renderInventories();

}
startGame();

/* =====================================================
   Build 0.2
   Часть 3
   Загрузка объектов
===================================================== */

Game.objects = {};

async function loadObjects(){

    const response = await fetch("data/objects.json");

    Game.objects = await response.json();

}

async function startGame(){

    await loadObjects();

    await loadRooms();

    renderInventories();

}

function getObjectTitle(id){

    if(Game.objects[id]){

        return Game.objects[id].title;

    }

    return id;

}

function parseRoomText(text){

    return text.replace(

        /\[\[(.*?)\]\]/g,

        function(match,id){

            const title = getObjectTitle(id);

            return `<a href="#" onclick="inspectObject('${id}');return false;">${title}</a>`;

        }

    );

}

function inspectObject(id){

    const object = Game.objects[id];

    if(!object){

        return;

    }

    let html = "";

    html += `<h3>${object.title}</h3>`;

    html += `<p>${object.description}</p>`;

    html += "<br>";

    object.actions.forEach(action=>{

        html += `

<button

onclick="objectAction('${id}','${action.id}')">

${action.text}

</button>

`;

    });

    html += "<br><br>";

    html += `

<button onclick="returnToRoom()">

Назад

</button>

`;

    UI.roomDescription.innerHTML = html;

    addJournal("Осмотрен объект: " + object.title);

}

function objectAction(id,action){

    addJournal(

        "Действие: "

        +

        action

    );

}

startGame();
