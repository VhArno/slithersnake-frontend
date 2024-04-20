import { defineStore } from 'pinia'
import { ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import type { Character } from '@/types'
import { useCharStore } from './char'

export const usePlayStore = defineStore('play', () => {
  // instellingen opslaan
  const settingsStore = useSettingsStore()
  const charStore = useCharStore()
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
  const interval = ref<number>(5)
  const character = ref<Character>()

  //kijkt of richting al veranderd is in interval
  const directionChanged = ref<boolean>(false)

  // initialiseren
  function initializeGame() {
    //Sla de geselecteerde character op
    character.value = charStore.selectedCharacter
    interval.value =character.value.attributes.speed
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

    for(let i = 1; i < character.value.attributes.startLength; i++){
      snake.value.push({ x: startX, y: startY + i })
    }

    // Plaats food
    generateFood()
  }
  //eindigt de game
  const endGame = () => {
    clearInterval(gameLoopInterval)
    // Toon een game over bericht of handel het einde van het spel af
    alert('game over!')
    restartGame()
  }

  //herstart de game
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
        directionChanged.value = false
        moveSnake()
        checkCollisions()
        if (!gameOver.value) {
          updateGameGrid()
        }
      } else {
        endGame()
      }
    }, 1000 / (interval.value * 2)) // Pas de snelheid aan door de intervaltijd te veranderen
  }

  // Lees toetsenbordinvoer
  onKeyStroke(keybinds.value.down, () => {
    //zorgt ervoor dat je niet kan verwisselen naar de tegenovergestelde richting
    if(!directionChanged.value){
    if (direction.value === 'up') {
      return
    } else {
      direction.value = 'down'
      directionChanged.value = true
    }
  }
  })
  onKeyStroke(keybinds.value.up, () => {
    if(!directionChanged.value){
    if (direction.value === 'down') {
      return
    } else {
      direction.value = 'up'
      directionChanged.value = true
    }
  }
  })
  onKeyStroke(keybinds.value.left, () => {
    if(!directionChanged.value){
    if (direction.value === 'right') {
      return
    } else {
      direction.value = 'left'
      directionChanged.value = true

    }
  }
  })
  onKeyStroke(keybinds.value.right, () => {
    if(!directionChanged.value){
    if (direction.value === 'left') {
      return
    } else {
      direction.value = 'right'
      directionChanged.value = true

    }
  }
  })

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
