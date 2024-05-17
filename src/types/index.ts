export interface ApiResponse {
    data: []
}

export interface Room {
  id: string
  name: string
  map: Map
  mode: GameMode
  players: Player[]
  ping: number
}

export interface Map {
    id: number
    name: string
    image: string
}

export interface GameMode {
    id: number
    name: string
    image: string
}

export interface Skin {
  id: number
  name: string
  img?: string
}

export interface Player {
    id: string
    username: string
    email: string
    level: number
    highscore: number
    played: number
    won: number
    killed: number
    skins: Skin[]

}

export interface IngamePlayer {
    id: string
    ghosted: false,
    invisible: false,
    data: Array<{ x: number; y: number }>
}

export interface Keybinds {
    left: string
    right: string
    up: string
    down: string
}

export interface Settings {
    keybinds: {}
    volume: string
    darkMode: boolean
}

export interface Character {
    id: number
    name: string
    attributes: Attributes
    imgUrl: string
    // skin: Skin
}

export interface Attributes {
    speed: number
    startLength: number
    lives: number
}

export interface PowerUp {
    id: number
    name: string
    x: number
    y: number
    // image: string
    //color verplaatst tijdelijk een image
    // color: string
}


