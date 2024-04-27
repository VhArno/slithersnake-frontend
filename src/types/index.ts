export interface ApiResponse {
    data: []
}

export interface Room {
    id: string
    name: string
    map: Map
    mode: GameMode
    players: []
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
    id: number
    username: string
    email: string
    level: number
    highscore: number
    played: number
    won: number
    killed: number
    skins: Skin[]
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

