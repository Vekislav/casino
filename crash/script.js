document.addEventListener("DOMContentLoaded", () => {
    const balanceDisplay = document.getElementById("balance");
    const betInput = document.getElementById("bet-input");
    const placeBetButton = document.getElementById("place-bet");
    const cashoutButton = document.getElementById("cashout");
    const statusMessage = document.getElementById("status-message");
    const multiplierDisplay = document.getElementById("multiplier");
    const rocket = document.querySelector("#rocket");
    const moneyWonDisplay = document.getElementById("money-won");
    const countdownDisplay = document.getElementById("countdown");
    const particlesContainer = document.getElementById("particles-container");

    let balance = parseInt(localStorage.getItem("vekiB")) || 1000;
    let betAmount = 0;
    let currentMultiplier = 0;
    let gameInterval = null;
    let crashMultiplier = 0;
    let isBetPlaced = false;
    let countdownTime = 7; // Time for countdown before the next round
    let speed = 0.01;
    let acceleration = 0.005;
    const gameCooldown = 7000; // Time between games
    let startGameTimeout;

    function updateBalanceDisplay() {
        balanceDisplay.textContent = balance;
    }

    // Create particles (visual effect around the rocket)
    function createParticles() {
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particlesContainer.appendChild(particle);
            
            // Random position and animation delay relative to the rocket's position
            const xPos = rocket.getBoundingClientRect().left + rocket.offsetWidth / 2;
            const yPos = rocket.getBoundingClientRect().top + rocket.offsetHeight / 2;

            particle.style.left = `${xPos + Math.random() * 50 - 25}px`;
            particle.style.top = `${yPos + Math.random() * 50 - 25}px`;
            particle.style.animationDuration = `${Math.random() * 2 + 3}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particle.style.opacity = Math.random() * 0.5 + 0.5; // Make particles brighter
        }
    }

    // Start the countdown before the game starts
    function startCountdown() {
        countdownTime = 7; // Reset countdown to 7
        countdownDisplay.textContent = countdownTime;
        countdownDisplay.style.visibility = "visible";

        const countdownInterval = setInterval(() => {
            countdownTime--;
            countdownDisplay.textContent = countdownTime;

            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                countdownDisplay.style.visibility = "hidden";
                startGame();
            }
        }, 1000);
    }

    // Start the game logic after a 5-second delay
    function startGame() {
        setTimeout(() => {
            // Start game logic after 5 seconds
            statusMessage.textContent = "Game starting...";
            currentMultiplier = 0;
            speed = 0.01; // Slow initial multiplier speed
            acceleration = 0.005;
            isBetPlaced = false;
            moneyWonDisplay.style.visibility = "hidden"; // Hide the money won
            rocket.style.transform = "rotate(0deg)";
            rocket.style.bottom = "0px";
            rocket.style.visibility = "visible";
            createParticles(); // Add space particles

            crashMultiplier = Math.random() * (15 - 1) + 1; // Set a random crash multiplier between 1x and 15x

            // Start rocket animation after the delay
            rocket.style.animation = 'wiggle 0.2s alternate infinite';

            // Rocket flight logic
            gameInterval = setInterval(() => {
                rocket.style.transform = `rotate(${Math.random() * 10 - 5}deg)`; // Small random rotation (wiggle effect)
                rocket.style.bottom = `${currentMultiplier * 10}px`;

                if (currentMultiplier >= crashMultiplier) {
                    clearInterval(gameInterval);
                    handleCrash();
                }

                if (currentMultiplier > 10) {
                    speed += acceleration; // Accelerate faster over time
                }

                currentMultiplier += speed;
                multiplierDisplay.textContent = `${currentMultiplier.toFixed(2)}x`;
            }, 50);
        }, 5000); // Delay game start by 5 seconds

        // Disable the bet button during the game
        placeBetButton.disabled = true;
    }

    // Handle the crash event
    function handleCrash() {
        rocket.style.visibility = "hidden";
        statusMessage.textContent = `Game crashed at ${currentMultiplier.toFixed(2)}x!`;

        // If the player cashed out before the crash, show the won money
        if (cashoutButton.classList.contains("hidden") === false) {
            moneyWonDisplay.style.visibility = "visible";
            const cashoutAmount = Math.round(betAmount * currentMultiplier);
            moneyWonDisplay.textContent = `+${cashoutAmount}`;
        }
        
        resetGame();
    }

    // Handle cashout
    function cashOut() {
        const cashoutMultiplier = currentMultiplier.toFixed(2);
        const cashoutAmount = Math.round(betAmount * currentMultiplier); // Round to nearest dollar
        balance += cashoutAmount;
        updateBalanceDisplay();
        statusMessage.textContent = `You cashed out at ${cashoutMultiplier}x for $${cashoutAmount}!`;
        resetGame();
    }

    // Reset game settings for the next round
    function resetGame() {
        isBetPlaced = false;
        betInput.disabled = false;
        placeBetButton.disabled = false; // Re-enable the bet button for the next round
        cashoutButton.classList.add("hidden");
        localStorage.setItem("slotBalance", balance);
        updateBalanceDisplay();
        setTimeout(startCountdown, gameCooldown); // Start countdown for the next game
    }

    // Bet button click handler
    placeBetButton.addEventListener("click", () => {
        betAmount = parseInt(betInput.value);
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
            alert("Invalid bet amount!");
            return;
        }

        balance -= betAmount;
        updateBalanceDisplay();
        isBetPlaced = true;
        betInput.disabled = true;
        placeBetButton.disabled = true; // Disable the bet button
        cashoutButton.classList.remove("hidden");
        statusMessage.textContent = "Bet placed! Waiting for the game to start...";
    });

    // Cashout button click handler
    cashoutButton.addEventListener("click", cashOut);

    // Initialize the game
    updateBalanceDisplay();
    startCountdown();
});
