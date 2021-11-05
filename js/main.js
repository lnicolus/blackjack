 let deck = [];
 // Se utiliza esta variable como reserva para depositar un mazo inalterado del cual renovar el mazo en cada mano
 let fullDeck = [];
 // Guardamos las cartas que ya se repartieron. Se utilizan 2 arrays: uno para la maquina y otro para el jugador
 let dealtCards = [];
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
 let fundsDisplayE = document.querySelector("#funds");
 let fundsDisplayB = document.querySelector("#bigFundsDisplay");
 let scoreDisplayE = document.querySelector("#score");
 let botScoreDisplayE = document.querySelector("#botScoreDisplay");
 let scoreDisplayB = document.querySelector("#bigScoreDisplay");
 let guidanceE = document.querySelector("#guidance");
 let nameB = document.querySelector("#botNameDisplay");
 let selectedName;

 // mantenemos updateados los fondos del jugador de forma local previniendo errores
 if (savedFunds && !isNaN(savedFunds)) {
   funds = savedFunds;
 };

 // Llamada a Json local donde consta el mazo completo
 const URLJSON = "js/deck.json"
 $(document).ready(function () {
   updateDisplay();
   $.getJSON(URLJSON, function (answer, status) {
     if (status === "success") {
       deck = answer;
       fullDeck = answer;   
     };
   });
 });

 /* EVENTOS DEL JUEGO : Habilitar o deshabilitar las opciones es esencial para hacer respetar las reglas del juego,
  al principio, solo se puede depositar fondos y empezar un juego.*/
 $("#hit").prop("disabled", true);
 $("#stand").prop("disabled", true);
 $("#quit").prop("disabled", true);
 $("#play").prop("disabled", false);

 const play = document.querySelector("#play"); // empezamos el juego de forma ordenada
 $("#play").bind('click', () => {   
   startGame();
   $.ajax("https://jsonplaceholder.typicode.com/users").done(function (users) {      
       users.forEach(function (user) {
         $("#list").append(`<li>${user.name}</li>`);
       });
       function randomOpponentName() {
        const index = Math.floor(Math.random() * users.length);
        selectedName = users[index]; 
        users.splice(index, 1); 
        nameD(selectedName.name);
        $("#list").hide();
        return selectedName;
      };
      randomOpponentName();      
     });
 });

 const hit = document.querySelector("#hit"); // hit permite pedir una carta al azar adicional
 $("#hit").bind('click', () => {
   selectedCard = dealRandomCard(); // la carta se reparte y sale del array del mazo para no repetirse, cada carta es unica y no queremos hacer trampa
   dealtCards.push(selectedCard);
   gameScore = gameScore + parseInt(selectedCard.card);
   scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
   tableCard();

   if (gameScore > 21) {
     // si el jugador pierde, ya no puede continuar tocando las teclas de juego, pero puede iniciar uno nuevo
     scoreDisplay("You've been dealt " + dealtCards[dealtCards.length - 1].suit + " you have thus " + gameScore + " points on the table and you busted! bet lost!");
     guidance("Click play to continue");
     outOfGame();
   }
 });

 /* Stand significa que no me pase de 21 y decido jugar mi suerte con el puntaje que ya tengo la jugada de la computadora esta encerrada en el evento de Stand,
  el unico en el que juega, ahi se define si el jugador puede ganar el doble de lo que aposto.
  Siempre que la computadora tenga menos puntos que el jugador, pedira una carta adicional. 
  Cumplido ello, se verifica quien gano.*/
 const stand = document.querySelector("#stand");
 $("#stand").bind('click', () => {
   guidance("You stand against the House!");
   outOfGame();
   $("#quit").prop("disabled", false);

   while (botGameScore < gameScore) {
     computerDeal();     
   }

   if (botGameScore >= gameScore) {
     closeGame();
   }

   /* Verificamos quien es victorioso y se realiza un update de los fondos de los que dispone el jugador en consecuencia.
   Prevemos no solamente quien tuvo mas puntos, sino ademas que hacer en caso de empate por identica puntuacion.*/
   function closeGame() {
      
    botScoreDisplay("Score: "+botGameScore);
    // Caso gana el Bot
     if ((botGameScore > 21) || (botGameScore < gameScore)) {
       scoreDisplay("The House has " + botGameScore + " points and You've " + gameScore + " points, you WON!");
       funds = funds + (bet * 2);
       localStorage.setItem('localPlayer', funds);
       updateFinalResultsDisplay();
       botGameScore = 0;
       gameScore = 0;       
       return funds;
       // Caso Jugador gana
     } else if ((botGameScore <= 21) && (botGameScore > gameScore)) {
       updateFinalResultsDisplay();
       scoreDisplay("The House has " + botGameScore + " points and You've " + gameScore + " points, you lost the bet");
       botGameScore = 0;
       gameScore = 0;       
       return funds;
       // Casos de empate
     } else if ((botGameScore == gameScore)) { 
       if (botDealtCards[botDealtCards.length - 1].card > dealtCards[dealtCards.length - 1].card) {
         updateFinalResultsDisplay();
         scoreDisplay("You tied with the House but the House has the higher last card, thus you lost the bet");
         botGameScore = 0;
         gameScore = 0;         
         return funds;
       } else {
         updateFinalResultsDisplay();
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
   let safety = confirm("Do you wish to quit? unresolved bets will be lost");
   if (safety) {
     outOfGame();
     $("#play").prop("disabled", false);
     finishGame();
     nameD("");     
   };
 });


 // FUNCIONES 

 // permiten cambiar rapidamente los mensajes que se updatean de forma asincrona para guiar al jugador
 function fundsDisplay(msg) {
   fundsDisplayE.innerHTML = msg;
 };

 function fundsDisplayBig(msg) {
  fundsDisplayB.innerHTML = msg;
};

 function scoreDisplay(msg) {
   scoreDisplayE.innerHTML = msg;
 };

 function scoreDisplayBig(msg) {
  scoreDisplayB.innerHTML = msg;
};

function botScoreDisplay(msg) {
  botScoreDisplayE.innerHTML = msg;
};

 function guidance(msg) {
   guidanceE.innerHTML = msg;
 };

 function nameD(msg) {
  nameB.innerHTML = msg;
};

 // muestra de forma dinamica y en tiempo real cuanto dinero virtual posee el jugador, es el primer paso, sin fondos no se puede jugar
 function placeFunds(inputFunds) {

   inputFunds = parseInt(inputFunds);
   fundsForm.style.display = 'block';

   if (isNaN(inputFunds) || inputFunds <= 0) {


     fundsDisplay("Place valid funds, \n You have $" + funds + " to play");

   } else {

     funds += inputFunds
     localStorage.setItem('localPlayer', funds);

     updateDisplay();
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

 /* Esta funcion permite elegir una carta al azar, y es reutilizable. 
 Primero: guardamos la carta seleccionada en una constante que toma la posición randomizada en el índice del array donde están todas las cartas del mazo.
 Segundo: removemos la carta del array deck (evitamos repeticiones de carta durante esta mano). */

 function dealRandomCard() {
   const index = Math.floor(Math.random() * deck.length);
   const selectedCard = deck[index]; 
   deck.splice(index, 1); 
   return selectedCard;
 }

 // funcion que agrega una carta visible en el HTML, reutilizada para las manos de BOT y PLAYER
 function displayCardInTable(target, imgSrc) {
   $(target).prepend(`<img src="${imgSrc}"/>`);
 }

 // funciones que agregan una carta visible en el HTML para computadora y jugador respectivamente
 function tableCard() {

   displayCardInTable('#playerHand', dealtCards[dealtCards.length - 1].img);
   $("#playerHand img:last-child").hide().slideDown("fast");
 }

 function botTableCard() {

   displayCardInTable('#botHand', botDealtCards[botDealtCards.length - 1].img);
   $("#botHand img:last-child").hide().slideDown("fast");
 }

 // De forma asincrona mostramos al jugador todo el proceso para apostar correctamente y poder comenzar el juego debidamente
 function placeBet(inputBet) {

   inputBet = parseInt(inputBet);
   betForm.style.display = 'block';

   if (isNaN(inputBet) || inputBet <= 0) {

     guidance("Place valid bet");
     scoreDisplay("")

   } else if (inputBet > funds) {
     guidance("Funds insufficient, place more funds and try again");
     scoreDisplay("")

   } else {

     bet += inputBet
     scoreDisplay("You have currently bet $" + bet);
     betForm.style.display = 'none';
     newBetTotal = funds - parseInt(bet);
     funds = newBetTotal
     localStorage.setItem('localPlayer', funds);
     updateDisplay();
     firstHand();
   };

   // pasados los chequeos se juega la primera mano, donde se reparten dos cartas para el jugador
   function firstHand() {
     $("#play").prop("disabled", true);
     let selectedCard = dealRandomCard();
     dealtCards.push(selectedCard);
     tableCard();

     selectedCard = dealRandomCard();
     dealtCards.push(selectedCard);
     tableCard();

     gameScore += dealtCards[0].card + dealtCards[1].card;
     guidance("Click Hit or Stand to continue");
     updateDisplay();     
     onGame();
     return bet;
   }
 };

 function updateBet() {
   const bet = $('#addBetInput').val();
   placeBet(bet);
 };

 function startGame() {
   if (playerHand.hasChildNodes() || botHand.hasChildNodes()) {
    clearTableAnimation();
     clearScores();
     finishGame();
   }
   placeBet();
 };

 // remueve todas las cartas si el jugador perdio o decidio rendirse (o si gana, en el futuro), resetea el mazo y las manos de jugadores al estado inicial

 function finishGame() {

   clearTableAnimation();
   deck = [...fullDeck];
   dealtCards = [];
   botDealtCards = [];
   outOfGame();
   clearScores();
   bet = 0;
   localStorage.setItem('localPlayer', funds);
   guidance("Click play to start");
   updateDisplay();
   scoreDisplay("");
   scoreDisplayBig("");
 };

 // animo la remocion de cartas tras terminado el juego, a su vez removiendo los elementos del DOM en concatenacion
 function clearTableAnimation() {

   $('#playerHand img').animate({
       left: '550px',
       opacity: '0.5'
     },
     "slow",
     function () {
       $('#playerHand').empty();
     });

   $('#botHand img').animate({
       left: '550px',
       opacity: '0.5'
     },
     "slow",
     function () {
       $('#botHand').empty();
     });
 }

 function computerDeal() {

   selectedCard = dealRandomCard(); // es un calco de la funcion que da cartas al jugador, pero el array es otro
   botDealtCards.push(selectedCard);
   botGameScore = botGameScore + parseInt(selectedCard.card);
   botTableCard();
 }

 function updateDisplay() {
   fundsDisplay("You have $" + funds + " to play");
   scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
   scoreDisplayBig("Score: " + gameScore);
   fundsDisplayBig("Funds: " + funds);
 };

 function updateFinalResultsDisplay() {  // variante instituida para los casos de resultado final de cada partida
  fundsDisplay("You have $" + funds + " to play");  
  fundsDisplayBig("Funds: " + funds);
  scoreDisplayBig("Score: " + gameScore);
 }

 function clearScores() {
   gameScore = 0;
   botGameScore = 0;
   botScoreDisplay("");
   scoreDisplayBig("");
 };

 function updateFunds() {
   const funds = $('#addFundsInput').val();
   placeFunds(funds);
 };

 // AJAX, traigo una lista de usuarios de un servidor gratuito para simular jugadores distinguidos

 $(document).ready(function () {
   $("#reload").hide();
   $("#load").click(function () {
     $("#list").show();
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