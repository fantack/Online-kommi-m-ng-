const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let player = { x: 50, y: 50, color: 'darkgreen', name: 'Player', score: 0, level: 1 };
let players = []; // Kõik mängijad, sealhulgas sina
let candies = [];
const gridSize = 50;
const playerSpeed = 12.5;  // 4 korda aeglasem kiirus
let keys = {};
const candyImage = new Image();
candyImage.src = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com%2Fimage%2F30bf7e8125aa60a.png&f=1&nofb=1&ipt=e1c0fdfc91c81f36166c4c3ab4d5b4dd62c05c9c4f2375a40aaae3cbe2d0af52&ipo=images";

// Suurem mängu maailm
canvas.width = 1200;
canvas.height = 800;

// Start button click handler
document.getElementById('startButton').addEventListener('click', () => {
  player.name = document.getElementById('playerName').value;
  player.color = document.getElementById('color').value;
  players.push(player);  // Lisa mängija mängijate nimekirja
  document.getElementById('controls').style.display = 'none';
  requestAnimationFrame(gameLoop);
});

// Mobile controls
document.getElementById('up').addEventListener('click', () => { movePlayer(0, -playerSpeed); });
document.getElementById('left').addEventListener('click', () => { movePlayer(-playerSpeed, 0); });
document.getElementById('down').addEventListener('click', () => { movePlayer(0, playerSpeed); });
document.getElementById('right').addEventListener('click', () => { movePlayer(playerSpeed, 0); });

window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  if (keys['w']) movePlayer(0, -playerSpeed);
  if (keys['a']) movePlayer(-playerSpeed, 0);
  if (keys['s']) movePlayer(0, playerSpeed);
  if (keys['d']) movePlayer(playerSpeed, 0);

  // Kontrolli, kas maailmas on alla 10 kommi, ja lisa neid vastavalt 10-40 sekundi intervallile
  if (candies.length < 10 && Math.random() < 0.003) {
    let numberOfCandies = Math.random() < 0.1 ? 4 : Math.floor(Math.random() * 3) + 1; // 10% tõenäosusega lisab 4 kommi, muidu 1-3 kommi
    for (let i = 0; i < numberOfCandies && candies.length < 10; i++) {
      let candyX, candyY;
      do {
        candyX = Math.floor(Math.random() * canvas.width / gridSize) * gridSize;
        candyY = Math.floor(Math.random() * canvas.height / gridSize) * gridSize;
      } while (candies.some(candy => candy.x === candyX && candy.y === candyY)); // Väldi kommide kattumist
      candies.push({ x: candyX, y: candyY });
    }
  }

  // Check if player collects a candy
  candies = candies.filter(candy => {
    if (distance(player.x, player.y, candy.x, candy.y) < gridSize) {
      player.score++;
      // Tõsta mängija level iga 10 punkti järel
      if (player.score % 10 === 0 && player.level < 128) {
        player.level++;
      }
      return false;
    }
    return true;
  });
}

// Draw everything on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw candies
  candies.forEach(candy => {
    ctx.drawImage(candyImage, candy.x, candy.y, gridSize, gridSize);
  });

  // Draw all players, their names, and levels
  players.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, gridSize, gridSize);
    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';
    ctx.fillText(`${p.name} (Level: ${p.level})`, p.x, p.y - 10);
  });

  // Draw player's score and level
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Name: ${player.name}`, 10, 20);
  ctx.fillText(`Score: ${player.score}`, 10, 50);
  ctx.fillText(`Level: ${player.level}`, 10, 80);
}

// Move player by dx, dy
function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;

  // Check boundaries
  if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
    player.x = newX;
    player.y = newY;
  }
}

// Calculate distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

