const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("scoreDisplay");

let isDrawing = false;
let path = [];

// Handle touch events
canvas.addEventListener("touchstart", (event) => {
  isDrawing = true;
  path = [];
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  path.push({ x, y });
  updateScoreDisplay(0); // Reset score display
});

canvas.addEventListener("touchmove", (event) => {
  if (!isDrawing) return;
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  path.push({ x, y });
  drawPath(path);
});

canvas.addEventListener("touchend", () => {
  isDrawing = false;
  analyzePath(path);
});

// Draw the path on the canvas
function drawPath(path) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  path.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  ctx.strokeStyle = "#0077ff";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Analyze the path and calculate the score
function analyzePath(path) {
  if (path.length < 10) {
    alert("Draw a complete circle to get a score!");
    return;
  }

  const center = calculateCentroid(path);
  const distances = path.map((p) => distance(p, center));
  const avgRadius = distances.reduce((a, b) => a + b, 0) / distances.length;

  const perfectCircleError =
    distances.reduce((error, d) => error + Math.abs(d - avgRadius), 0) /
    distances.length;

  // Score is inversely proportional to the error
  const score = Math.max(0, 100 - perfectCircleError * 20);

  // Draw the ideal circle
  ctx.beginPath();
  ctx.arc(center.x, center.y, avgRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Update the score display
  scoreDisplay.textContent = `Score: ${Math.round(score)}%`;
}

// Calculate the centroid (center point) of the path
function calculateCentroid(path) {
  const x = path.reduce((sum, p) => sum + p.x, 0) / path.length;
  const y = path.reduce((sum, p) => sum + p.y, 0) / path.length;
  return { x, y };
}

// Calculate the distance between two points
function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// Update the score display
function updateScoreDisplay(score) {
  scoreDisplay.textContent = `Score: ${Math.round(score)}%`;
}

// Restart the game
restartButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  path = [];
  updateScoreDisplay(0);
});
