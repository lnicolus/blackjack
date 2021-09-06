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
  const dealtCards = []; // aca guardamos las cartas que ya se repartieron. en tu caso vas a necesitar 2 arrays: uno para la maquina y otro para el jugador

  // para el ejercicio de Coder: un filter para buscar los 9s y otro para los Aces
  const nines = deck.filter(suit => suit.card === 9);
  console.log(nines);

  const searchAces = deck.filter(suit => suit.card > 10); 
  console.log(searchAces);
  
  console.log(deck.length); // me devuelve 52, ahora sé que tengo el numero exacto de cartas de una baraja real
  // ejercicio de ordenar un array de objetos: devuelve las cartas de menor a mayor
  console.log("Las cartas de menor a mayor valor en el Blackjack son: ", deck.sort((a,b) => a.card-b.card));


 // ejercicio de ordenar un array: para saber cual es la apuesta mas alta
 const bets = [78, 300, 15, 52, 39, 11];
 bets.sort(function(a, b){return a-b});
 console.log(bets[bets.length-1]);  // me devuelve la apuesta mas alta despues de ordenar

 // 1era entrega proyecto final

 let bet;
 let gameScore;
 let selectedCard;

 function startGame(bet) {

    bet = validate_bet(parseInt(prompt("Set your bet")));    
    
    let selectedCard = dealRandomCard(); //obtenemos la nueva carta
    dealtCards.push(selectedCard); //agregamos la carta al array de cartas repartidas
    console.log('deal new card, obtained:'+selectedCard.suit );
    console.log({ deck, dealtCards });
    
    
    selectedCard = dealRandomCard(); //obtenemos otra carta
    dealtCards.push(selectedCard); //agregamos la carta al array de cartas repartidas
    console.log('deal new card, obtained:'+selectedCard.suit );
    console.log({ deck, dealtCards });
    
    gameScore = (dealtCards[0].card + dealtCards[1].card);
    console.log(gameScore);    

    bet_output(bet);

 };


 function validate_bet(bet){

    if( (bet == "") || (isNaN(bet)) ) {

      alert("Place valid bet");
      startGame();      

    } else {

    return bet; 

      }
    };

function bet_output(bet) {

    if(!isNaN(bet) || bet){

        alert("You've been dealt "+ dealtCards[0].suit + " " + dealtCards[1].suit);

        alert("You have bet $" + bet + " and you scored " + gameScore + " points");

    }
  };

  function dealRandomCard(){
    const index = Math.floor(Math.random() * deck.length);
    const selectedCard = deck[index]; //guardamos la carta seleccionada en una constante que toma la posición randomizada en el índice del array donde están todas las cartas del mazo
    deck.splice(index, 1); // removemos la carta del deck
    return selectedCard;
  };