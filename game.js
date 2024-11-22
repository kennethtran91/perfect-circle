document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const gameScreen = document.getElementById("game-screen");
  const resultScreen = document.getElementById("result-screen");
  const startButton = document.getElementById("start-button");
  const resetButton = document.getElementById("reset-button");
  const canvas = document.getElementById("drawing-canvas");
  const liveScoreDisplay = document.getElementById("live-score");
  const finalScoreDisplay = document.getElementById("final-score");
  const ctx = canvas.getContext("2d");

  let isDrawing = false;
  let isLocked = false; // Lock state

  let points = [];
  let centerX, centerY; // Center coordinates of the canvas

  // Adjust canvas size and dynamically calculate center
  function resizeCanvas() {
      const ratio = 4 / 3; // Maintain aspect ratio (800x600)
      const width = Math.min(window.innerWidth * 0.9, 800);
      const height = width / ratio;

      canvas.width = width;
      canvas.height = height;

      centerX = canvas.width / 2;
      centerY = canvas.height / 2;

      clearCanvas();
      drawCenterPoint();
  }

  function switchScreen(showScreen) {
      [welcomeScreen, gameScreen, resultScreen].forEach((screen) => {
          screen.classList.remove("active");
      });
      showScreen.classList.add("active");
  }

  function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      points = [];
      liveScoreDisplay.textContent = "0";
  }

  function drawCenterPoint() {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
  }

  function calculateScore() {
      if (points.length === 0) return 0;

      const distances = points.map(
          ([x, y]) => Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      );
      const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
      const deviations = distances.map((d) => Math.abs(d - avgDistance));
      const avgDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;

      return Math.max(0, Math.round(100 - avgDeviation));
  }

  function drawPerfectCircle() {
      if (points.length === 0) return;

      // Calculate the average radius
      const distances = points.map(
          ([x, y]) => Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      );
      const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;

      // Draw the perfect circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, avgRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#87DF2C";
      ctx.lineWidth = 2;
      ctx.stroke();
  }

  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseleave", stopDrawing);

  canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
  canvas.addEventListener("touchmove", (e) => draw(e.touches[0]));
  canvas.addEventListener("touchend", stopDrawing);

  function startDrawing(e) {
      isDrawing = true;
      points = [];
      ctx.beginPath();

      const { x, y } = getCanvasCoordinates(e);
      ctx.moveTo(x, y);
      points.push([x, y]);
  }

  function draw(e) {
      if (!isDrawing) return;

      const { x, y } = getCanvasCoordinates(e);
      ctx.lineTo(x, y);
      ctx.stroke();
      points.push([x, y]);

      liveScoreDisplay.textContent = calculateScore();
  }

  function stopDrawing() {
      if (!isDrawing) return;

      isDrawing = false;
      drawPerfectCircle();

      finalScoreDisplay.textContent = calculateScore();
      setTimeout(() => switchScreen(resultScreen), 2000);
  }

  function getCanvasCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
      };
  }

  startButton.addEventListener("click", () => {
      resizeCanvas();
      switchScreen(gameScreen);
      clearCanvas();
      drawCenterPoint();
  });

  resetButton.addEventListener("click", () => {
      switchScreen(welcomeScreen);
      clearCanvas();
  });

  resizeCanvas(); // Initial canvas resize
  switchScreen(welcomeScreen);

  // Prevent scrolling during touch events on canvas
  canvas.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  canvas.addEventListener("touchstart", (e) => e.preventDefault(), { passive: false });
  canvas.addEventListener("touchend", (e) => e.preventDefault(), { passive: false });
});
