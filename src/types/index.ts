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
    img?: string
}

export interface GameMode {
    id: number
    name: string
    img?: string
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
}

export interface Keybinds {
    left: string
    right: string
    up: string
    down: string
}