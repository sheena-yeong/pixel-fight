// Setting up canvas
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

let playerPoints = 0;
let enemyPoints = 0;
let round = 1;
let canAttack = true;
let gameOver = false;
let isReady = false;

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/cloud_background.png",
});

// Create player
const player = new Fighter({
  position: {
    x: 80,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samurai/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 220,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samurai/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samurai/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samurai/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samurai/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samurai/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samurai/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samurai/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 50,
      y: 30,
    },
    width: 202,
    height: 50,
  },
});

// Create enemy
const enemy = new Fighter({
  position: {
    x: 900,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samurai2/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 230,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samurai2/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/samurai2/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samurai2/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samurai2/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samurai2/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/samurai2/Take hit - white silhouette2.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/samurai2/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -187,
      y: 30,
    },
    width: 187,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

// Limit jump to only once
function jump(character) {
  const onGroundChar = character.velocity.y === 0;
  if (onGroundChar) {
    character.velocity.y = -20;
  }
}

function animate() {
  if (!isReady) return
  window.requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height); // Clear it and re-draw repeatedly
  background.update();
  player.update();
  enemy.update();

  player.velocity.x = 0; // Make sure sprite stops moving when key is up
  enemy.velocity.x = 0;

  // restrict x boundary for player
  if (player.position.x < 0) {
    player.position.x = 0;
  } else if (player.position.x > 1024 - player.width) {
    player.position.x = 1024 - player.width;
  }

  // restrict x boundary for enemy
  if (enemy.position.x < 0) {
    enemy.position.x = 0;
  } else if (enemy.position.x > 1024 - enemy.width) {
    enemy.position.x = 1024 - enemy.width;
  }

  // player movement
  if (!player.dead) {
    if (keys.a.pressed && player.lastKey === "a") {
      player.velocity.x = -5;
      player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
      player.velocity.x = 5;
      player.switchSprite("run");
    } else {
      player.switchSprite("idle");
    }

    if (player.velocity.y < 0) {
      player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
      player.switchSprite("fall");
    }
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Collision detection
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4 &&
    canAttack
  ) {
    enemy.takeHit(15);
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4 && canAttack) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2 &&
    canAttack
  ) {
    player.takeHit(10);
    enemy.isAttacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2 && canAttack) {
    enemy.isAttacking = false;
  }

  // end game if health is zero
  if ((player.health <= 0 || enemy.health <= 0) && !gameOver) {
    gameOver = true;
    determineWinner({ player, enemy, timerID });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key)
  if (event.key === "r") {
    resetGame()
  } else if (event.key === "Enter" && !isReady) {
    isReady = true;
    animate();
    decreaseTimer();
    startGame();
    console.log("Ready!")
  }

  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        jump(player);
        break;
      case " ":
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        jump(enemy);
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
