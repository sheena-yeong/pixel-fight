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
  decreaseRoundTimer();
  document.querySelector("#displayText").style.display = "flex";
  document.querySelector("#roundCountDown").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins";
    playerPoints += 1;
  } else if (enemy.health > player.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins";
    enemyPoints += 1;
  }

  document.querySelector("#playerPoints").innerHTML = "Wins: " + playerPoints;
  document.querySelector("#enemyPoints").innerHTML = "Wins: " + enemyPoints;

  console.log(
    `Round: ${round}; Player 1: ${playerPoints}; Player 2: ${enemyPoints}`
  );
}

let timer = 30;
let timerID;
function decreaseTimer() {
  if (timer > 0) {
    timerID = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
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
  } else if (roundTimer === 0) {
    console.log("Start Next Round");
  }
}
