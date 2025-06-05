import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const token = sessionStorage.getItem("token");

export const getData = async <T> (url:string):Promise<T> => {
  if (!token) {
    window.location.href = "/login"; 
    throw new Error("Ingen token – skickar till login");
  }
const response = await api.get<T>(url)
const data = response.data;
return data
}

export const postData = async <T> (url:string,payload:any):Promise<T> => {
  if (!token) {
    window.location.href = "/login"; 
    throw new Error("Ingen token – skickar till login");
  }
const response = await axios.post<T>(url,payload)
const data = response.data;
return data
}

export const patchData = async <T> (url:string,payload:any):Promise<T> => {
  if (!token) {
    window.location.href = "/login"; 
    throw new Error("Ingen token – skickar till login");
  }
const response = await axios.patch<T>(url,payload)
const data = response.data;
return data
}

export const deleteData = async <T> (url:string):Promise<T> => {
  if (!token) {
    window.location.href = "/login"; 
    throw new Error("Ingen token – skickar till login");
  }
const response = await axios.delete<T>(url)
const data = response.data;
return data
}