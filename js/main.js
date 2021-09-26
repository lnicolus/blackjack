 let deck = [
    { card: 11, suit: 'A♠', img: "./assets/11pa.jpg"},
    { card: 2, suit: '2♠', img: "./assets/2p.jpg"},
    { card: 3, suit: '3♠', img: "./assets/3p.jpg"},
    { card: 4, suit: '4♠', img: "./assets/4p.jpg"},
    { card: 5, suit: '5♠', img: "./assets/5p.jpg"},
    { card: 6, suit: '6♠', img: "./assets/6p.jpg"},
    { card: 7, suit: '7♠', img: "./assets/7p.jpg"},
    { card: 8, suit: '8♠', img: "./assets/8p.jpg"},
    { card: 9, suit: '9♠', img: "./assets/9p.jpg"},
    { card: 10, suit: '10♠', img: "./assets/10p.jpg"},
    { card: 10, suit: 'J♠', img: "./assets/10pj.jpg"},
    { card: 10, suit: 'Q♠', img: "./assets/10pq.jpg"},
    { card: 10, suit: 'K♠', img: "./assets/10pk.jpg"},
   
    { card: 11, suit: 'A♥', img: "./assets/11ca.jpg"},
    { card: 2, suit: '2♥', img: "./assets/2c.jpg"},
    { card: 3, suit: '3♥', img: "./assets/3c.jpg"},
    { card: 4, suit: '4♥', img: "./assets/4c.jpg"},
    { card: 5, suit: '5♥', img: "./assets/5c.jpg"},
    { card: 6, suit: '6♥', img: "./assets/6c.jpg"},
    { card: 7, suit: '7♥', img: "./assets/7c.jpg"},
    { card: 8, suit: '8♥', img: "./assets/8c.jpg"},
    { card: 9, suit: '9♥', img: "./assets/9c.jpg"},
    { card: 10, suit: '10♥', img: "./assets/10c.jpg"},
    { card: 10, suit: 'J♥', img: "./assets/10cj.jpg"},
    { card: 10, suit: 'Q♥', img: "./assets/10cq.jpg"},
    { card: 10, suit: 'K♥', img: "./assets/10ck.jpg"},
      
    { card: 11, suit: 'A♦', img: "./assets/11da.jpg"},
    { card: 2, suit: '2♦', img: "./assets/2d.jpg"},
    { card: 3, suit: '3♦', img: "./assets/3d.jpg"},
    { card: 4, suit: '4♦', img: "./assets/4d.jpg"},
    { card: 5, suit: '5♦', img: "./assets/5d.jpg"},
    { card: 6, suit: '6♦', img: "./assets/6d.jpg"},
    { card: 7, suit: '7♦', img: "./assets/7d.jpg"},
    { card: 8, suit: '8♦', img: "./assets/8d.jpg"},
    { card: 9, suit: '9♦', img: "./assets/9d.jpg"},
    { card: 10, suit: '10♦', img: "./assets/10d.jpg"},
    { card: 10, suit: 'J♦', img: "./assets/10dj.jpg"},
    { card: 10, suit: 'Q♦', img: "./assets/10dq.jpg"},
    { card: 10, suit: 'K♦', img: "./assets/10dk.jpg"},

    { card: 11, suit: 'A♣', img: "./assets/11ta.jpg"},
    { card: 2, suit: '2♣', img: "./assets/2t.jpg"},
    { card: 3, suit: '3♣', img: "./assets/3t.jpg"},
    { card: 4, suit: '4♣', img: "./assets/4t.jpg"},
    { card: 5, suit: '5♣', img: "./assets/5t.jpg"},
    { card: 6, suit: '6♣', img: "./assets/6t.jpg"},
    { card: 7, suit: '7♣', img: "./assets/7t.jpg"},
    { card: 8, suit: '8♣', img: "./assets/8t.jpg"},
    { card: 9, suit: '9♣', img: "./assets/9t.jpg"},
    { card: 10, suit: '10♣', img: "./assets/10t.jpg"},
    { card: 10, suit: 'J♣', img: "./assets/10tj.jpg"},
    { card: 10, suit: 'Q♣', img: "./assets/10tq.jpg"},
    { card: 10, suit: 'K♣', img: "./assets/10tk.jpg"},
  ];
  
const fullDeck = [...deck]; // use spread operator para mantener un mazo inalterado al cual volver una vez finalizado el juego y luego copiar las cartas deck = [...fullDeck];
let dealtCards = []; // aca guardamos las cartas que ya se repartieron. Serán necesarios 2 arrays: uno para la maquina y otro para el jugador
let cpuDealtCards = [];
let bet = 0;
let gameScore = 0;
let cpuGameScore = 0;
let selectedCard;
let localPlayer = '{"player": "localPlayer", "money": 0}';
let funds = 0;
const savedFunds = parseInt(localStorage.getItem('localPlayer'));
let newBetTotal = 0;
let safety = false;

if (savedFunds && !isNaN(savedFunds) && (savedFunds > 0)){
  funds = savedFunds;
};

let fundsDisplayE = document.querySelector("#funds");
let scoreDisplayE = document.querySelector("#score");
let guidanceE = document.querySelector("#guidance");

function fundsDisplay(msg) { fundsDisplayE.innerHTML = msg; };
function scoreDisplay(msg) { scoreDisplayE.innerHTML = msg; };
function guidance(msg) { guidanceE.innerHTML = msg; };

localPlayerFunds = JSON.parse(localPlayer);             // el jugador no pierde sus fondos al refrescar la pagina despues de usar la funcion placeFunds                               


    fundsDisplay("You have $" + funds + " to play");
    scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");

    // EVENTOS DEL JUEGO : Habilitar o deshabilitar las opciones es esencial para hacer respetar las reglas del juego, al principio, solo se puede depositar fondos y empezar un juego.
    $("#hit").prop("disabled", true);
    $("#stand").prop("disabled", true);
    $("#quit").prop("disabled", true);
    $("#play").prop("disabled", false);

    let play = document.querySelector("#play"); // empezamos el juego de forma ordenada
    play.addEventListener('click', () => {      
    startGame();
    });   


    let hit = document.querySelector("#hit");  // hit permite pedir una carta al azar adicional
    hit.addEventListener('click', () => {  
      selectedCard = dealRandomCard();    // la carta se reparte y sale del array del mazo para no repetirse, cada carta es unica y no queremos hacer trampa
      dealtCards.push(selectedCard); 
      gameScore = gameScore + dealtCards[dealtCards.length - 1].card;  
      scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
      tableCard();
    
      if (gameScore > 21)  {    
        // si el jugador pierde, ya no puede continuar tocando las teclas de juego, pero puede iniciar uno nuevo
        scoreDisplay("You've been dealt "+ dealtCards[dealtCards.length - 1].suit + " you have thus " + gameScore + " points on the table and you busted! bet lost!");
        guidance("Click play to continue");
        outOfGame()
      }
      });


    let stand = document.querySelector("#stand");  // stand significa que no me pase de 21 y decido jugar mi suerte con el puntaje que ya tengo
    stand.addEventListener('click', () => {
    guidance("You stand against the House!");
    outOfGame()
    $("#quit").prop("disabled", false);        
     // la jugada de la computadora esta encerrada en el evento de Stand, el unico en el que juega, ahi se define si el jugador puede ganar el doble de lo que aposto

    while (cpuGameScore < 17){      // siempre que la computadora tenga menos de 17 puntos totales, pedira una carta adicional
      computerDeal();
    }

    if (cpuGameScore >= 17) {       // cuando tenga 17 puntos o mas, se verifica quien gano
      closeGame();
    }

    function closeGame(){

    if ((cpuGameScore > 21) || (cpuGameScore < gameScore)) {

      scoreDisplay("The House has "+ cpuGameScore + " points and You've "+ gameScore + " points, you WON!");
      funds = funds + (bet*2);
      localStorage.setItem('localPlayer', funds);
      fundsDisplay(" ");
      fundsDisplay("You have $" + funds + " to play"); 
      cpuGameScore = 0; 
      return funds;
    } else if ((cpuGameScore < 21) && (cpuGameScore > gameScore)) {
      fundsDisplay(" ");
      fundsDisplay("You have $" + funds + " to play"); 
      scoreDisplay("The House has "+ cpuGameScore + " points and You've "+ gameScore + " points, you lost the bet");
      cpuGameScore = 0; 
      return funds;
    };

  }
    });   

    let quit = document.querySelector("#quit");  
    quit.addEventListener('click', () => {
    let safety = confirm("Do you wish to quit? you will lose your bets");
    if (safety) {
      outOfGame();
      $("#play").prop("disabled", false); 
    finishGame(); }
    });  

    // FUNCIONES 

    function placeFunds(){                                 // muestra de forma dinamica y en tiempo real cuanto dinero virtual posee el jugador, es el primer paso, sin fondos no se puede jugar
      
      inputFunds = parseInt(prompt("How much do you wish to add to your account?"));
      
      if( (inputFunds == "") || isNaN(inputFunds) || (inputFunds <= 0) ) {

        fundsDisplay(" ");
        fundsDisplay("Place valid funds and try again");         

    } else {    
    funds += inputFunds   
    localStorage.setItem('localPlayer', funds);
    fundsDisplay(" ");
    fundsDisplay("You have $" + funds + " to play");  

      }
    };

    function outOfGame() {                                // agrupamos la desactivacion de botones cuando el juego no esta iniciado o termino
      $("#hit").prop("disabled", true);
      $("#stand").prop("disabled", true);
      $("#quit").prop("disabled", true);
      $("#play").prop("disabled", false);
    }

    function onGame() {                                        // se habilitan los botones de la segunda fase del juego posterior a las apuestas
      $("#hit").prop("disabled", false);           
      $("#stand").prop("disabled", false); 
      $("#quit").prop ("disabled", false);
      $("#play").prop("disabled", true);                               
    } 

    function dealRandomCard() {                           // funcion para elegir una carta al azar, reutilizable
      const index = Math.floor(Math.random() * deck.length);
      const selectedCard = deck[index];                      //guardamos la carta seleccionada en una constante que toma la posición randomizada en el índice del array donde están todas las cartas del mazo
      deck.splice(index, 1);                                // removemos la carta del deck
      return selectedCard;
    }


    function tableCard() {                                  // funcion que agrega una carta visible en el HTML
        
        $('#playerHand').prepend(`<img class="position" src="${dealtCards[dealtCards.length - 1].img}">`);
        $("#playerHand img:last-child").hide().slideDown("fast");     
    }

    function cpuTableCard() {                                  // funcion que agrega una carta visible en el HTML
        
      $('#cpuHand').prepend(`<img class="position" src="${cpuDealtCards[cpuDealtCards.length - 1].img}">`);
      $("#cpuHand img:last-child").hide().slideDown("fast");     
  }

    function startGame() {

        bet = parseInt(validate_bet(prompt("Set your bet")));
        
        if ((playerHand.hasChildNodes()) || (cpuHand.hasChildNodes())) {
          $('#playerHand').empty();
          $('#cpuHand').empty();
        }

        if (!isNaN(bet) && (funds >= 0) && (bet >= 0)) {
        $("#play").prop("disabled", true); 
        let selectedCard = dealRandomCard();                         //obtenemos la nueva carta
        dealtCards.push(selectedCard);                              //agregamos la carta al array de cartas repartidas
        tableCard();    
        
        selectedCard = dealRandomCard();                            // repetimos lo mismo porque son 2 cartas en la primera mano
        dealtCards.push(selectedCard); 
        tableCard();
        
        gameScore = parseInt(dealtCards[0].card + dealtCards[1].card);
        guidance("Click Hit or Stand to continue");
        scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");           
        onGame()
        return bet;} else {
        $("#play").prop("disabled", false); 
        return bet;       
        }    
      }

    function validate_bet(bet){                                   // chequeamos la validez de la apuesta para evitar resultados no deseados    
        
          if( (bet == "") || (isNaN(bet)) || (!bet) || (bet <= 0)) {

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

    function finishGame() {   // remueve todas las cartas si el jugador perdio o decidio rendirse (o si gana, en el futuro), resetea el mazo y las manos de jugadores al estado inicial

        clearTableAnimation();
        deck = [...fullDeck];   
        dealtCards.length = [];
        cpuDealtCards.length = [];
        outOfGame(); 
        gameScore = 0; 
        cpuGameScore = 0; 
        bet = 0;  
        localStorage.setItem('localPlayer', funds);
        guidance("Click play to start");
        fundsDisplay("You have $" + funds + " to play"); 
        scoreDisplay("You have currently bet $" + bet + " and have " + gameScore + " points on the table");
        }

    function clearTableAnimation(){     // animo la remocion de cartas tras terminado el juego, a su vez removiendo los elementos del DOM en concatenacion

      $('#playerHand img').animate({  
        left:'550px',
        opacity:'0.5'    
        }, 
        "slow",           
        function(){        
            $('#playerHand img').remove();
        });

        $('#cpuHand img').animate({  
          left:'550px',
          opacity:'0.5'    
          }, 
          "slow",           
          function(){        
              $('#cpuHand img').remove();
          });
    }

    function computerDeal(){
      
      selectedCard = dealRandomCard();                  // es un calco de la funcion que da cartas al jugador, pero el array es otro
      cpuDealtCards.push(selectedCard);
      cpuGameScore = cpuGameScore + cpuDealtCards[cpuDealtCards.length - 1].card;
      cpuTableCard();
    }