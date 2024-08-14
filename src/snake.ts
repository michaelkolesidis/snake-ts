import './style.css';
import { Snake } from './types';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const context = canvas.getContext('2d');

const grid = 16;
let count = 0;

const snake: Snake = {
  x: 160,
  y: 160,

  // Snake velocity. Moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // Keep track of all grids the snake body occupies
  cells: [],

  // Length of the snake. grows when eating an apple
  maxCells: 4,
};
const apple = {
  x: 320,
  y: 320,
};

// Get random whole numbers in a specific range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Game loop
const loop = () => {
  requestAnimationFrame(loop);

  if (context == null) {
    throw new Error('Failed to get context');
  }

  // Slow game loop to 6 fps instead of 60 (60/6 = 10)
  if (++count < 10) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  // Wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // Wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // Keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // Remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = '#1c2605';

  // Draw apple
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Draw snake one cell at a time
  snake.cells.forEach((cell, index) => {
    // Drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // Canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // Check collision with all cells after this one (modified bubble sort)
    for (let i = index + 1; i < snake.cells.length; i++) {
      // Snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
};

// Listen to keyboard events to move the snake
document.addEventListener('keydown', (e) => {
  // Prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  //Movement
  // Left
  if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // Up
  else if ((e.code === 'ArrowUp' || e.code === 'KeyW') && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // Right
  else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // Down
  else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Start the game loop
requestAnimationFrame(loop);
