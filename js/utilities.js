function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerID }) {
  clearTimeout(timerID);
  gameOver = true;
  document.querySelector("#displayText").style.display = "flex";
  document.querySelector("#roundCountDown").style.display = "flex";
  document.querySelector("#reset").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "TIE";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "P1 WINS A POINT";
    playerPoints += 1;
  } else if (enemy.health > player.health) {
    document.querySelector("#displayText").innerHTML = "P2 WINS A POINT";
    enemyPoints += 1;
  }

  document.querySelector("#playerPoints").innerHTML = "Points: " + playerPoints;
  document.querySelector("#enemyPoints").innerHTML = "Points: " + enemyPoints;

  if (playerPoints === 3 || enemyPoints === 3) {
    if (playerPoints > enemyPoints) {
      document.querySelector("#displayText").innerHTML =
        "P1 WINS";
      document.querySelector("#roundCountDown").innerHTML =
        "~ THANKS FOR PLAYING ~";
      document.querySelector("#reset").innerHTML = "PRESS R TO PLAY AGAIN"
    } else {
      document.querySelector("#displayText").innerHTML =
        "P2 WINS";
      document.querySelector("#roundCountDown").innerHTML =
        "~ THANKS FOR PLAYING ~";
      document.querySelector("#reset").innerHTML = "PRESS R TO PLAY AGAIN"
    }
    return;
  }
  decreaseRoundTimer();
}

let timer = 31;
let timerID;
function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    gameOver = true;
    determineWinner({ player, enemy, timerID });
  }
}

let roundTimer = 8;
let roundTimerID;

// Counts down to next round and starts new round
function decreaseRoundTimer() {
  if (roundTimer > 0) {
    canAttack = false;
    roundTimerID = setTimeout(decreaseRoundTimer, 1000);
    roundTimer--;
    document.querySelector("#roundCountDown").innerHTML =
      "NEXT ROUND STARTING IN " + roundTimer;
  } else if (roundTimer === 0) {
    // Check if the game is completely over (someone won 3 points)
    if (playerPoints === 3 || enemyPoints === 3) {
      // Game is over, don't start new round
      return;
    } else {
      // Start new round with counter
      counterIndex = 0;
      counter();
      newRound();
    }
  }
}

// Resets sprites for new round
function newRound() {
  round++;

  player.position.x = 80;
  player.health = 100;
  player.dead = false;
  player.image = player.sprites.idle.image;
  player.framesMax = player.sprites.idle.framesMax;
  player.framesCurrent = 0;
  document.querySelector("#playerHealth").style.width = player.health + "%";

  enemy.position.x = 900;
  enemy.health = 100;
  enemy.dead = false;
  enemy.image = enemy.sprites.idle.image;
  enemy.framesMax = enemy.sprites.idle.framesMax;
  enemy.framesCurrent = 0;
  document.querySelector("#enemyHealth").style.width = enemy.health + "%";

  document.querySelector("#roundCountDown").innerHTML = null;
  document.querySelector("#displayText").innerHTML = null;

  document.querySelector("#round").innerHTML = "Round " + round;
  canAttack = true;
  roundTimer = 8;
  timer = 31;
  gameOver = false;
  clearTimeout(timerID);
  clearTimeout(roundTimerID);
}

// Reset game when user presses play again
function resetGame() {
  round = 0;
  document.querySelector("#round").innerHTML = "Round " + round;
  
  playerPoints = 0;
  document.querySelector("#playerPoints").innerHTML = "Points: " + playerPoints;
  
  enemyPoints = 0;
  document.querySelector("#enemyPoints").innerHTML = "Points: " + enemyPoints;
  
  document.querySelector("#reset").innerHTML = null;
  document.querySelector("#reset").style.display = "none";

  newRound();
}

// Show HUD
function showHUD() {
  document.querySelector("#round").innerHTML = "Round 1";
  document.querySelector("#title").style.display = "none";
  document.querySelectorAll(".line").forEach(el => {el.style.display = "none";})
  document.querySelector("#pressEnter").innerHTML = null;

  document.querySelector("#HUD").style.display = "flex";
  document.querySelector("#playerPoints").style.display = "flex";
  document.querySelector("#enemyPoints").style.display = "flex";
  document.querySelector("#P1").style.display = "flex";
  document.querySelector("#P2").style.display = "flex";
}

counterArray = ["3", "2", "1", "FIGHT!"]
let counterIndex = 0;
const countdownEl = document.querySelector("#countDown")

// Conut down before fight starts
function counter() {
  if (counterIndex < counterArray.length) {
    countdownEl.textContent = counterArray[counterIndex];
    countdownEl.style.animation = "none";
    countdownEl.offsetHeight;
    document.querySelector("#timer").innerHTML = 30;

    if (counterArray[counterIndex] === "FIGHT!") {
      countdownEl.style.animation = "blinkTwice 0.5s step-start forwards";
      console.log("counterIndex is " + counterIndex);
      decreaseTimer()
    } else {
      countdownEl.style.animation = "fadeIn 1s linear"; // forwards = the element keeps the final keyframe state, step-start = jumps immediately at the start of each step (no smooth fading, just instant change).
    }
    counterIndex++
    setTimeout(counter, 1000);
  } else {
    countdownEl.textContent = "";
  }
}