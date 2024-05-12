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
  imgHead: string
  imgBody: string
}

export interface Player {
    id: number
    username: string
    email: string
    level: number
    highscore: number
    games_played: number
    games_won: number
    players_killed: number
    skins: Skin[]
    role: string
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

export interface RegisterPayload {
    username: string,
    email: string,
    password: string,
    passwordRepeat?: string
}
