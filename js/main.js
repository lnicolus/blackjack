 let deck =[];
 const fullDeck = [...deck]; // use spread operator para mantener un mazo inalterado al cual volver una vez finalizado el juego y luego copiar las cartas deck = [...fullDeck];
 let dealtCards = []; // aca guardamos las cartas que ya se repartieron. Serán necesarios 2 arrays: uno para la maquina y otro para el jugador
 let botDealtCards = [];
 let bet = 0;
 let gameScore = 0;
 let botGameScore = 0;
 let selectedCard;
 let localPlayer = '{"player": "localPlayer", "money": 0}';
 let funds = 0;
 const savedFunds = parseInt(localStorage.getItem('localPlayer'));
 let newBetTotal = 0;
 const safety = false;
 const fundsForm = document.querySelector('#fundsForm');

 if (savedFunds && !isNaN(savedFunds)) {
   funds = savedFunds;
 };

 let fundsDisplayE = document.querySelector("#funds");
 let scoreDisplayE = document.querySelector("#score");
 let guidanceE = document.querySelector("#guidance");

 function fundsDisplay(msg) {
   fundsDisplayE.innerHTML = msg;
 };

 function scoreDisplay(msg) {
   scoreDisplayE.innerHTML = msg;
 };

 function guidance(msg) {
   guidanceE.innerHTML = msg;
 };                     

 fundsDisplay("You have $" + funds + " to play"); 

 // EVENTOS DEL JUEGO : Habilitar o deshabilitar las opciones es esencial para hacer respetar las reglas del juego, al principio, solo se puede depositar fondos y empezar un juego.
 $("#hit").prop("disabled", true);
 $("#stand").prop("disabled", true);
 $("#quit").prop("disabled", true);
 $("#play").prop("disabled", false);

 const play = document.querySelector("#play"); // empezamos el juego de forma ordenada
 $("#play").bind('click', () => {
   startGame();
 });


 const hit = document.querySelector("#hit"); // hit permite pedir una carta al azar adicional
 $("#hit").bind('click', () => {
   selectedCard = dealRandomCard(); // la carta se reparte y sale del array del mazo para no repetirse, cada carta es unica y no queremos hacer trampa
   dealtCards.push(selectedCard);
   gameScore = gameScore + selectedCard.card;   
   scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
   tableCard();

   if (gameScore > 21) {
     // si el jugador pierde, ya no puede continuar tocando las teclas de juego, pero puede iniciar uno nuevo
     scoreDisplay("You've been dealt " + dealtCards[dealtCards.length - 1].suit + " you have thus " + gameScore + " points on the table and you busted! bet lost!");
     guidance("Click play to continue");
     outOfGame();
   }
 });


 const stand = document.querySelector("#stand"); // stand significa que no me pase de 21 y decido jugar mi suerte con el puntaje que ya tengo
 $("#stand").bind('click', () => {
   guidance("You stand against the House!");
   outOfGame();
   $("#quit").prop("disabled", false);
   // la jugada de la computadora esta encerrada en el evento de Stand, el unico en el que juega, ahi se define si el jugador puede ganar el doble de lo que aposto

   while (botGameScore < 17) { // siempre que la computadora tenga menos de 17 puntos totales, pedira una carta adicional
     computerDeal();
   }

   if (botGameScore >= 17) { // cuando tenga 17 puntos o mas, se verifica quien gano
     closeGame();
   }

   function closeGame() { 

     if ((botGameScore > 21) || (botGameScore < gameScore)) {

       scoreDisplay("The House has " + botGameScore + " points and You've " + gameScore + " points, you WON!");
       funds = funds + (bet * 2);
       localStorage.setItem('localPlayer', funds);       
       fundsDisplay("You have $" + funds + " to play");
       botGameScore = 0;
       gameScore = 0;
       return funds;
     } else if ((botGameScore < 21) && (botGameScore > gameScore)) {       
       fundsDisplay("You have $" + funds + " to play");
       scoreDisplay("The House has " + botGameScore + " points and You've " + gameScore + " points, you lost the bet");
       botGameScore = 0;
       gameScore = 0;
       return funds;
     } else if ((botGameScore == gameScore)) {            // que sucede si ambos empatan
      if (botDealtCards[botDealtCards.length - 1].card > dealtCards[dealtCards.length - 1].card){
        fundsDisplay("You have $" + funds + " to play");
        scoreDisplay("You tied with the House but the House has the higher last card, thus you lost the bet");
        botGameScore = 0;
        gameScore = 0;
        return funds;
      } else {
        fundsDisplay("You have $" + funds + " to play");
        scoreDisplay("You tied with the House but you have the higher last card, thus you won the bet!");
        funds = funds + (bet * 2);
        botGameScore = 0;
        gameScore = 0;
        return funds;
      }
     };

   }
 });

 const quit = document.querySelector("#quit");
 $("#quit").bind('click', () => {
   let safety = confirm("Do you wish to quit? you will lose your bets");
   if (safety) {
     outOfGame();
     $("#play").prop("disabled", false);
     finishGame();
   }
 });

 // FUNCIONES 

 function placeFunds(inputFunds) { // muestra de forma dinamica y en tiempo real cuanto dinero virtual posee el jugador, es el primer paso, sin fondos no se puede jugar
   
   inputFunds = parseInt(inputFunds);
   fundsForm.style.display = 'block';

   if (isNaN(inputFunds) || inputFunds <= 0) {

     
     fundsDisplay("Place valid funds, \n You have $" + funds + " to play");

   } else {

     funds += inputFunds
     localStorage.setItem('localPlayer', funds);
    
     fundsDisplay("You have $" + funds + " to play");
     fundsForm.style.display = 'none';

   }
 };

 function outOfGame() { // agrupamos la desactivacion de botones cuando el juego no esta iniciado o termino
   $("#hit").prop("disabled", true);
   $("#stand").prop("disabled", true);
   $("#quit").prop("disabled", true);
   $("#play").prop("disabled", false);
 }

 function onGame() { // se habilitan los botones de la segunda fase del juego posterior a las apuestas
   $("#hit").prop("disabled", false);
   $("#stand").prop("disabled", false);
   $("#quit").prop("disabled", false);
   $("#play").prop("disabled", true);
 }

 function dealRandomCard() { // funcion para elegir una carta al azar, reutilizable
   const index = Math.floor(Math.random() * deck.length);
   const selectedCard = deck[index]; //guardamos la carta seleccionada en una constante que toma la posición randomizada en el índice del array donde están todas las cartas del mazo
   deck.splice(index, 1); // removemos la carta del deck
   return selectedCard;
 }

 function displayCardInTable(target, imgSrc){ // funcion que agrega una carta visible en el HTML, reutilizada abajo para las manos de BOT y PLAYER
  $(target).prepend(`<img src="${imgSrc}"/>`);
}

 function tableCard() { // funcion que agrega una carta visible en el HTML
 
   displayCardInTable('#playerHand', dealtCards[dealtCards.length - 1].img);
   $("#playerHand img:last-child").hide().slideDown("fast");
 }

 function botTableCard() { 

   displayCardInTable('#botHand', botDealtCards[botDealtCards.length - 1].img);
   $("#botHand img:last-child").hide().slideDown("fast");
 }
 
 function startGame() {

   bet = parseInt(validate_bet(prompt("Set your bet")));

   if (playerHand.hasChildNodes() || botHand.hasChildNodes()) {       
     $('#playerHand').empty();
     $('#botHand').empty();
     clearScores();
     updateDisplay();
     dealtCards = [];
     botDealtCards = [];
   }

   if (!isNaN(bet) && funds >= 0 && bet >= 0) {     
     $("#play").prop("disabled", true);
     let selectedCard = dealRandomCard(); //obtenemos la nueva carta
     dealtCards.push(selectedCard); //agregamos la carta al array de cartas repartidas
     tableCard();

     selectedCard = dealRandomCard(); // repetimos lo mismo porque son 2 cartas en la primera mano
     dealtCards.push(selectedCard);
     tableCard();

     gameScore += dealtCards[0].card + dealtCards[1].card;         
     guidance("Click Hit or Stand to continue");
     scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
     onGame();
     return bet;
   } else {
     $("#play").prop("disabled", false);
     return bet;
   }
 }

 function validate_bet(bet) { // chequeamos la validez de la apuesta para evitar resultados no deseados    

   if (isNaN(bet) || !bet) {

     guidance("Place valid bet");
     scoreDisplay("")

   } else if (bet > funds) {
     guidance("Funds insufficient, place more funds and try again");
     scoreDisplay("")

   } else {
     newBetTotal = funds - parseInt(bet);
     funds = newBetTotal
     localStorage.setItem('localPlayer', funds);
     fundsDisplay("You have $" + funds + " to play");
     return bet;
   }
 };

 function finishGame() { // remueve todas las cartas si el jugador perdio o decidio rendirse (o si gana, en el futuro), resetea el mazo y las manos de jugadores al estado inicial

   clearTableAnimation();
   deck = [...fullDeck];
   dealtCards = [];
   botDealtCards = [];
   outOfGame();
   clearScores();
   bet = 0;
   localStorage.setItem('localPlayer', funds);
   guidance("Click play to start");
   fundsDisplay("You have $" + funds + " to play");
   scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");  
 }

 function clearTableAnimation() { // animo la remocion de cartas tras terminado el juego, a su vez removiendo los elementos del DOM en concatenacion

   $('#playerHand img').animate({
       left: '550px',
       opacity: '0.5'
     },
     "slow",
     function () {
       $('#playerHand img').remove();
       $('#playerHand').empty();
     });

   $('#botHand img').animate({
       left: '550px',
       opacity: '0.5'
     },
     "slow",
     function () {
       $('#botHand img').remove(); 
       $('#botHand').empty();
     });     
 }

 function computerDeal() {

   selectedCard = dealRandomCard(); // es un calco de la funcion que da cartas al jugador, pero el array es otro
   botDealtCards.push(selectedCard);
   botGameScore = botGameScore + selectedCard.card; 
   botTableCard();
 }

 function updateDisplay() {
 fundsDisplay("You have $" + funds + " to play");
 scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
 }

 function clearScores() {
  gameScore = 0;
  botGameScore = 0;  
 }

function updateFunds(){  
  const funds = $('#addFundsInput').val();  
  placeFunds(funds);  
};

//Declaramos la url del archivo JSON local
const URLJSON = "js/deck.json"
//Escuchamos el evento click del botón agregado
$(document).ready(function () {
  $.getJSON(URLJSON, function (respuesta, estado) {
    if(estado === "success"){
      deck = respuesta;
      return deck;}
});
});

// solo para el ejercicio de Coder AJAX, traigo una lista de usuarios de un servidor gratuito

$(document).ready(function () {
  $("#reload").hide();
  $("#load").click(function () {
    $("#list").empty();
    $("#loader").show();
    $("#load").prop("disabled", true);
    $.ajax("https://jsonplaceholder.typicode.com/users").done(function (users) {
      $("#loader").hide();
      $("#reload").show();
      users.forEach(function (user) {
        $("#list").append(`<li>${user.name}</li>`);
      });
    });
    
  });
  $("#reload").click(function () {
    $("#list").empty();
    $("#reload").hide();
    $("#loader").hide();
    $("#load").prop("disabled", false);
  });
});