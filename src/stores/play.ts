import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { onKeyStroke, useUrlSearchParams } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import type { Character, PowerUp, IngamePlayer } from '@/types'
import { useCharStore } from './char'
import { useRouter } from 'vue-router'
import { usePowerUpStore } from './powerups'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

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

    //gamemode bijhouden
    const gameMode = ref<string>('walls')

  // instellingen opslaan
  const settingsStore = useSettingsStore()
  const charStore = useCharStore()
  //const powerStore = usePowerUpStore()
  const { keybinds, volume } = storeToRefs(settingsStore)

  const numRows = 20 // Aantal rijen
  const numCols = 20 // Aantal kolommen

  const players = ref<IngamePlayer[]>([])

  const gameGrid = ref<Array<Array<string>>>([]) // Speelveld data

  const snake = ref<Array<{ x: number; y: number }>>([]) // Lichaam van de slang
  const enemySnake = ref<Array<{ x: number; y: number }>>([]) // Lichamen van de enemy slangen
  const food = ref<{ x: number; y: number }>({ x: 10, y: 10 })
  const direction = ref('right') //richting van de slang
  const score = ref(0)
  const gameOver = ref(false)
  const powerUpAvailable = ref<boolean>(false)
  const interval = ref<number>(10)
  const character = ref<Character>()
  const ghosted = ref<boolean>(false)
  const invisible = ref<boolean>(false)
  const enemyGhosted = ref<boolean>(false)
  const enemyInvisible = ref<boolean>(false)

  //X en Y bepalen van de nog niet vastgestelde powerup
  const powerUpX = ref<number>(0)
  const powerUpY = ref<number>(0)

  //const PowerUp 
  const powerUp = ref<PowerUp>({ id: 1, name: 'speedboost', x: 0, y: 0 })
  //init game intervals
  let gameLoopInterval = setInterval(() => {})
  let socketInterval = setInterval(() => {})
  let powerUpTimeOut = setInterval(() => {})

  //kijkt of richting al veranderd is in interval
  const directionChanged = ref<boolean>(false)

  const params = useUrlSearchParams('history')

  //obstakels toevoegen
  const obstacles = ref<Array<{ x: number; y: number }>>([])

  function addObstacle(x: number, y: number) {
    obstacles.value.push({ x, y })
  }
  function initializeSocket(s: Socket) {
    socket = s
  }

  // initialiseren
  function initializeGame() {
    players.value = JSON.parse(sessionStorage.getItem('players')!)
    console.log(players.value)
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
    let startX = Math.floor(numCols / 2)
    let startY = Math.floor(numRows / 2)

    console.log('generate walls')
    generateWalls()

    if (players.value.length >= 2) {
      for (let i = 0; i < players.value.length; i++) {
        if (players.value[i].id === params.playerId) {
          startX = Math.floor(numCols / (2 + players.value.length * i))
          startY = Math.floor(numRows / 2)
        }
      }
    }

    snake.value = [{ x: startX, y: startY }]

    for (let i = 1; i < character.value.attributes.startLength; i++) {
      snake.value.push({ x: startX, y: startY + i })
    }
  }

  //eindigt de game
  const endGame = () => {
    clearInterval(gameLoopInterval)
    clearInterval(socketInterval)
    // Toon een game over bericht of handel het einde van het spel af
    // Pause game music
    gameMusic.value.pause()

    // Play end game sound
    endGameSound.value.currentTime = 0
    endGameSound.value.play().catch(() => {
      console.error('Something went wrong')
    })

    /*alert('game over!')
    restartGame()*/
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

    socket?.emit('generateFood', foodX, foodY)
  }

  function generateWalls(){
    if(gameMode.value === 'walls'){
      // Add some obstacles
      const numObstacles = Math.max(15, Math.floor(Math.random() * 6) + 1); // Random number of obstacles between 1 and 6, but at least 15
      for (let i = 0; i < numObstacles; i++) {
        const obstacleX = Math.floor(Math.random() * numCols);
        const obstacleY = Math.floor(Math.random() * numRows);
        addObstacle(obstacleX, obstacleY);
      }
    }
  }

  //logica van speedboost powerUp
  const speedBoost = function () {
    console.log('speed boost')
    clearInterval(gameLoopInterval)
    gameLoopInterval = setInterval(
      () => {
        if (!gameOver.value) {
          directionChanged.value = false
          checkCollisions()
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
            checkCollisions()
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

  //logica van de magnet powerup
  const magnetApple = function() {
    console.log('magnet apple')

    const isAppleNearby = () => {
      const head = snake.value[0]
      const distanceX = Math.abs(head.x - food.value.x)
      const distanceY = Math.abs(head.y - food.value.y)

      //kijkt naar afstand tussen snake head en food
      return distanceX <= 1 && distanceY <= 1
    }

    const eatApple = () => {
      if (isAppleNearby()) {
        score.value++
        generateFood()
      }
    }

    // Use setInterval to check regularly
    const intervalId = setInterval(() => {
      if (!gameOver.value) {
        eatApple()
      } else {
        clearInterval(intervalId)
      }
    }, 200)

    // Stop the interval after 30 seconds
    setTimeout(() => {
      clearInterval(intervalId)
    }, 30000)
  }
  

  const ghost = function () {
    console.log('player ' + params.playerId + ' ghosted')

    socket?.emit('activateGhost', params.playerId)
    setTimeout(() => {
      console.log('ghost over')
      socket?.emit('deactivateGhost', params.playerId)
    }, 10000)
  }

  //const invisibility = function () {}

  function generatePowerUp() {
    socket?.emit('setPowerUpAvailability', true)  
    // Random positie genereren
    do {
      powerUpX.value = Math.floor(Math.random() * numCols)
      powerUpY.value = Math.floor(Math.random() * numRows)
    } while (gameGrid.value[powerUpY.value][powerUpX.value] !== 'empty')

    // Random power up genereren
    const random = Math.floor(Math.random() * 4) + 1 // Adjust if more power-ups are added
    console.log('random ' + random)
  
    switch (random) {
      case 1:
        powerUp.value = { id: 1, name: 'swiftness', x: powerUpX.value, y: powerUpY.value }
        break
      case 2:
        powerUp.value = { id: 2, name: 'ghost', x: powerUpX.value, y: powerUpY.value }
        break
      case 3:
        powerUp.value = { id: 3, name: 'invisibility', x: powerUpX.value, y: powerUpY.value }
        break
      case 4: // Add this case
        powerUp.value = { id: 4, name: 'magnet', x: powerUpX.value, y: powerUpY.value }
        break
    }

    socket?.emit('generatePowerUp', powerUpX.value, powerUpY.value)
  }
  
  function pickupPowerUp() {
    socket?.emit('setPowerUpAvailability', false)

    switch (powerUp.value.id) {
      case 1:
        speedBoost()
        break
      case 2:
        ghost()
        break
      case 3:
        speedBoost()
        break
      case 4:
        magnetApple()
        break
    }
  }

  function moveEnemySnake() {
    players.value.forEach((e) => {
      if (e.id !== params.playerId) {
        e.data.forEach((segment) => {
          const { x, y } = segment
          gameGrid.value[y][x] = 'enemy'
          if (enemyGhosted.value) {
            gameGrid.value[y][x] = 'ghostedEnemy'
          }
        })
      }
    })
    // enemySnake.value.forEach((segment) => {
    //   const { x, y } = segment
    //   gameGrid.value[y][x] = 'enemy'
    //   if(enemyGhosted.value){
    //     gameGrid.value[y][x] = 'ghostedEnemy'

    //   }
    // })
  }

  const startInterval = () => {
    // console.log(socket)
    socketInterval = setInterval(() => {
      socket?.emit('sendPlayerData', snake.value, params.playerId)
      socket?.emit('getPlayerData')

      if (!gameOver.value) {
        updateGameGrid()
      } else {
        endGame()
      }
    }, 100)

    socket?.on('getData', (snake) => {
      if (params.playerId !== snake.id) {
        console.log('enemy snake moved!')
        console.log(snake)
        // enemySnake.value = snake.data

        players.value.forEach((e) => {
          if (e.id === snake.id) {
            e.data = snake.data
          }
        })
      }
    })

    // socket?.on('sendData', () => {
    //   console.log('player data sent')
    // })
  }

  // Start de game loop om de spelstatus bij te werken
  function startGameLoop() {
    startInterval()
    // Genereer eerste voedsel
    generateFood()

    //genereer powerUp
    powerUpTimeOut = setTimeout(() => {
      generatePowerUp()
    }, 5000)

    socket?.on('showFood', (foodX, foodY) => {
      food.value = { x: foodX, y: foodY }
    })

    socket?.on('showPowerUp', (powerX, powerY, random) => {
      switch (powerUp.value.id) {
        case 1:
          powerUp.value = { id: 1, name: 'speedboost', x: powerX, y: powerY }
          break
        case 2:
          powerUp.value = { id: 2, name: 'ghost', x: powerX, y: powerY }
          break
        case 3:
          powerUp.value = { id: 3, name: 'invisibility', x: powerX, y: powerY }
          break
        case 4:
          powerUp.value = { id: 4, name: 'magnet', x: powerX, y: powerY }
          break
      }    
    })

    socket?.on('setPowerUpAvailability', (bool) => {
      powerUpAvailable.value = bool
    })

    socket?.on('activateGhost', (id) => {
      if (id === params.playerId) {
        ghosted.value = true
      } else {
        //enemy spelers worden ghosted
        enemyGhosted.value = true
      }
    })

    socket?.on('deactivateGhost', (id) => {
      if (id === params.playerId) {
        ghosted.value = false
      } else {
        enemyGhosted.value = false
      }
    })

    gameLoopInterval = setInterval(
      () => {
        if (!gameOver.value) {
          directionChanged.value = false
          checkCollisions()
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

    if (newHead.x === powerUpX.value && newHead.y === powerUpY.value && powerUpAvailable.value) {
      socket?.emit('setPowerUpAvailability', false)
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

    //controleer op botsing met obstacles
    obstacles.value.forEach((obstacle) => {
      if (head.x === obstacle.x && head.y === obstacle.y) {
        gameOver.value = true
        return
      }
    })

    //controleer op botsing met obstacles
    obstacles.value.forEach((obstacle) => {
      if (head.x === obstacle.x && head.y === obstacle.y) {
        gameOver.value = true
        return
      }
    })

    if (!ghosted.value) {
      // Controleer botsingen met zichzelf

      for (let i = 1; i < snake.value.length; i++) {
        if (head.x === snake.value[i].x && head.y === snake.value[i].y) {
          gameOver.value = true
          return
        }
      }

      // Controleer botsingen met andere snake

      players.value.forEach((e) => {
        if (e.id !== params.playerId) {
          for (let i = 1; i < e.data.length; i++) {
            if (head.x === e.data[i].x && head.y === e.data[i].y) {
              gameOver.value = true
              return
            }
          }
        }
      })

      // for (let i = 1; i < enemySnake.value.length; i++) {
      //   if (head.x === enemySnake.value[i].x && head.y === enemySnake.value[i].y) {
      //     gameOver.value = true
      //     return
      //   }
      // }

      // Controleer botsingen met andere snake head

      players.value.forEach((e) => {
        if (e.id !== params.playerId) {
          if (head.x == e.data[0].x && head.y == e.data[0].y) {
            gameOver.value = true
            return
          }
        }
      })
      // if (head.x == enemySnake.value[0].x && head.y == enemySnake.value[0].y) {
      //   gameOver.value = true
      //   return
      // }
    }
  }

  // Werk het speelveld bij op basis van de huidige status
  function updateGameGrid() {
    // Verwijder de vorige positie van de slang van het speelveld
    gameGrid.value.forEach((row, y) => {
      row.fill('empty')
    })

    if (powerUpAvailable.value) {
      switch (powerUp.value.id) {
        case 1:
          console.log('swiftness')
          gameGrid.value[powerUpY.value][powerUpX.value] = 'swiftness'
          break
        case 2:
          console.log('ghost')
          gameGrid.value[powerUpY.value][powerUpX.value] = 'ghost'
          break
        case 3:
          console.log('invisibility')
          gameGrid.value[powerUpY.value][powerUpX.value] = 'invisibility'
          break
        case 4: // Add this case
          console.log('magnet')
          gameGrid.value[powerUpY.value][powerUpX.value] = 'magnet'
          break
      }
    } else {
      gameGrid.value[powerUpY.value][powerUpX.value] = 'empty'
    }

    // Plaats de slangen op het speelveld
    snake.value.forEach((segment) => {
      if (segment === snake.value[0]) {
        const { x, y } = segment
        gameGrid.value[y][x] = 'snake-head'
      } else {
        const { x, y } = segment
        gameGrid.value[y][x] = 'snake'
      }
      if (ghosted.value) {
        gameGrid.value[y][x] = 'ghostedSnake'
      }
    })

    moveEnemySnake()

    // Plaats het voedsel op het speelveld
    const { x, y } = food.value
    gameGrid.value[y][x] = 'food'

    obstacles.value.forEach((obstacle) => {
      const { x, y } = obstacle
      gameGrid.value[y][x] = 'obstacles'
    })
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
    leaveGame,
    initializeSocket
  }
})
