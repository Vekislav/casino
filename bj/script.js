const playerCards = document.getElementById("player-cards");
const dealerCards = document.getElementById("dealer-cards");
const playerScoreEl = document.getElementById("player-score");
const dealerScoreEl = document.getElementById("dealer-score");
const resultEl = document.getElementById("result");
const hitButton = document.getElementById("hit-button");
const standButton = document.getElementById("stand-button");
const restartButton = document.getElementById("restart-button");
const balanceEl = document.getElementById("balance");
const betInput = document.getElementById("bet-amount");
const placeBetButton = document.getElementById("place-bet-button");

let deck = [];
let playerHand = [];
let dealerHand = [];
let isGameOver = false;
let balance = 0;
let bet = 0;

// Load balance from localStorage
function loadBalance() {
  const savedBalance = localStorage.getItem("slotBalance");
  balance = savedBalance ? parseInt(savedBalance, 10) : 100;
  updateBalance();
}

// Save balance to localStorage
function saveBalance() {
  localStorage.setItem("blackjackBalance", balance);
}

// Update balance display
function updateBalance() {
  balanceEl.textContent = `$${balance}`;
}

// Place a bet
placeBetButton.addEventListener("click", () => {
  const betAmount = parseInt(betInput.value, 10);

  if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
    alert("Enter a valid bet amount.");
    return;
  }

  bet = betAmount;
  balance -= bet;
  updateBalance();
  startGame();
});

// Deck creation, shuffling, and game logic
function createDeck() {
  const suits = ["♠", "♥", "♣", "♦"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  deck = [];
  suits.forEach(suit => values.forEach(value => deck.push({ suit, value })));
  deck = shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function dealCard(hand, container) {
  const card = deck.pop();
  hand.push(card);

  const cardEl = document.createElement("div");
  cardEl.className = "card";
  cardEl.textContent = `${card.value}${card.suit}`;
  container.appendChild(cardEl);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  hand.forEach(card => {
    if (["J", "Q", "K"].includes(card.value)) score += 10;
    else if (card.value === "A") {
      aces++;
      score += 11;
    } else score += parseInt(card.value);
  });

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function checkGameEnd() {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21) {
    resultEl.textContent = "You Bust! Dealer Wins!";
    isGameOver = true;
  } else if (dealerScore > 21 || playerScore > dealerScore) {
    resultEl.textContent = "You Win!";
    balance += bet * 2;
    saveBalance();
    isGameOver = true;
  } else if (dealerScore >= playerScore) {
    resultEl.textContent = "Dealer Wins!";
    isGameOver = true;
  }

  if (isGameOver) {
    hitButton.disabled = true;
    standButton.disabled = true;
    updateBalance();
  }
}

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

  hitButton.disabled = false;
  standButton.disabled = false;
  updateScores();
}

// Event Listeners
hitButton.addEventListener("click", () => {
  dealCard(playerHand, playerCards);
  if (calculateScore(playerHand) > 21) checkGameEnd();
});

standButton.addEventListener("click", () => {
  while (calculateScore(dealerHand) < 17) dealCard(dealerHand, dealerCards);
  checkGameEnd();
});

restartButton.addEventListener("click", () => {
  loadBalance();
  location.reload();
});

loadBalance();
