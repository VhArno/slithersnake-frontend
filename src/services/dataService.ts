import type { AxiosResponse } from 'axios'
import { authAxios, myAxios } from '../instances/myAxios'
import type { RegisterPayload } from '@/types'

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

// Users
const getCsrfCookie = async <T>(): Promise<AxiosResponse<T>> => {
    return authAxios.get<T>('/sanctum/csrf-cookie', {baseURL: import.meta.env.VITE_BASE_URL})
}

const postLogin = async <T>(payload: RegisterPayload): Promise<AxiosResponse<T>> => {
    return authAxios.post<T>(`/login`, {
        email: payload.email,
        password: payload.password
    })
}

const getUser = async <T>(): Promise<AxiosResponse<T>> => {
    return authAxios.get<T>(`/users`)
}

export { getMap, getMaps, getGamemode, getGamemodes, getSkins, getCsrfCookie, postLogin, getUser }
