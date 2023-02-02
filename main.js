// start menu
let wasChosen = false;
var player_selection_sound = document.getElementById("player_selection");
var clicked_sound = document.getElementById("clicked");

function firstAgent() {
  player_selection_sound.currentTime = 0;
  player_selection_sound.play();
  document.getElementById("chosen_agent").innerHTML = "Odabran je Igrač 1!";
  wasChosen = true;

  if (wasChosen) {
    document.getElementById("next").style.display = "block";
    document.querySelector(".player").src = "./assets/Players/player.png";
  }
}

function secondAgent() {
  player_selection_sound.currentTime = 0;
  player_selection_sound.play();
  document.getElementById("chosen_agent").innerHTML = "Odabran je Igrač 2!";
  wasChosen = true;

  if (wasChosen) {
    document.getElementById("next").style.display = "block";
    document.querySelector(".player").src = "./assets/Players/player2.png";
  }
}

function thirdAgent() {
  player_selection_sound.currentTime = 0;
  player_selection_sound.play();
  document.getElementById("chosen_agent").innerHTML = "Odabran je Igrač 3!";
  wasChosen = true;

  if (wasChosen) {
    document.getElementById("next").style.display = "block";
    document.querySelector(".player").src = "./assets/Players/player3.png";
  }
}

function fourthAgent() {
  player_selection_sound.currentTime = 0;
  player_selection_sound.play();
  document.getElementById("chosen_agent").innerHTML = "Odabran je Igrač 4!";
  wasChosen = true;

  if (wasChosen) {
    document.getElementById("next").style.display = "block";
    document.querySelector(".player").src = "./assets/Players/player4.png";
  }
}

let wasMuted = false;
let wasClicked = false;
function mute() {
  wasMuted = !wasMuted;
  wasClicked = !wasClicked;

  if (wasMuted) {
    background_sound.muted = true;
    game_over_sound.muted = true;
    player_selection_sound.muted = true;
    clicked_sound.muted = true;
  }
  if (!wasClicked && !wasMuted) {
    background_sound.muted = false;
    game_over_sound.muted = false;
    player_selection_sound.muted = false;
    clicked_sound.muted = false;
  }
}

let startGame = false;
function next() {
  clicked_sound.currentTime = 0;
  clicked_sound.play();
  startGame = true;
  document.querySelector(".start").style.display = "none";
  document.querySelector(".start_info").style.display = "block";
}

// Background scrolling speed
let move_speed = 4;

// Gravity constant value
let gravity = 0.25;

// Getting reference to the player element
let player = document.querySelector(".player");

// Getting player element properties
let player_props = player.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();

// Getting reference to the score element
let value = document.querySelector(".value");
let start_info = document.querySelector(".start_info");
let score_title = document.querySelector(".score_title");
let overlay = document.querySelector(".overlay");
let game_lost = document.querySelector(".game_lost");
let button = document.querySelector(".btn");

// soundtrack
var background_sound = document.getElementById("background_audio");
var game_over_sound = document.getElementById("game_over_sound");
// var jump_sound = document.getElementById("jump_sound");

// Setting initial game state to start
let game_state = "Start";

// Add an eventlistener for key presses
document.addEventListener("keydown", (e) => {
  // Start the game if enter key is pressed
  if (e.key == "Enter" && game_state != "Play" && wasChosen && startGame) {
    game_over_sound.pause();
    game_over_sound.currentTime = 0;
    background_sound.play();
    background_sound.loop = true;

    document.querySelectorAll(".obstacle_sprite").forEach((e) => {
      e.remove();
    });
    player.style.top = "40vh";
    game_state = "Play";
    start_info.innerHTML = "";
    score_title.innerHTML = "Score : ";
    value.innerHTML = "0";
    overlay.style.display = "none";
    game_lost.style.display = "none";
    button.style.display = "none";
    play();
  }
});
function play() {
  function move() {
    // Detect if game has ended
    if (game_state != "Play") {
      overlay.style.display = "block";
      game_lost.style.display = "block";
      button.style.display = "block";

      background_sound.pause();
      background_sound.currentTime = 0;

      game_over_sound.play();
      return;
    }

    // Getting reference to all the obstacle elements
    let obstacle_sprite = document.querySelectorAll(".obstacle_sprite");
    obstacle_sprite.forEach((element) => {
      let obstacle_sprite_props = element.getBoundingClientRect();
      player_props = player.getBoundingClientRect();

      // Delete the obstacles if they have moved out
      // of the screen hence saving memory
      if (obstacle_sprite_props.right <= 0) {
        element.remove();
      } else {
        // Collision detection with player and obstacles
        if (
          player_props.left <
            obstacle_sprite_props.left + obstacle_sprite_props.width &&
          player_props.left + player_props.width > obstacle_sprite_props.left &&
          player_props.top <
            obstacle_sprite_props.top + obstacle_sprite_props.height &&
          player_props.top + player_props.height > obstacle_sprite_props.top
        ) {
          // Change game state and end the game
          // if collision occurs
          game_state = "End";
          start_info.innerHTML = "Kliknite 'enter' za početak igre.";

          return;
        } else {
          // Increase the score if player
          // has the successfully dodged the
          if (
            obstacle_sprite_props.right < player_props.left &&
            obstacle_sprite_props.right + move_speed >= player_props.left &&
            element.increase_score == "1"
          ) {
            value.innerHTML = +value.innerHTML + 1;
          }
          element.style.left = obstacle_sprite_props.left - move_speed + "px";
        }
      }
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  let player_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    player_dy = player_dy + gravity;
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        player_dy = -7.6;
      }
      // jump_sound.play();
    });

    // Collision detection with player and
    // window top and bottom

    if (player_props.top <= 0 || player_props.bottom >= background.bottom) {
      game_state = "End";
      start_info.innerHTML = "Kliknite 'enter' za početak igre.";

      return;
    }
    player.style.top = player_props.top + player_dy + "px";
    player_props = player.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let obstacle_seperation = 0;

  // Constant value for the gap between two obstacles
  let obstacle_gap = 50;
  function create_obstacle() {
    if (game_state != "Play") return;

    // Create another set of obstacles
    // if distance between two obstacle has exceeded
    // a predefined value
    if (obstacle_seperation > 115) {
      obstacle_seperation = 0;

      // Calculate random position of obstacles on y axis
      let obstacle_posi = Math.floor(Math.random() * 43) + 8;
      let obstacle_sprite_inv = document.createElement("div");
      obstacle_sprite_inv.className = "obstacle_sprite";
      obstacle_sprite_inv.style.top = obstacle_posi - 70 + "vh";
      obstacle_sprite_inv.style.left = "100vw";

      // Append the created obstacle element in DOM
      document.body.appendChild(obstacle_sprite_inv);
      let obstacle_sprite = document.createElement("div");
      obstacle_sprite.className = "obstacle_sprite";
      obstacle_sprite.style.top = obstacle_posi + obstacle_gap + "vh";
      obstacle_sprite.style.left = "100vw";
      obstacle_sprite.increase_score = "1";

      // Append the created obstacle element in DOM
      document.body.appendChild(obstacle_sprite);
    }
    obstacle_seperation++;
    requestAnimationFrame(create_obstacle);
  }
  requestAnimationFrame(create_obstacle);
}
