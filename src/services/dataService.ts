import type { AxiosResponse } from 'axios'
import { myAxios } from '../instances/myAxios'

// maps
const getMap = async <T>(id: number): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/map/${id}`)
}

const getMaps = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/maps`)
}

// gamemodes
const getGamemode = async <T>(id: number): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/gamemodes/${id}`)
}

const getGamemodes = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/gamemodes`)
}

// skins
const getSkins = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(`/skins`)
}

export { getMap, getMaps, getGamemode, getGamemodes, getSkins }
