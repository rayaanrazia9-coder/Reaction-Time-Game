// ============================================
// REACTION RUSH — WEEK 6
// CYBER PULSE EDITION
// ============================================

// 1. SELECT HTML ELEMENTS

const gameScreen = document.getElementById("gameScreen");
const gameMessage = document.getElementById("gameMessage");
const gameInstruction = document.getElementById("gameInstruction");
const startButton = document.getElementById("startButton");

const lastTimeDisplay = document.getElementById("lastTime");
const bestTimeDisplay = document.getElementById("bestTime");
const attemptsDisplay = document.getElementById("attempts");
const averageTimeDisplay = document.getElementById("averageTime");
const historyList = document.getElementById("historyList");

// 2. GAME SETTINGS

const TOTAL_ROUNDS = 5;
const STORAGE_KEY = "reactionRushBestTime";

// 3. PLAYER DATA

let reactionTimes = [];

let savedBest = Number(localStorage.getItem(STORAGE_KEY));

let player = {
  bestTime: savedBest > 0 ? savedBest : null,
  attempts: 0,
};

// 4. GAME VARIABLES

let startTime = 0;
let waitingTimer = null;
let gameState = "ready";

// 5. GAME COLORS

const colors = {
  ready: "#25293a",
  waiting: "#78350f",
  go: "#14532d",
  early: "#7f1d1d",
  result: "#312e81",
};

// 6. RESET GAME

function resetGame() {
  clearTimeout(waitingTimer);

  reactionTimes = [];
  player.attempts = 0;

  gameState = "ready";

  lastTimeDisplay.textContent = "-- ms";
  averageTimeDisplay.textContent = "-- ms";
  attemptsDisplay.textContent = "0";

  historyList.innerHTML = "<li>No attempts yet</li>";

  gameScreen.style.background = colors.ready;

  gameMessage.textContent = "Ready?";
  gameInstruction.textContent = "Click the button below to start.";

  startButton.textContent = "Start Game";
  startButton.disabled = false;

  bestTimeDisplay.textContent =
    player.bestTime !== null ? player.bestTime + " ms" : "-- ms";
}

// 7. START GAME

function startGame() {
  if (gameState === "waiting" || gameState === "go") {
    return;
  }

  if (gameState === "finished") {
    resetGame();
  }

  clearTimeout(waitingTimer);

  gameState = "waiting";

  gameScreen.style.background = colors.waiting;

  gameMessage.textContent = "Get Ready...";
  gameInstruction.textContent = "Wait for green. Don't click yet!";

  startButton.disabled = true;

  const randomDelay = Math.floor(Math.random() * 3000) + 2000;

  waitingTimer = setTimeout(() => {
    gameState = "go";

    gameScreen.style.background = colors.go;

    gameMessage.textContent = "CLICK NOW!";
    gameInstruction.textContent = "React as fast as you can!";

    startTime = performance.now();
  }, randomDelay);
}

// 8. HANDLE GAME SCREEN CLICKS

function handleClick() {
  // FALSE START
  if (gameState === "waiting") {
    clearTimeout(waitingTimer);

    gameState = "result";

    gameScreen.style.background = colors.early;

    gameMessage.textContent = "Too Early!";

    gameInstruction.textContent = "You clicked before green. Try again!";

    startButton.textContent = "Try Again";
    startButton.disabled = false;

    return;
  }

  // SUCCESSFUL REACTION
  if (gameState === "go") {
    const reactionTime = Math.round(performance.now() - startTime);

    gameState = "result";

    reactionTimes.push(reactionTime);
    player.attempts++;

    // UPDATE PERSONAL BEST
    if (player.bestTime === null || reactionTime < player.bestTime) {
      player.bestTime = reactionTime;

      localStorage.setItem(STORAGE_KEY, player.bestTime);
    }

    // CALCULATE AVERAGE
    const totalTime = reactionTimes.reduce((total, time) => total + time, 0);

    const averageTime = Math.round(totalTime / reactionTimes.length);

    // UPDATE STATISTICS
    lastTimeDisplay.textContent = reactionTime + " ms";

    bestTimeDisplay.textContent = player.bestTime + " ms";

    averageTimeDisplay.textContent = averageTime + " ms";

    attemptsDisplay.textContent = player.attempts + "/" + TOTAL_ROUNDS;

    // UPDATE HISTORY
    if (player.attempts === 1) {
      historyList.innerHTML = "";
    }

    const listItem = document.createElement("li");

    listItem.textContent = `Round ${player.attempts}: ${reactionTime} ms`;

    historyList.prepend(listItem);

    // REACTION FEEDBACK
    let feedback;

    if (reactionTime < 200) {
      feedback = "Incredible reflexes! ⚡";
    } else if (reactionTime < 250) {
      feedback = "Excellent reaction! 🔥";
    } else if (reactionTime < 350) {
      feedback = "Good job! Keep improving.";
    } else if (reactionTime < 500) {
      feedback = "Not bad! You can go faster.";
    } else {
      feedback = "Keep practicing!";
    }

    gameScreen.style.background = colors.result;

    // CHALLENGE COMPLETED
    if (player.attempts === TOTAL_ROUNDS) {
      gameState = "finished";

      gameMessage.textContent = "Challenge Complete! 🏆";

      gameInstruction.textContent = `Best: ${player.bestTime} ms | Average: ${averageTime} ms`;

      startButton.textContent = "Play Again";
    } else {
      gameMessage.textContent = reactionTime + " ms";

      gameInstruction.textContent =
        feedback + ` ${TOTAL_ROUNDS - player.attempts} rounds remaining.`;

      startButton.textContent = "Next Round";
    }

    startButton.disabled = false;
  }
}

// 9. CONNECT EVENTS

startButton.addEventListener("click", startGame);

gameScreen.addEventListener("click", handleClick);

// 10. INITIALIZE GAME

resetGame();
