const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const playerScoreEl = document.getElementById("player-score");
const dealerScoreEl = document.getElementById("dealer-score");
const resultEl = document.getElementById("result");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const restartButton = document.getElementById("restart-button");

let deck = [];
let playerHand = [];
let dealerHand = [];
let isGameOver = false;

// Create a deck of cards
function createDeck() {
  const suits = ["♠", "♥", "♣", "♦"];
  const values = [
    "2", "3", "4", "5", "6", "7", "8", "9", "10",
    "J", "Q", "K", "A"
  ];
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  deck = shuffle(deck);
}

// Shuffle deck
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Deal a card
function dealCard(hand, container) {
  if (deck.length === 0) return;

  const card = deck.pop();
  hand.push(card);

  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.textContent = card.value + card.suit;
  container.appendChild(cardEl);
}

// Calculate hand score
function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.value)) {
      score += 10;
    } else if (card.value === "A") {
      aces++;
      score += 11;
    } else {
      score += parseInt(card.value);
    }
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

// Update scores
function updateScores() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  playerScoreEl.textContent = `Score: ${playerScore}`;
  dealerScoreEl.textContent = `Score: ${dealerScore}`;

  return { playerScore, dealerScore };
}

// End game logic
function checkGameEnd() {
  const { playerScore, dealerScore } = updateScores();

  if (playerScore > 21) {
    resultEl.textContent = "You Bust! Dealer Wins!";
    isGameOver = true;
  } else if (dealerScore > 21) {
    resultEl.textContent = "Dealer Busts! You Win!";
    isGameOver = true;
  } else if (dealerScore >= 17 && dealerScore >= playerScore) {
    resultEl.textContent = dealerScore === playerScore ? "It's a Tie!" : "Dealer Wins!";
    isGameOver = true;
  } else if (dealerScore >= 17 && dealerScore < playerScore) {
    resultEl.textContent = "You Win!";
    isGameOver = true;
  }

  if (isGameOver) {
    hitButton.disabled = true;
    standButton.disabled = true;
  }
}

// Start a new round
function startGame() {
  createDeck();

  playerHand = [];
  dealerHand = [];
  playerCards.innerHTML = "";
  dealerCards.innerHTML = "";
  resultEl.textContent = "";
  isGameOver = false;

  dealCard(playerHand, playerCards);
  dealCard(dealerHand, dealerCards);
  dealCard(playerHand, playerCards);

  updateScores();

  hitButton.disabled = false;
  standButton.disabled = false;
}

// Event listeners
hitButton.addEventListener("click", () => {
  if (isGameOver) return;

  dealCard(playerHand, playerCards);
  updateScores();
  checkGameEnd();
});

standButton.addEventListener("click", () => {
  if (isGameOver) return;

  while (calculateScore(dealerHand) < 17) {
    dealCard(dealerHand, dealerCards);
  }

  checkGameEnd();
});

restartButton.addEventListener("click", startGame);

// Start game on load
startGame();
