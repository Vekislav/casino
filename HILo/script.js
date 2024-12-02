document.addEventListener("DOMContentLoaded", () => {
    const balanceDisplay = document.getElementById("balance");
    const difficultySelector = document.getElementById("difficulty");
    const betInput = document.getElementById("bet");
    const startGameBtn = document.getElementById("start-game");
    const gameArea = document.getElementById("game-area");
    const currentCard = document.getElementById("current-card");
    const higherBtn = document.getElementById("higher-btn");
    const lowerBtn = document.getElementById("lower-btn");
    const multiplierDisplay = document.getElementById("multiplier");
    const cashoutBtn = document.getElementById("cashout");

    let currentMultiplier = 1.0;
    let currentCardValue = 0;
    let gameInProgress = false;
    let betAmount = 0;
    let rtp = 95; // Default RTP (will be updated from rtp.txt)

    const slotBalanceKey = "slotBalance";
    let balance = parseInt(localStorage.getItem(slotBalanceKey)) || 1000;

    // Fetch RTP from file
    async function fetchRTP() {
        try {
            const response = await fetch("rtp.txt");
            const rtpText = await response.text();
            rtp = parseFloat(rtpText.trim());
            if (isNaN(rtp) || rtp < 0 || rtp > 100) {
                rtp = 95; // Fallback to default if invalid
            }
            console.log(`RTP set to: ${rtp}%`);
        } catch (error) {
            console.error("Failed to load RTP:", error);
        }
    }

    function updateBalanceDisplay() {
        balanceDisplay.textContent = balance;
    }

    function getRandomCard() {
        return Math.floor(Math.random() * 13) + 1; // Values from 1 to 13
    }

    function shouldForceOutcome() {
        const randomValue = Math.random() * 100;
        return randomValue > rtp; // Force loss if the value exceeds RTP
    }

    function startGame() {
        betAmount = parseInt(betInput.value);
        if (isNaN(betAmount) || betAmount < 1 || betAmount > balance) {
            alert("Invalid bet amount!");
            return;
        }

        balance -= betAmount;
        updateBalanceDisplay();

        currentMultiplier = 1.0;
        multiplierDisplay.textContent = currentMultiplier.toFixed(2);

        currentCardValue = getRandomCard();
        currentCard.textContent = currentCardValue;

        gameArea.classList.remove("hidden");
        startGameBtn.disabled = true;
        gameInProgress = true;
    }

    function guessCard(isHigher) {
        const newCardValue = getRandomCard();
        const forceLoss = shouldForceOutcome();

        // Determine if the guess is correct
        const isCorrect =
            !forceLoss &&
            ((isHigher && newCardValue > currentCardValue) ||
                (!isHigher && newCardValue < currentCardValue));

        // Animate card flip
        currentCard.style.transform = "rotateY(90deg)";
        setTimeout(() => {
            currentCard.style.transform = "rotateY(0)";
            currentCard.textContent = newCardValue;

            if (isCorrect) {
                // Player guessed correctly
                currentMultiplier *= parseFloat(difficultySelector.value);
                multiplierDisplay.textContent = currentMultiplier.toFixed(2);
                currentCardValue = newCardValue;
                cashoutBtn.classList.remove("hidden");
            } else {
                // Player guessed incorrectly or forced loss
                alert(`You lost! The next card was ${newCardValue}.`);
                resetGame();
            }
        }, 500); // Delay for card flip animation
    }

    function cashOut() {
        const winnings = Math.floor(betAmount * currentMultiplier);
        balance += winnings;
        alert(`You won $${winnings}!`);
        resetGame();
    }

    function resetGame() {
        currentMultiplier = 1.0;
        betAmount = 0;
        startGameBtn.disabled = false;
        gameArea.classList.add("hidden");
        cashoutBtn.classList.add("hidden");
        gameInProgress = false;
        localStorage.setItem(slotBalanceKey, balance);
        updateBalanceDisplay();
    }

    // Initial balance display
    updateBalanceDisplay();

    // Load RTP
    fetchRTP();

    // Event listeners
    startGameBtn.addEventListener("click", startGame);
    higherBtn.addEventListener("click", () => guessCard(true));
    lowerBtn.addEventListener("click", () => guessCard(false));
    cashoutBtn.addEventListener("click", cashOut);
});
