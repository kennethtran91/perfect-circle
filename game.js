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
  let points = [];
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  function switchScreen(showScreen) {
      [welcomeScreen, gameScreen, resultScreen].forEach((screen) => {
          screen.style.display = "none";
      });
      showScreen.style.display = "flex";
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

      // Score inversely proportional to deviation (scaled for better visualization)
      return Math.max(0, Math.round(100 - avgDeviation));
  }

  function updateLiveScore() {
      const score = calculateScore();
      liveScoreDisplay.textContent = score;
  }

  function drawPerfectCircle() {
      if (points.length === 0) return;
      const distances = points.map(
          ([x, y]) => Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      );
      const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;

      ctx.beginPath();
      ctx.arc(centerX, centerY, avgRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = "16px Arial";
      ctx.fillStyle = "blue";
      ctx.fillText("Perfect Circle", centerX - avgRadius - 10, centerY - avgRadius - 10);
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
      updateLiveScore();
  }

  function stopDrawing() {
      if (!isDrawing) return;
      isDrawing = false;

      // Automatically show perfect circle and score
      const score = calculateScore();
      drawPerfectCircle();
      setTimeout(() => {
          finalScoreDisplay.textContent = score;
          switchScreen(resultScreen);
      }, 2000); // Show for 2 seconds before switching to result screen
  }

  function getCanvasCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
      };
  }

  startButton.addEventListener("click", () => {
      switchScreen(gameScreen);
      clearCanvas();
      drawCenterPoint();
  });

  resetButton.addEventListener("click", () => {
      switchScreen(welcomeScreen);
      clearCanvas();
  });

  switchScreen(welcomeScreen);
});
