let gameActive = false;

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

    // Hamburger button toggle
    const navToggle = document.getElementById("navToggle");
    const navOverlay = document.getElementById("navOverlay");

    navToggle.addEventListener("click", () => {
        navOverlay.classList.toggle("show");
    });

    // Swipe Close
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    });

    navOverlay.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navOverlay.classList.remove("show");
        });
    });

    // Fixed scroll issue with nav bar and hall of section
    const hallOfFame = document.querySelector('.hall-of-fame');
    hallOfFame.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, { passive: true });

    hallOfFame.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });

    // Rocket Easter Egg
    const rocket = document.querySelector(".rocket");
    const popup = document.getElementById("easterEggPopup");
    const closePopup = document.getElementById("closePopup");
    let launchCount = 0;

    rocket?.addEventListener("click", () => {
        launchCount++;
        gsap.fromTo(
            rocket,
            { x: 0, y: 0, opacity: 1, rotation: 0 },
            {
                x: window.innerWidth,
                y: -window.innerHeight,
                rotation: 45,
                opacity: 0,
                duration: 2,
                ease: "power1.inOut",
                onComplete: () => {
                    gsap.set(rocket, { x: 0, y: 0, opacity: 1, rotation: 0 });
                }
            }
        );
        if (launchCount === 1) console.log("🚀 Keep clicking, Big Brain XD...");
        if (launchCount === 2) console.log("🌌 Almost there...");
        if (launchCount === 3) {
            popup.style.display = "flex";
            launchCount = 0;
        }
    });


    closePopup?.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Team Hell Week game
    let hellcount = 0
    const hellweek = document.getElementById("hell");
    hellweek.addEventListener('click', () => {
        hellcount++;
        if (hellcount === 1) console.log("🐍 Seriously Bruh, you think this is a game?");
        if (hellcount === 2) console.log("🕸️ finally a curious one hmm lets see ...");
        if (hellcount == 3) {
            console.log("🏴󠁩󠁳󠀱󠁿 Task 1: follow __naveen__.pyw")
            console.log("🏴󠁩󠁳󠀱󠁿 Task 2: follow https://github.com/GhostInHex-x86")
        }
        if (hellcount === 4) {
            const container = document.getElementById('snakeGameContainer');
            container.style.display = 'block';
            startSnakeGame();
            hellcount = 0;
        }
    });

    let logocount = 0
    const builderLogoWrapper = document.getElementById("builderlogo");
    builderLogoWrapper.addEventListener('click', () => {
        logocount++;
        if (logocount === 1) console.log("🔨 You like poking logos huh?");
        if (logocount === 2) console.log("👀 Careful... you might just break into something...");
        if (logocount === 3) {
            console.log("SUBSCRIBE: https://www.youtube.com/watch?v=xvFZjo5PgG0");
            logocount = 0;
        }
    });

    // AOS
    if (AOS) {
        AOS.init({ duration: 1000, once: true });
    }
});


// Guesture support for navigation overlay
function handleGesture(touchStartX, touchStartY, touchEndX, touchEndY) {
    if (gameActive) return;

    const swipeThreshold = 60;
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > swipeThreshold) {
            navOverlay.classList.add("show");
        } else if (dx < -swipeThreshold) {
            navOverlay.classList.remove("show");
        }
    }
}


function startSnakeGame() {
    gameActive = true;
    const playBoard = document.querySelector("#snakeGameContainer .play-board");
    const scoreElement = document.querySelector("#snakeGameContainer .score");
    const highScoreElement = document.querySelector("#snakeGameContainer .high-score");
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
        gameActive = false;
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

    // --- Mobile Swipe Support ---
    let touchStartX = 0, touchStartY = 0;
    const gameContainer = document.getElementById("snakeGameContainer");
    gameContainer.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        e.preventDefault();
    }, { passive: false });

    gameContainer.addEventListener("touchend", e => {
        let dx = e.changedTouches[0].screenX - touchStartX;
        let dy = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0) changeDirection({ key: "ArrowRight" });
            else changeDirection({ key: "ArrowLeft" });
        } else {
            // Vertical swipe
            if (dy > 0) changeDirection({ key: "ArrowDown" });
            else changeDirection({ key: "ArrowUp" });
        }
        e.preventDefault();
    }, { passive: false });
    // -------------------------------------


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