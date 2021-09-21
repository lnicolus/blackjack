 let deck = [
    { card: 11, suit: 'A♠'},
    { card: 2, suit: '2♠'},
    { card: 3, suit: '3♠'},
    { card: 4, suit: '4♠'},
    { card: 5, suit: '5♠'},
    { card: 6, suit: '6♠'},
    { card: 7, suit: '7♠'},
    { card: 8, suit: '8♠'},
    { card: 9, suit: '9♠'},
    { card: 10, suit: '10♠'},
    { card: 10, suit: 'J♠'},
    { card: 10, suit: 'Q♠'},
    { card: 10, suit: 'K♠'},
   
    { card: 11, suit: 'A♥'},
    { card: 2, suit: '2♥'},
    { card: 3, suit: '3♥'},
    { card: 4, suit: '4♥'},
    { card: 5, suit: '5♥'},
    { card: 6, suit: '6♥'},
    { card: 7, suit: '7♥'},
    { card: 8, suit: '8♥'},
    { card: 9, suit: '9♥'},
    { card: 10, suit: '10♥'},
    { card: 10, suit: 'J♥'},
    { card: 10, suit: 'Q♥'},
    { card: 10, suit: 'K♥'},
      
    { card: 11, suit: 'A♦'},
    { card: 2, suit: '2♦'},
    { card: 3, suit: '3♦'},
    { card: 4, suit: '4♦'},
    { card: 5, suit: '5♦'},
    { card: 6, suit: '6♦'},
    { card: 7, suit: '7♦'},
    { card: 8, suit: '8♦'},
    { card: 9, suit: '9♦'},
    { card: 10, suit: '10♦'},
    { card: 10, suit: 'J♦'},
    { card: 10, suit: 'Q♦'},
    { card: 10, suit: 'K♦'},

    { card: 11, suit: 'A♣'},
    { card: 2, suit: '2♣'},
    { card: 3, suit: '3♣'},
    { card: 4, suit: '4♣'},
    { card: 5, suit: '5♣'},
    { card: 6, suit: '6♣'},
    { card: 7, suit: '7♣'},
    { card: 8, suit: '8♣'},
    { card: 9, suit: '9♣'},
    { card: 10, suit: '10♣'},
    { card: 10, suit: 'J♣'},
    { card: 10, suit: 'Q♣'},
    { card: 10, suit: 'K♣'},
  ];
  
const fullDeck = [...deck]; // use spread operator para mantener un mazo inalterado al cual volver una vez finalizado el juego y luego copiar las cartas deck = [...fullDeck];
let dealtCards = []; // aca guardamos las cartas que ya se repartieron. Serán necesarios 2 arrays: uno para la maquina y otro para el jugador
 
let bet = 0;
let gameScore = 0;
let selectedCard;
let localPlayer = '{"player": "localPlayer", "money": 0}';
let funds = 0;
const savedFunds = parseInt(localStorage.getItem('localPlayer'));

if (savedFunds && !isNaN(savedFunds)){
  funds = savedFunds;
}

let safety = false;

function fundsDisplay(msg) { document.getElementById("funds").innerHTML = msg; };
function scoreDisplay(msg) { document.getElementById("score").innerHTML = msg; };
function guidance(msg) { document.getElementById("guidance").innerHTML = msg; };

localPlayerFunds = JSON.parse(localPlayer);             // el jugador no pierde sus fondos al refrescar la pagina despues de usar la funcion placeFunds                               

fundsDisplay("You have $" + funds + " to play");
scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");

// EVENTOS DEL JUEGO : Habilitar o deshabilitar las opciones es esencial para hacer respetar las reglas del juego, al principio, solo se puede depositar fondos y empezar un juego.
document.getElementById("hit").disabled = true;
document.getElementById("stand").disabled = true;
document.getElementById("quit").disabled = true;
document.getElementById("play").disabled = false;

let play = document.getElementById("play"); // empezamos el juego de forma ordenada
play.addEventListener('click', () => {
finishGame();
startGame();
});   


let hit = document.getElementById("hit");  // hit permite pedir una carta al azar adicional
hit.addEventListener('click', () => {  
  selectedCard = dealRandomCard();    // la carta se reparte y sale del array del mazo para no repetirse, cada carta es unica y no queremos hacer trampa
  dealtCards.push(selectedCard); 
  gameScore = gameScore + dealtCards[dealtCards.length - 1].card;  
  scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
  tableCard();
 

  if (gameScore > 21)  {    
    // si el jugador pierde, ya no puede continuar tocando las teclas de juego, pero puede iniciar uno nuevo
    scoreDisplay("You've been dealt "+ dealtCards[dealtCards.length - 1].suit + " you have thus " + gameScore + " points on the table and you busted! bet lost!");
    guidance("Click play to start");
    document.getElementById("hit").disabled = true;  
    document.getElementById("stand").disabled  = true;     
    document.getElementById("play").disabled  = false;
    document.getElementById("quit").disabled  = true;
  }
  });


let stand = document.getElementById("stand");  // stand significa que no me pase de 21 y decido jugar mi suerte con el puntaje que ya tengo
stand.addEventListener('click', () => {
guidance("You stand against the House!");
document.getElementById("hit").disabled  = true;  
document.getElementById("stand").disabled  = true;  
document.getElementById("play").disabled = true; // temporalmente deshabilito esto para evitar bugs, en el futuro incorporare la jugada del CPU posterior al standing
});   


let quit = document.getElementById("quit");  
quit.addEventListener('click', () => {
let safety = confirm("Do you wish to quit? you will lose your bets");
if (safety) {
document.getElementById("hit").disabled = true;  
document.getElementById("stand").disabled = true;
document.getElementById("play").disabled = false;
finishGame(); }
});  


// FUNCIONES 

function dealRandomCard() {                           // funcion para elegir una carta al azar, reutilizable
  const index = Math.floor(Math.random() * deck.length);
  const selectedCard = deck[index];                      //guardamos la carta seleccionada en una constante que toma la posición randomizada en el índice del array donde están todas las cartas del mazo
  deck.splice(index, 1);                                // removemos la carta del deck
  return selectedCard;
}

function tableCard() {                                  // funcion que agrega una carta visible en el HTML
  let card = document.createElement('div');
  card.classList.add('hand');
  let card1 = playerHand.appendChild(card);
  card1.textContent = dealtCards[dealtCards.length - 1].suit; 
}

 function placeFunds(){                                 // muestra de forma dinamica y en tiempo real cuanto dinero virtual posee el jugador
   
      inputFunds = parseInt(prompt("How much do you wish to add to your account?"));
      
      if( (inputFunds == "") || isNaN(inputFunds) || (inputFunds <= 0) ) {

      alert("Place valid funds");         

    } else {    
    funds += inputFunds   
    localStorage.setItem('localPlayer', funds);
    fundsDisplay(" ");
    fundsDisplay("You have $" + funds + " to play");  

      }
    };

 function startGame() {

    bet = parseInt(validate_bet(prompt("Set your bet")));    
     
    if (!isNaN(bet) && (funds >= 0)) {
    document.getElementById("play").disabled = true; 
    let selectedCard = dealRandomCard();                         //obtenemos la nueva carta
    dealtCards.push(selectedCard);                              //agregamos la carta al array de cartas repartidas
    tableCard();    
    
    selectedCard = dealRandomCard();                            // repetimos lo mismo porque son 2 cartas en la primera mano
    dealtCards.push(selectedCard); 
    tableCard();
    
    gameScore = parseInt(dealtCards[0].card + dealtCards[1].card);
    guidance("Click Hit or Stand to continue");
    scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");           
    betOutput()} else {
    document.getElementById("play").disabled = false;
    return bet;
    }    
  }


 function validate_bet(bet){                                   // chequeamos la validez de la apuesta para evitar resultados no deseados

    let newBetTotal = funds - bet;

    if( (bet == "") || (isNaN(bet)) ) {

      alert("Place valid bet");
      startGame();      

    } else if (newBetTotal < 0) {      
      alert("Funds insufficient");                  

    } else {
    funds = newBetTotal    
    localStorage.setItem('localPlayer', funds);    
    fundsDisplay("You have $" + funds + " to play");  
    return bet;  
      }
    };

function betOutput() {                                        // se habilitan los botones de la segunda fase del juego y se devuelve el monto de la apuesta para que este disponible
         document.getElementById("hit").disabled = false;  
         document.getElementById("stand").disabled = false; 
         document.getElementById("quit").disabled = false; 
         return bet;                       
  } 

function finishGame() {   // remueve todas las cartas si el jugador perdio o decidio rendirse (o si gana, en el futuro), resetea el mazo y las manos de jugadores al estado inicial
   
    while (playerHand.hasChildNodes()) {
    playerHand.removeChild(playerHand.firstChild);
    deck = [...fullDeck];   
    dealtCards.length = 0;
    document.getElementById("quit").disabled = true;
    gameScore = 0;  
    bet = 0;  
    localStorage.setItem('localPlayer', funds);
    guidance("Click play to start");
    scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
    }
  }


const fundsForm = document.getElementById('fundsForm');

function displayFundsForm(){
  fundsForm.style.display = 'block';
}

function hideFundsForm(){
  fundsForm.style.display = 'none';
}

function updateFunds(){
  const funds = document.getElementById('addFundsInput').value;
  document.getElementById('fundsInput').innerHTML = funds;
}