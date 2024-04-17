import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

export const usePlayStore = defineStore('play', () => {
  // instellingen opslaan
  const settingsStore = useSettingsStore()
  const { keybinds } = storeToRefs(settingsStore)

  const numRows = 20 // Aantal rijen
  const numCols = 20 // Aantal kolommen

  const gameGrid = ref<Array<Array<string>>>([]) // Speelveld data
  const snake = ref<Array<{ x: number; y: number }>>([]) // Lichaam van de slang
  const food = ref<{ x: number; y: number }>({ x: 0, y: 0 }) // Positie van food
  const direction = ref('right') //richting van de slang
  const score = ref(0)
  const gameOver = ref(false)
  let gameLoopInterval = 0

  // initialiseren
  function initializeGame() {
    //in geval dat spel herbegint
    gameOver.value = false
    // Maak een leeg speelveld
    gameGrid.value = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => 'empty')
    )

    // spawn slang
    const startX = Math.floor(numCols / 2)
    const startY = Math.floor(numRows / 2)
    snake.value = [{ x: startX, y: startY }]

    // Plaats food
    generateFood()
  }

  const endGame = () => {
    clearInterval(gameLoopInterval)
    // Toon een game over bericht of handel het einde van het spel af
    alert('game over!')
    restartGame()
  }

  const restartGame = () => {
    initializeGame()
    startGameLoop()
  }

  // Genereer een nieuwe positie voor het voedsel op het speelveld
  function generateFood() {
    let foodX, foodY
    do {
      foodX = Math.floor(Math.random() * numCols)
      foodY = Math.floor(Math.random() * numRows)
    } while (gameGrid.value[foodY][foodX] !== 'empty')

    food.value = { x: foodX, y: foodY }
  }

  // Start de game loop om de spelstatus bij te werken
  function startGameLoop() {
    gameLoopInterval = setInterval(() => {
      if (!gameOver.value) {
        moveSnake()
        checkCollisions()
        if (!gameOver.value) {
          updateGameGrid()
        }
      } else {
        endGame()
      }
    }, 1000 / 5) // Pas de snelheid aan door de intervaltijd te veranderen
  }

  // Lees toetsenbordinvoer
  onKeyStroke(keybinds.value.down, () => (direction.value = 'down'))
  onKeyStroke(keybinds.value.up, () => (direction.value = 'up'))
  onKeyStroke(keybinds.value.left, () => (direction.value = 'left'))
  onKeyStroke(keybinds.value.right, () => (direction.value = 'right'))

  // Beweeg de slang
  function moveSnake() {
    const head = snake.value[0]
    let newHead: { x: number; y: number }

    // Bepaal de nieuwe positie op basis van de richting
    switch (direction.value) {
      case 'up':
        newHead = { x: head.x, y: head.y - 1 }
        console.log('omhoog')
        break
      case 'down':
        newHead = { x: head.x, y: head.y + 1 }
        console.log('omlaag')
        break
      case 'left':
        newHead = { x: head.x - 1, y: head.y }
        console.log('links')
        break
      case 'right':
        newHead = { x: head.x + 1, y: head.y }
        console.log('rechts')
        break
      default:
        return
    }

    // Plaats de nieuwe kop van de slang
    snake.value.unshift(newHead)

    if (newHead.x === food.value.x && newHead.y === food.value.y) {
      score.value++
      generateFood() // Genereer nieuw voedsel
    } else {
      snake.value.pop() // Verwijder het einde van de slang
    }
  }

  function checkCollisions() {
    const head = snake.value[0]

    // Controleer botsingen met de randen van het speelveld
    if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
      gameOver.value = true
      return
    }

    // Controleer botsingen met zichzelf
    for (let i = 1; i < snake.value.length; i++) {
      if (head.x === snake.value[i].x && head.y === snake.value[i].y) {
        gameOver.value = true
        return
      }
    }
  }

  // Werk het speelveld bij op basis van de huidige status
  function updateGameGrid() {
    // Verwijder de vorige positie van de slang van het speelveld
    gameGrid.value.forEach((row, y) => {
      row.fill('empty')
    })

    // Plaats de slang op het speelveld
    snake.value.forEach((segment) => {
      const { x, y } = segment
      gameGrid.value[y][x] = 'snake'
    })

    // Plaats het voedsel op het speelveld
    const { x, y } = food.value
    gameGrid.value[y][x] = 'food'
  }

  return {
    keybinds,
    numRows,
    numCols,
    gameGrid,
    snake,
    food,
    direction,
    score,
    gameOver,
    initializeGame,
    startGameLoop,
    moveSnake,
    checkCollisions,
    updateGameGrid
  }
})
