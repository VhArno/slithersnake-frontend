import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import type { Character, PowerUp } from '@/types'
import { useCharStore } from './char'
import { useRouter } from 'vue-router'
import { usePowerUpStore } from './powerups'
import { io, Socket } from 'socket.io-client'

const socket: Socket = inject('socket') as Socket

export const usePlayStore = defineStore('play', () => {

  // Audios
  const gameMusic = ref()
  const pickupSound = ref()
  const endGameSound = ref()

  function setGameMusic(music: HTMLAudioElement) {
    gameMusic.value = music
  }

  function setPickupSound(sound: HTMLAudioElement) {
    pickupSound.value = sound
  }

  function setEndGameSound(sound: HTMLAudioElement) {
    endGameSound.value = sound
  }

  // instellingen opslaan
  const settingsStore = useSettingsStore()
  const charStore = useCharStore()
  const powerStore = usePowerUpStore()
  const { keybinds, volume } = storeToRefs(settingsStore)

  const numRows = 20 // Aantal rijen
  const numCols = 20 // Aantal kolommen

  const gameGrid = ref<Array<Array<string>>>([]) // Speelveld data

  const snake = ref<Array<{ x: number; y: number }>>([]) // Lichaam van de slang
  const food = ref<{ x: number; y: number }>({ x: 0, y: 0 })
  const powerUp = ref<PowerUp>({ id: 1, name: 'speedboost', x: 0, y: 0 })
  const direction = ref('right') //richting van de slang
  const score = ref(0)
  const gameOver = ref(false)
  let gameLoopInterval = 0
  let powerUpTimeOut = 0
  const powerUpAvailable = ref<boolean>(false)
  const interval = ref<number>(5)
  const character = ref<Character>()

  //kijkt of richting al veranderd is in interval
  const directionChanged = ref<boolean>(false)

  //obstakels toevoegen
  // Obstacles
  const obstacles = ref<Array<{ x: number; y: number }>>([])

  function addObstacle(x: number, y: number) {
    obstacles.value.push({ x, y })
  }

  // initialiseren
  function initializeGame() {
    //Sla de geselecteerde character op
    character.value = charStore.selectedCharacter
    interval.value = character.value.attributes.speed
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

    for (let i = 1; i < character.value.attributes.startLength; i++) {
      snake.value.push({ x: startX, y: startY + i })
    }

    // Plaats food
    generateFood()

    powerUpTimeOut = setTimeout(() => {
      generatePowerUp()
    }, 5000)
  }
  //eindigt de game
  const endGame = () => {
    clearInterval(gameLoopInterval)

    // Toon een game over bericht of handel het einde van het spel af
    // Pause game music
    gameMusic.value.pause()

    // Play end game sound
    endGameSound.value.currentTime = 0
    endGameSound.value.play().catch(() => {
      console.error('Something went wrong')
    })

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

  //logica van speedboost powerUpn
  const speedBoost = function () {
    console.log('speed boost')
    clearInterval(gameLoopInterval)
    gameLoopInterval = setInterval(
      () => {
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
      },
      1000 / (interval.value * 2)
    )

    setTimeout(() => {
      console.log('speed boost over')
      clearInterval(gameLoopInterval)
      gameLoopInterval = setInterval(
        () => {
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
        },
        2000 / (interval.value * 2)
      )
    }, 4000)
  }

  function generatePowerUp() {
    powerUpAvailable.value = true

    let powerX, powerY
    do {
      powerX = Math.floor(Math.random() * numCols)
      powerY = Math.floor(Math.random() * numRows)
    } while (gameGrid.value[powerY][powerX] !== 'empty')

    powerUp.value.x = powerX
    powerUp.value.y = powerY
  }

  function pickupPowerUp() {
    powerUpAvailable.value = false

    switch (powerUp.value.name) {
      case 'speedboost':
        speedBoost()
        break
    }
  }

  // Start de game loop om de spelstatus bij te werken
  function startGameLoop() {
    gameLoopInterval = setInterval(
      () => {
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
      },
      2000 / (interval.value * 2)
    ) // Pas de snelheid aan door de intervaltijd te veranderen
  }

  // Lees toetsenbordinvoer
  onKeyStroke(keybinds.value.down, () => {
    //zorgt ervoor dat je niet kan verwisselen naar de tegenovergestelde richting
    if (!directionChanged.value) {
      if (direction.value === 'up') {
        return
      } else {
        direction.value = 'down'
        directionChanged.value = true
      }
    }
  })
  onKeyStroke(keybinds.value.up, () => {
    if (!directionChanged.value) {
      if (direction.value === 'down') {
        return
      } else {
        direction.value = 'up'
        directionChanged.value = true
      }
    }
  })
  onKeyStroke(keybinds.value.left, () => {
    if (!directionChanged.value) {
      if (direction.value === 'right') {
        return
      } else {
        direction.value = 'left'
        directionChanged.value = true
      }
    }
  })
  onKeyStroke(keybinds.value.right, () => {
    if (!directionChanged.value) {
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
        break
      case 'down':
        newHead = { x: head.x, y: head.y + 1 }
        break
      case 'left':
        newHead = { x: head.x - 1, y: head.y }
        break
      case 'right':
        newHead = { x: head.x + 1, y: head.y }
        break
      default:
        return
    }

    // Plaats de nieuwe kop van de slang
    snake.value.unshift(newHead)

    if (newHead.x === food.value.x && newHead.y === food.value.y) {
      score.value++

      // Play pick up sound
      pickupSound.value.currentTime = 0
      pickupSound.value.play().catch(() => {
        console.error('Something went wrong')
      })

      generateFood() // Genereer nieuw voedsel
    } else {
      snake.value.pop() // Verwijder het einde van de slang
    }

    if (newHead.x === powerUp.value.x && newHead.y === powerUp.value.y && powerUpAvailable.value) {
      powerUpAvailable.value = false
      //genereer een nieuwe powerUp na aantal seconden
      console.log('power up picked up')
      pickupPowerUp()
      powerUpTimeOut = setTimeout(() => {
        generatePowerUp()
      }, 20000)
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

    //coordinaten van powerUp
    const xP = powerUp.value.x
    const yP = powerUp.value.y

    if (powerUpAvailable.value) {
      gameGrid.value[yP][xP] = 'powerUp'
    } else {
      gameGrid.value[yP][xP] = 'empty'
    }

    // Plaats de slang op het speelveld
    snake.value.forEach((segment) => {
      const { x, y } = segment
      gameGrid.value[y][x] = 'snake'
    })

    // Plaats het voedsel op het speelveld
    const { x, y } = food.value
    gameGrid.value[y][x] = 'food'
  }

  const router = useRouter()

  const leaveGame = () => {
    router.push('/')
  }

  return {
    setGameMusic,
    setPickupSound,
    setEndGameSound,
    keybinds,
    numRows,
    numCols,
    gameGrid,
    snake,
    food,
    direction,
    score,
    gameOver,
    volume,
    initializeGame,
    startGameLoop,
    moveSnake,
    checkCollisions,
    updateGameGrid,
    leaveGame
  }
})
