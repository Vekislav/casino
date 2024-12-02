// Load balance from local storage
let balance = parseInt(localStorage.getItem('slotBalance')) || 1000;
document.getElementById('balance').innerText = balance;

let currentBet = 0;
let currentHand = '';

function placeBet(hand) {
    currentHand = hand;
    currentBet = parseInt(document.getElementById('betAmount').value);
    if (isNaN(currentBet) || currentBet <= 0) {
        alert('Please enter a valid bet amount');
        return;
    }

    if (currentBet > balance) {
        alert('Insufficient balance!');
        return;
    }

    document.getElementById('result').innerText = `Bet placed on ${hand}`;
}

function dealCards() {
    if (currentBet === 0) {
        alert('Please place a bet first!');
        return;
    }

    document.getElementById('result').innerText = '';
    resetHands();

    const playerScore = getRandomScore();
    const bankerScore = getRandomScore();

    displayCards('player', playerScore);
    displayCards('banker', bankerScore);

    setTimeout(() => {
        determineWinner(playerScore, bankerScore);
    }, 2000);
}

function getRandomScore() {
    return Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
}

function displayCards(hand, score) {
    let handContainer = document.getElementById(`${hand}-cards`);
    let handScore = document.getElementById(`${hand}-score`);
    handContainer.innerHTML = ''; // Clear previous cards

    // Create card elements with animation
    let card1 = createCard();
    handContainer.appendChild(card1);

    let card2 = createCard();
    handContainer.appendChild(card2);

    handScore.innerText = `Score: ${score}`;
}

function createCard() {
    // Generate card value (number between 1 and 10)
    const cardValue = Math.floor(Math.random() * 10) + 1;

    let card = document.createElement('div');
    card.classList.add('card');
    card.innerText = cardValue; // Display the card value in the center
    card.style.animation = 'cardFlip 0.5s ease-out forwards';
    return card;
}

function determineWinner(playerScore, bankerScore) {
    let resultText = '';
    let outcome = '';

    if (playerScore > bankerScore) {
        outcome = 'player';
        resultText = 'Player wins!';
        if (currentHand === 'player') {
            balance += currentBet; // Player wins, money is added to their balance
        } else {
            balance -= currentBet; // Player loses, money is deducted from their balance
        }
    } else if (playerScore < bankerScore) {
        outcome = 'banker';
        resultText = 'Banker wins!';
        if (currentHand === 'banker') {
            balance += currentBet; // Player wins, money is added to their balance
        } else {
            balance -= currentBet; // Player loses, money is deducted from their balance
        }
    } else {
        outcome = 'tie';
        resultText = 'It\'s a tie!';
    }

    // Update balance and localStorage
    localStorage.setItem('slotBalance', balance);
    document.getElementById('balance').innerText = balance;
    document.getElementById('result').innerText = resultText;
}

// Reset hands and animation
function resetHands() {
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('banker-cards').innerHTML = '';
    document.getElementById('player-score').innerText = 'Score: 0';
    document.getElementById('banker-score').innerText = 'Score: 0';
}
