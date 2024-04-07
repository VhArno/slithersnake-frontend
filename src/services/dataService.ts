import type { AxiosResponse } from 'axios'
import { myAxios } from '../instances/myAxios'

const getMaps = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(``)
}

const getGamemodes = async <T>(): Promise<AxiosResponse<T>> => {
    return myAxios.get<T>(``)
}

export { getMaps, getGamemodes }
