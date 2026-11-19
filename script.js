
// 1. Select HTML elements
const gameScreen = document.getElementById("gameScreen");
const gameMessage = document.getElementById("gameMessage");
const gameInstruction = document.getElementById("gameInstruction");
const startButton = document.getElementById("startButton");

const lastTimeDisplay = document.getElementById("lastTime");
const bestTimeDisplay = document.getElementById("bestTime");
const attemptsDisplay = document.getElementById("attempts");
const averageTimeDisplay = document.getElementById("averageTime");
const historyList = document.getElementById("historyList");

// 2. Store game data
const reactionTimes = [];

const player = {
  bestTime: null,
  attempts: 0
};

// 3. Game variables
let startTime;
let waitingTimer;
let gameState = "ready";

// 4. Start the game
function startGame() {

  clearTimeout(waitingTimer);

  // Reset after five completed attempts
  if (player.attempts === 5) {

    reactionTimes.length = 0;
    player.bestTime = null;
    player.attempts = 0;

    lastTimeDisplay.textContent = "-- ms";
    bestTimeDisplay.textContent = "-- ms";
    averageTimeDisplay.textContent = "-- ms";
    attemptsDisplay.textContent = "0";

    historyList.innerHTML = "<li>No attempts yet</li>";

  }

  gameState = "waiting";

  gameScreen.style.background = "#fef3c7";
  gameMessage.textContent = "Wait for green...";
  gameInstruction.textContent = "Don't click yet!";

  startButton.disabled = true;

  const randomDelay = Math.floor(Math.random() * 3000) + 2000;

  waitingTimer = setTimeout(() => {

    gameState = "go";

    gameScreen.style.background = "#22c55e";
    gameMessage.textContent = "CLICK NOW!";
    gameInstruction.textContent = "React as fast as you can!";

    startTime = Date.now();

  }, randomDelay);
}

// 5. Handle game screen clicks
function handleClick() {

  if (gameState === "waiting") {

    clearTimeout(waitingTimer);

    gameState = "ready";

    gameScreen.style.background = "#fee2e2";
    gameMessage.textContent = "Too Early!";
    gameInstruction.textContent = "You clicked before green. Try again!";

    startButton.disabled = false;

  }

  else if (gameState === "go") {

    const reactionTime = Date.now() - startTime;

    gameState = "finished";

    // Update player data
    reactionTimes.push(reactionTime);
    player.attempts++;

    if (player.bestTime === null || reactionTime < player.bestTime) {
      player.bestTime = reactionTime;
    }

    // Calculate average reaction time
    const totalTime = reactionTimes.reduce((total, time) => {
      return total + time;
    }, 0);

    const averageTime = Math.round(totalTime / reactionTimes.length);

    // Display statistics
    lastTimeDisplay.textContent = reactionTime + " ms";
    bestTimeDisplay.textContent = player.bestTime + " ms";
    averageTimeDisplay.textContent = averageTime + " ms";
    attemptsDisplay.textContent = player.attempts + "/5";

    // Update history
    historyList.innerHTML = "";

    reactionTimes.forEach((time, index) => {

      const listItem = document.createElement("li");

      listItem.textContent = `Attempt ${index + 1}: ${time} ms`;

      historyList.appendChild(listItem);

    });

    gameScreen.style.background = "#ede9fe";

    // Best of 5 final screen
    if (player.attempts === 5) {

      gameMessage.textContent = "Challenge Complete! 🏆";

      gameInstruction.textContent =
        `Best: ${player.bestTime} ms | Average: ${averageTime} ms`;

      startButton.textContent = "Play Again";

    }

    else {

      gameMessage.textContent = reactionTime + " ms";

      gameInstruction.textContent =
        `${5 - player.attempts} attempts remaining. Great job!`;

      startButton.textContent = "Next Round";

    }

    startButton.disabled = false;

  }
}

// 6. Connect events
startButton.addEventListener("click", startGame);

gameScreen.addEventListener("click", handleClick);
