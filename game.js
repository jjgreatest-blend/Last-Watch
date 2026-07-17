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

        function(match,name){

            return `<a href="#" onclick="inspectObject('${name}');return false;">${name}</a>`;

        }

    );

}

function inspectObject(name){

    const room = Game.rooms[Game.currentRoom];

    if(!room.objects[name]){

        return;

    }

    const object = room.objects[name];

    UI.roomDescription.innerHTML = `

<h3>${object.title}</h3>

<p>

${object.description}

</p>

<br>

<button onclick="returnToRoom()">

Назад

</button>

`;

    addJournal("Осмотрен объект: " + object.title);

}

function returnToRoom(){

    showRoom(Game.currentRoom);

}

loadRooms();
