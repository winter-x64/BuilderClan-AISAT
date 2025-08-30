document.addEventListener("DOMContentLoaded", () => {
    // FAQ Show More Button
    const showMoreBtn = document.getElementById("showMoreBtn");
    const hiddenCards = document.querySelectorAll(".card.hidden");
    let expanded = false;

    showMoreBtn?.addEventListener("click", () => {
        if (!expanded) {
            hiddenCards.forEach(card => card.classList.remove("hidden"));
            showMoreBtn.textContent = "Show Less";
            expanded = true;
        } else {
            hiddenCards.forEach(card => card.classList.add("hidden"));
            showMoreBtn.textContent = "Show More";
            expanded = false;
        }
    });

    // Rocket Easter Egg
    const rocket = document.querySelector(".rocket");
    const popup = document.getElementById("easterEggPopup");
    const closePopup = document.getElementById("closePopup");
    let launchCount = 0;

    rocket?.addEventListener("click", () => {
        launchCount++;
        rocket.classList.remove("launch");
        void rocket.offsetWidth;
        rocket.classList.add("launch");
        if (launchCount === 1) console.log("🚀 Keep clicking, Big Brain XD...");
        if (launchCount === 2) console.log("🌌 Almost there...");
        if (launchCount === 3) {
            popup.style.display = "flex";
            launchCount = 0;
        }
    });

    rocket?.addEventListener("animationend", () => {
        rocket.classList.remove("launch");
    });

    closePopup?.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Team Hell Week game
    let hellcount = 0
    const hellweek = document.getElementById("hell");
    hellweek.addEventListener('click', () => {
        hellcount++;
        if (hellcount === 2) console.log("🐍 Seriously Bruh, you think this is a game?");
        if (hellcount === 3) console.log("🕸️ finally a curious one hmm lets see ...");
        if (hellcount == 4) {
            console.log("🏴󠁩󠁳󠀱󠁿 Task 1: follow __naveen__.pyw")
            console.log("🏴󠁩󠁳󠀱󠁿 Task 2: follow https://github.com/GhostInHex-x86")
        }
        if (hellcount === 5) {
            const container = document.getElementById('snakeGameContainer');
            container.style.display = 'block';
            startSnakeGame();
            hellcount = 0;
        }
    });

    // Builderclan logo game
    let logocount = 0
    const builderLogoWrapper = document.getElementById("builderlogo");
    builderLogoWrapper.addEventListener('click', () => {
        logocount++;
        if (logocount === 1) console.log("🔨 You like poking logos huh?");
        if (logocount === 2) console.log("👀 Careful... you might just break into something...");
        if (logocount === 3) {
            console.log("🎮 Okay fine, you found it. Welcome to Flappy Hell 😈");
            const container = document.getElementById('flappyGameContainer');
            container.style.display = 'block';
            container.classList.add('fadeIn');
            logocount = 0;
            startFlappyGame();
        }
    });

    // AOS
    if (AOS) {
        AOS.init({ duration: 1000, once: true });
    }
});



function startSnakeGame() {
    const playBoard = document.querySelector("#snakeGameContainer .play-board");
    const scoreElement = document.querySelector("#snakeGameContainer .score");
    const highScoreElement = document.querySelector("#snakeGameContainer .high-score");
    const controls = document.querySelectorAll("#snakeGameContainer .controls i");

    let gameOver = false;
    let foodX, foodY;
    let snakeX = 5, snakeY = 5;
    let velocityX = 0, velocityY = 0;
    let snakeBody = [];
    let setIntervalId;
    let score = 0;

    let highScore = localStorage.getItem("high-score") || 0;
    highScoreElement.innerText = `High Score: ${highScore}`;

    const updateFoodPosition = () => {
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;
    }

    const handleGameOver = () => {
        clearInterval(setIntervalId);
        alert("Game Over! Press OK to go back...");
        location.reload();
    }

    const changeDirection = e => {
        if (e.key === "ArrowUp" && velocityY != 1) {
            velocityX = 0; velocityY = -1;
        } else if (e.key === "ArrowDown" && velocityY != -1) {
            velocityX = 0; velocityY = 1;
        } else if (e.key === "ArrowLeft" && velocityX != 1) {
            velocityX = -1; velocityY = 0;
        } else if (e.key === "ArrowRight" && velocityX != -1) {
            velocityX = 1; velocityY = 0;
        }
    }

    controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

    const initGame = () => {
        if (gameOver) return handleGameOver();
        let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

        if (snakeX === foodX && snakeY === foodY) {
            updateFoodPosition();
            snakeBody.push([foodY, foodX]);
            score++;
            highScore = score >= highScore ? score : highScore;
            localStorage.setItem("high-score", highScore);
            scoreElement.innerText = `Score: ${score}`;
            highScoreElement.innerText = `High Score: ${highScore}`;
        }

        snakeX += velocityX;
        snakeY += velocityY;

        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1];
        }
        snakeBody[0] = [snakeX, snakeY];

        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
            return gameOver = true;
        }

        for (let i = 0; i < snakeBody.length; i++) {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
        playBoard.innerHTML = html;
    }

    updateFoodPosition();
    setIntervalId = setInterval(initGame, 100);
    document.addEventListener("keyup", changeDirection);
}


let flappyInterval = null;
let flappyRunning = false;
let flappyHandlersAttached = false;
// Flappy bird game
function startFlappyGame() {
    const container = document.getElementById("flappyGameContainer");
    const myCanvas = document.getElementById("flappyCanvas");
    var ctx = myCanvas.getContext("2d");
    var FPS = 40;
    var jump_amount = -10;
    var max_fall_speed = +10;
    var acceleration = 1;
    var pipe_speed = -2;
    var game_mode = "prestart";
    var time_game_last_running;
    var bottom_bar_offset = 0;
    var pipes = [];

    function attachFlappyListeners() {
        window.addEventListener("touchstart", Got_Player_Input, { passive: false });
        window.addEventListener("mousedown", Got_Player_Input, { passive: false });
        window.addEventListener("keydown", Got_Player_Input, { passive: false });
    }
    function detachFlappyListeners() {
        window.removeEventListener("touchstart", Got_Player_Input, { passive: false });
        window.removeEventListener("mousedown", Got_Player_Input, { passive: false });
        window.removeEventListener("keydown", Got_Player_Input, { passive: false });
    }

    function MySprite(img_url) {
        this.x = 0;
        this.y = 0;
        this.visible = true;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.MyImg = new Image();
        this.MyImg.src = img_url || "";
        this.angle = 0;
        this.flipV = false;
        this.flipH = false;
    }
    MySprite.prototype.Do_Frame_Things = function () {
        ctx.save();
        ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
        ctx.rotate((this.angle * Math.PI) / 180);
        if (this.flipV) ctx.scale(1, -1);
        if (this.flipH) ctx.scale(-1, 1);
        if (this.visible)
            ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
        this.x = this.x + this.velocity_x;
        this.y = this.y + this.velocity_y;
        ctx.restore();
    };
    function ImagesTouching(thing1, thing2) {
        if (!thing1.visible || !thing2.visible) return false;
        if (
            thing1.x >= thing2.x + thing2.MyImg.width ||
            thing1.x + thing1.MyImg.width <= thing2.x
        )
            return false;
        if (
            thing1.y >= thing2.y + thing2.MyImg.height ||
            thing1.y + thing1.MyImg.height <= thing2.y
        )
            return false;
        return true;
    }
    function Got_Player_Input(MyEvent) {
        if (MyEvent.type === "keydown" && (MyEvent.key === "Escape" || MyEvent.code === "Escape")) {
            game_mode = "exit";
            MyEvent.preventDefault();
            return;
        }
        switch (game_mode) {
            case "prestart": {
                game_mode = "running";
                break;
            }
            case "running": {
                bird.velocity_y = jump_amount;
                break;
            }
            case "over": {
                if (new Date() - time_game_last_running > 1000) {
                    reset_game();
                    game_mode = "running";
                    break;
                }
            }
            case "exit": {
                // stop loop
                if (flappyInterval) { clearInterval(flappyInterval); flappyInterval = null; }

                // stop inputs
                detachFlappyListeners();

                // clear canvas (optional)
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

                // hide the overlay/container
                container.style.display = "none";

                // bail out of this frame
                return;
            }
        }
        MyEvent.preventDefault();
    }
    attachFlappyListeners();
    // addEventListener("touchstart", Got_Player_Input);
    // addEventListener("mousedown", Got_Player_Input);
    // addEventListener("keydown", Got_Player_Input);
    function make_bird_slow_and_fall() {
        if (bird.velocity_y < max_fall_speed) {
            bird.velocity_y = bird.velocity_y + acceleration;
        }
        if (bird.y > myCanvas.height - bird.MyImg.height) {
            bird.velocity_y = 0;
            game_mode = "over";
        }
        if (bird.y < 0 - bird.MyImg.height) {
            bird.velocity_y = 0;
            game_mode = "over";
        }
    }

    function add_pipe(x_pos, top_of_gap, gap_width) {
        var top_pipe = new MySprite();
        top_pipe.MyImg = pipe_piece;
        top_pipe.x = x_pos;
        top_pipe.y = top_of_gap - pipe_piece.height;
        top_pipe.velocity_x = pipe_speed;
        pipes.push(top_pipe);
        var bottom_pipe = new MySprite();
        bottom_pipe.MyImg = pipe_piece;
        bottom_pipe.flipV = true;
        bottom_pipe.x = x_pos;
        bottom_pipe.y = top_of_gap + gap_width;
        bottom_pipe.velocity_x = pipe_speed;
        pipes.push(bottom_pipe);
    }
    function make_bird_tilt_appropriately() {
        if (bird.velocity_y < 0) {
            bird.angle = -15;
        } else if (bird.angle < 70) {
            bird.angle = bird.angle + 4;
        }
    }
    function show_the_pipes() {
        for (var i = 0; i < pipes.length; i++) {
            pipes[i].Do_Frame_Things();
        }
    }
    function check_for_end_game() {
        for (var i = 0; i < pipes.length; i++)
            if (ImagesTouching(bird, pipes[i])) game_mode = "over";
    }
    function display_intro_instructions() {
        ctx.font = "25px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(
            "Press, touch or click to start",
            myCanvas.width / 2,
            myCanvas.height / 4
        );
    }
    function display_game_over() {
        var score = 0;
        for (var i = 0; i < pipes.length; i++)
            if (pipes[i].x < bird.x) score = score + 0.5;
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", myCanvas.width / 2, 100);
        ctx.fillText("Score: " + score, myCanvas.width / 2, 150);
        ctx.font = "20px Arial";
        ctx.fillText("Click, touch, or press to play again", myCanvas.width / 2, 300);
        ctx.fillText("Press ESC to Exit", myCanvas.width / 2, 340);
    }
    function display_bar_running_along_bottom() {
        if (bottom_bar_offset < -23) bottom_bar_offset = 0;
        ctx.drawImage(
            bottom_bar,
            bottom_bar_offset,
            myCanvas.height - bottom_bar.height
        );
    }
    function reset_game() {
        bird.y = myCanvas.height / 2;
        bird.angle = 0;
        pipes = []; // erase all the pipes from the array
        add_all_my_pipes(); // and load them back in their starting positions
    }
    function add_all_my_pipes() {
        add_pipe(500, 100, 140);
        add_pipe(800, 50, 140);
        add_pipe(1000, 250, 140);
        add_pipe(1200, 150, 120);
        add_pipe(1600, 100, 120);
        add_pipe(1800, 150, 120);
        add_pipe(2000, 200, 120);
        add_pipe(2200, 250, 120);
        add_pipe(2400, 30, 100);
        add_pipe(2700, 300, 100);
        add_pipe(3000, 100, 80);
        add_pipe(3300, 250, 80);
        add_pipe(3600, 50, 60);
        var finish_line = new MySprite("assets/images/flappy/flappyend.png");
        finish_line.x = 3900;
        finish_line.velocity_x = pipe_speed;
        pipes.push(finish_line);
    }
    var pipe_piece = new Image();
    pipe_piece.onload = add_all_my_pipes;
    pipe_piece.src = "assets/images/flappy/flappypipe.png";
    function Do_a_Frame() {
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        bird.Do_Frame_Things();
        display_bar_running_along_bottom();
        switch (game_mode) {
            case "prestart": {
                display_intro_instructions();
                break;
            }
            case "running": {
                time_game_last_running = new Date();
                bottom_bar_offset = bottom_bar_offset + pipe_speed;
                show_the_pipes();
                make_bird_tilt_appropriately();
                make_bird_slow_and_fall();
                check_for_end_game();
                break;
            }
            case "over": {
                make_bird_slow_and_fall();
                display_game_over();
                break;
            }
            case "exit": {
                // stop loop
                if (flappyInterval) { clearInterval(flappyInterval); flappyInterval = null; }

                // stop inputs
                detachFlappyListeners();

                // clear canvas (optional)
                ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

                // hide the overlay/container
                container.style.display = "none";

                // bail out of this frame
                return;
            }
        }
    }
    var bottom_bar = new Image();
    bottom_bar.src = "assets/images/flappy/flappybottom.png";

    var bird = new MySprite("assets/images/flappy/flappybird.png");
    bird.x = myCanvas.width / 3;
    bird.y = myCanvas.height / 2;

    flappyInterval = setInterval(Do_a_Frame, 1000 / FPS);
}