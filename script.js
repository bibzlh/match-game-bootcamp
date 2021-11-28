// Please implement exercise logic here

const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
  const suitSymbol = ['♥', '◈', '♣', '♠'];
  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    const currentSuitSymbol = suitSymbol[suitIndex];
    // Code to create colour for the cards, based on the suits
    let cardColour = "";
    // Create a variable for the colour, based on the suits
    if (currentSuit === 'hearts' || currentSuit === 'diamonds'){
      cardColour = "red";
    } else if (currentSuit === 'clubs' || currentSuit === 'spades'){
      cardColour = "black";
    }
    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      let displayNameText = `${rankCounter}`;
      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        displayNameText = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        displayNameText = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        displayNameText = 'Q'
      } else if (cardName === '13') {
        cardName = 'king';
        displayNameText = 'K';
      }
      // Create a new card with the current name, suit, and rank
      const card = {
        suitSymbol: currentSuitSymbol,
        suit: currentSuit,
        name: cardName,
        displayName: displayNameText,
        colour: cardColour,
        rank: rankCounter,
      };
      // Add the new card to the deck
      newDeck.push(card);
      newDeck.push(card);
    }
  }
  // Return the completed card deck
  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);
// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;

// Create a helper function for output to abstract complexity
// of DOM manipulation away from game logic
const output = (message) => {
  gameInfo.innerText = message;
};

// GAMEPLAY LOGIC
const squareClick = (gameInfo, cardElement, column, row) => {

    console.log(cardElement);
    
    console.log('FIRST CARD DOM ELEMENT', firstCard);
    
    console.log('BOARD CLICKED CARD', board[column][row]);
    
    const clickedCard = board[column][row]; 

    // the user already clicked on this square
    if( cardElement.innerText !== '' ){
        return;
    }

    // first turn
    if (firstCard === null) {
      console.log('first turn');
      firstCard = clickedCard;
      // turn this card over
      cardElement.classList.add('card');
      cardElement.innerHTML = `${firstCard.suitSymbol}<BR>${firstCard.displayName}`;
  
      // hold onto this for later when it may not match
      firstCardElement = cardElement;
      gameInfo.innerHTML = `You opened ${firstCard.displayName} of ${firstCard.suitSymbol}. Click on another card and see if it matches!`;

    // second turn
    } else {
    
      console.log('second turn');
      // if second card matches the first
      if (
        clickedCard.name === firstCard.name &&
        clickedCard.suit === firstCard.suit
      ) {
        console.log('match');
    
        // turn this card over
        cardElement.innerHTML = `${clickedCard.suitSymbol}<BR>${clickedCard.displayName}`;
        gameInfo.innerHTML = `You opened ${clickedCard.displayName} of ${clickedCard.suitSymbol}. It's a match!`;
      } else {
        console.log('NOT a match');
        // turn second card over
        cardElement.innerHTML = `${clickedCard.suitSymbol}<BR>${clickedCard.displayName}`;
        gameInfo.innerHTML = `Yikes, not a match m8. Click on another card to try again!`;
    
        // turn both cards over after 3 seconds
        setTimeout(() => {
          cardElement.innerHTML = '';
          firstCardElement.innerText = '';}, 3000);

      }

      // reset the first card 
      
      firstCard = null;
};

}

// =================== GAME INIT LOGIC ============================
// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');
  const gameInfo = document.createElement('div')

  // give it a class for CSS purposes
  boardElement.classList.add('board');
  gameInfo.classList.add('gameInfo');
  gameInfo.innerText = 'Please click on the squares and match the cards.';
  document.body.appendChild(gameInfo);

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');



      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(gameInfo, event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const initGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  let doubleDeck = makeDeck();
  let deckSubset = doubleDeck.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]); // DONT UNDST THIS LINE...
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.appendChild(boardEl);
};

initGame();