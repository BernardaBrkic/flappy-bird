document.addEventListener("DOMContentLoaded", () => {
  const player = document.querySelector(".player");
  const gameViewport = document.querySelector(".game-viewport");
  const ground = document.querySelector(".ground");

  let playerBottom = 45;
  let playerleft = 20;
  let gravity = 0.4;
  let didDie = false;

  function startGame() {
    playerBottom -= gravity;
    player.style.bottom = playerBottom + "vh";
    player.style.left = playerleft + "%";
  }
  let timerId = setInterval(startGame, 20);

  function controllingKey(event) {
    if (event.keyCode === 32) {
      fly();
    }
  }

  function fly() {
    if (playerBottom < 85) playerBottom += 10;
    player.style.bottom = playerBottom + "vh";
  }
  document.addEventListener("keyup", controllingKey);

  function obstacleCreator() {
    let obstacleLeft = 95;
    let randomHeight = Math.random() * 8;
    let obstacleBottom = randomHeight;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    gameViewport.appendChild(obstacle);
    obstacle.style.bottom = obstacleBottom + "vh";
    obstacle.style.left = obstacleLeft + "%";

    function moveObstacle() {
      obstacleLeft -= 2;

      obstacle.style.left = obstacleLeft + "%";
      if (obstacleLeft === -5) {
        clearInterval(timerId);
        gameViewport.removeChild(obstacle);
      }

      if (playerBottom <= 10) {
        gameOver();
      }
      if (
        (obstacleLeft > 15 &&
          obstacleLeft < 25 &&
          playerleft === 20 &&
          playerBottom < obstacleBottom + 22) ||
        playerBottom === 0
      ) {
        gameOver();
        clearInterval(timerId);
        console.log("Game over!");
      }
    }
    let timerId = setInterval(moveObstacle, 80);
    if (!didDie) setTimeout(obstacleCreator, 1500);
  }
  obstacleCreator();

  function gameOver() {
    clearInterval(timerId);
    didDie = true;

    document.removeEventListener("keyup", controllingKey);
  }
});
