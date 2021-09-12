 const deck = [
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
  
  let fullDeck = [...deck]; // use spread operator para mantener un mazo inalterado al cual volver una vez finalizado el juego y luego copiar las cartas deck = [...fullDeck];
  const dealtCards = []; // aca guardamos las cartas que ya se repartieron. Serán necesarios 2 arrays: uno para la maquina y otro para el jugador

/* Entrega 9 incorporo un evento de click sobre el botón "hit" que permite seguir el juego, si el jugador se pasa de 21,
el juego termina. Los cambios hechos en el script son enormes. Incorpore eventos de escucha para todos los botones salvo para agregar fondos.
Agregue varias funciones e ifs, a fin de que se pueda pedir mas cartas (y perder si uno se pasa de 21) o bien "quedarse" (stand) o abandonar el juego con "quit"
todavia no esta la opcion de ganar disponible dado que es necesario generar un jugador automatico que responda por la Casa enfrentandose al jugador si este no pierde
por cuenta propia pasandose de 21*/     
 
let bet;
let gameScore = 0;
let selectedCard;
let funds = 0;
let safety = false;
document.getElementById("hit").disabled = true;  
document.getElementById("stand").disabled = true;

let play = document.getElementById("play"); 
play.addEventListener('click', () => {
startGame();
document.getElementById("play").disabled = true; 
});   

let hit = document.getElementById("hit");  // hit permite pedir una carta al azar adicional
hit.addEventListener('click', () => {  
  selectedCard = dealRandomCard();   
  dealtCards.push(selectedCard); 
  console.log('deal new card, obtained:'+selectedCard.suit );
  console.log({ deck, dealtCards });
  gameScore = gameScore + dealtCards[dealtCards.length - 1].card;
  tableCard();

  if (gameScore > 21)  {
    alert("You've been dealt "+ dealtCards[dealtCards.length - 1].suit +" Busted, game over! your score: " + gameScore);
    document.getElementById("hit").disabled = true;  
    document.getElementById("stand").disabled = true; 
    finishGame();
    document.getElementById("play").disabled = false;  }
  });

let stand = document.getElementById("stand");  // stand significa que no me pase de 21 y decido jugar mi suerte con el puntaje que ya tengo
stand.addEventListener('click', () => {
alert("You stand against the house!");
document.getElementById("hit").disabled = true;  
document.getElementById("stand").disabled = true;  
document.getElementById("play").disabled = true; // temporalmente deshabilito esto para evitar bugs, en el futuro incorporare la jugada del CPU posterior al standing
});   

let quit = document.getElementById("quit");  
quit.addEventListener('click', () => {
let safety = confirm("Do you wish to quit? you will lose your bets");
if ( safety == true ) {
document.getElementById("hit").disabled = true;  
document.getElementById("stand").disabled = true;
finishGame();
document.getElementById("play").disabled = false;}
});  

function dealRandomCard() { // funcion para elegir una carta al azar, reutilizable
  const index = Math.floor(Math.random() * deck.length);
  const selectedCard = deck[index]; //guardamos la carta seleccionada en una constante que toma la posición randomizada en el índice del array donde están todas las cartas del mazo
  deck.splice(index, 1); // removemos la carta del deck
  return selectedCard;
}

function tableCard() { // funcion que agrega una carta en el HTML
  let card = document.createElement('div');
  card.classList.add('hand');
  let card1 = playerHand.appendChild(card);
  card1.textContent = dealtCards[dealtCards.length - 1].suit; 
}

 function placeFunds(){

      inputFunds = parseInt(prompt("How much do you wish to add to your account?"));
      
      if( (inputFunds == "") || isNaN(inputFunds) || (inputFunds <= 0) ) {

      alert("Place valid funds");
      placeFunds();      

    } else {
    funds += inputFunds
    document.getElementById("funds").innerHTML = " ";
    document.getElementById("funds").innerHTML = "You have $" + funds + " to play";
    return funds; 

      }
    };

 function startGame(bet) {

    bet = (validate_bet(parseInt(prompt("Set your bet"))));
        
    let selectedCard = dealRandomCard(); //obtenemos la nueva carta
    dealtCards.push(selectedCard); //agregamos la carta al array de cartas repartidas
    console.log('deal new card, obtained:'+selectedCard.suit ); // vemos que cartas se eligieron del array
    console.log({ deck, dealtCards }); // chequeamos que las cartas hayan salido efectivamente del array (no queremos que salga dos veces la misma!)
    tableCard();    
    
    selectedCard = dealRandomCard(); 
    dealtCards.push(selectedCard); 
    console.log('deal new card, obtained:'+selectedCard.suit );
    console.log({ deck, dealtCards });
    tableCard();
    
    gameScore = parseInt(dealtCards[0].card + dealtCards[1].card);

    betOutput(bet);
  }


 function validate_bet(bet){

    let newBetTotal = funds - bet;

    if( (bet == "") || (isNaN(bet)) ) {

      alert("Place valid bet");
      startGame();      

    } else if (newBetTotal <= 0) {      
      alert("Funds insufficient");
      placeFunds();             

    } else {
    funds = newBetTotal
    document.getElementById("funds").innerHTML = " ";
    document.getElementById("funds").innerHTML = "You have $" + funds + " to play";
    return bet; 

      }
    };

function betOutput(bet) {

    if(!isNaN(bet) || bet){

        alert("You've been dealt "+ dealtCards[0].suit + " " + dealtCards[1].suit +
         "You have bet $" + bet + " and you scored " + gameScore + " points. Click Hit or Stand to continue");
         document.getElementById("hit").disabled = false;  
         document.getElementById("stand").disabled = false;  
         }
  } 

function finishGame() {   // remueve todas las cartas si el jugador perdio o decidio rendirse (o si gana, en el futuro)
   
    while (playerHand.hasChildNodes())
    playerHand.removeChild(playerHand.firstChild);
}