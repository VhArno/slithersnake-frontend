<template>
  <div id="app" @keydown="handleKeydown" tabindex="0">
    <div
      :style="{ width: gridSize * numCols + 'px', height: gridSize * numRows + 'px' }"
      ref="gameBoard"
    >
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="row"
        :style="{ height: gridSize + 'px' }"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{ snake: isSnake(cell), food: isFood(cell) }"
          :style="{ width: gridSize + 'px', height: gridSize + 'px' }"
        ></div>
      </div>
    </div>
    <p v-if="!gameRunning">Game Over! Press R to restart.</p>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      numRows: 20,
      numCols: 20,
      gridSize: 20,
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      direction: 'right',
      gameInterval: null,
      gameRunning: true,
    };
  },
  computed: {
    grid() {
      const grid = [];
      for (let row = 0; row < this.numRows; row++) {
        const rowArray = [];
        for (let col = 0; col < this.numCols; col++) {
          rowArray.push({ x: col, y: row });
        }
        grid.push(rowArray);
      }
      return grid;
    },
  },
  mounted() {
    this.startGame();
  },
  methods: {
    startGame() {
      this.gameInterval = setInterval(this.gameLoop, 100);
      this.$refs.gameBoard.focus();
    },
    stopGame() {
      clearInterval(this.gameInterval);
      this.gameRunning = false;
    },
    gameLoop() {
      if (!this.gameRunning) return;
      this.moveSnake();
      this.checkCollision();
      this.checkFood();
    },
    moveSnake() {
      const head = { ...this.snake[0] };
      switch (this.direction) {
        case 'up':
          head.y--;
          break;
        case 'down':
          head.y++;
          break;
        case 'left':
          head.x--;
          break;
        case 'right':
          head.x++;
          break;
      }
      this.snake.unshift(head);
      if (!(head.x === this.food.x && head.y === this.food.y)) {
        this.snake.pop();
      } else {
        this.generateFood();
      }
    },
    generateFood() {
      this.food.x = Math.floor(Math.random() * this.numCols);
      this.food.y = Math.floor(Math.random() * this.numRows);
    },
    checkCollision() {
      const head = this.snake[0];
      // Check collision with walls
      if (
        head.x < 0 ||
        head.x >= this.numCols ||
        head.y < 0 ||
        head.y >= this.numRows
      ) {
        this.stopGame();
      }
      // Check collision with itself
      for (let i = 1; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          this.stopGame();
          break;
        }
      }
    },
    checkFood() {
      if (this.snake[0].x === this.food.x && this.snake[0].y === this.food.y) {
        this.generateFood();
      }
    },
    isSnake(cell) {
      return this.snake.some(
        (segment) => segment.x === cell.x && segment.y === cell.y
      );
    },
    isFood(cell) {
      return cell.x === this.food.x && cell.y === this.food.y;
    },
    handleKeydown(event) {
      if (!this.gameRunning) return;
      switch (event.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') this.direction = 'up';
          break;
        case 'ArrowDown':
          if (this.direction !== 'up') this.direction = 'down';
          break;
        case 'ArrowLeft':
          if (this.direction !== 'right') this.direction = 'left';
          break;
        case 'ArrowRight':
          if (this.direction !== 'left') this.direction = 'right';
          break;
        case 'r':
          this.restartGame();
          break;
      }
    },
    restartGame() {
      this.snake = [{ x: 10, y: 10 }];
      this.direction = 'right';
      this.food = { x: 5, y: 5 };
      this.gameRunning = true;
    },
  },
};
</script>

<style scoped>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.row {
  display: flex;
}

.cell {
  border: 1px solid #ccc;
}

.snake {
  background-color: green;
}

.food {
  background-color: red;
}

p {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: red;
}
</style>
