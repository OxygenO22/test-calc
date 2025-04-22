import axios, { AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: false,
})

export const dateApi = {
  getMaterials() {
    return instance.get<Data[]>(`/data`)
  },
  getConfig() {
    return instance.get<Config[]>(`/config`)
  }
}

export type Data = {
  id: string;
  material?: string;
  name: string;
  price: number
  type: string;
  unit: string;
  width?: number
};

export type Config = {
  type: string;
  key: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  id: string;
  value?: number
};
