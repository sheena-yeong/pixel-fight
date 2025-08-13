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
  document.querySelector("#displayText").style.display = "flex";
  document.querySelector("#roundCountDown").style.display = "flex";
  document.querySelector("#reset").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins a Point";
    playerPoints += 1;
  } else if (enemy.health > player.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins a Point";
    enemyPoints += 1;
  }

  document.querySelector("#playerPoints").innerHTML = "Points: " + playerPoints;
  document.querySelector("#enemyPoints").innerHTML = "Points: " + enemyPoints;

  if (playerPoints === 3 || enemyPoints === 3) {
    if (playerPoints > enemyPoints) {
      document.querySelector("#displayText").innerHTML =
        "Player 1 Wins the game!";
      document.querySelector("#roundCountDown").innerHTML =
        "~ Thanks for playing ~";
      document.querySelector("#reset").innerHTML = "Press R to Play Again"
    } else {
      document.querySelector("#displayText").innerHTML =
        "Player 2 Wins the game!";
      document.querySelector("#roundCountDown").innerHTML =
        "~ Thanks for playing ~";
      document.querySelector("#reset").innerHTML = "Press R to Play Again"
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

function decreaseRoundTimer() {
  if (roundTimer > 0) {
    canAttack = false;
    roundTimerID = setTimeout(decreaseRoundTimer, 1000);
    roundTimer--;
    document.querySelector("#roundCountDown").innerHTML =
      "Next Round in " + roundTimer;
  } else if (roundTimer === 0 && gameOver) {
    nextRound();
  }
}

function nextRound() {
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
  enemy.image = player.sprites.idle.image;
  enemy.framesMax = player.sprites.idle.framesMax;
  enemy.framesCurrent = 0;
  document.querySelector("#enemyHealth").style.width = enemy.health + "%";

  document.querySelector("#roundCountDown").innerHTML = null;
  document.querySelector("#displayText").innerHTML = null;

  document.querySelector("#round").innerHTML = "Round " + round;
  canAttack = true;
  roundTimer = 8;
  timer = 31;
  gameOver = false;
  decreaseTimer();
}

function resetGame() {
  console.log("Game Resetting")
  nextRound();
  round = 1;
  document.querySelector("#round").innerHTML = "Round " + round;

  playerPoints = 0;
  document.querySelector("#playerPoints").innerHTML = "Points: " + playerPoints;
  
  enemyPoints = 0;
  document.querySelector("#enemyPoints").innerHTML = "Points: " + enemyPoints;

  document.querySelector("#reset").innerHTML = null;
  document.querySelector("#reset").style.display = "none";
}