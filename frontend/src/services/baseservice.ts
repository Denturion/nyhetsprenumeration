import axios from "axios"

export const getData = async <T> (url:string):Promise<T> => {
const response = await axios.get<T>(url)
const data = response.data;
return data
}

export const postData = async <T> (url:string,payload:any):Promise<T> => {
const response = await axios.post<T>(url,payload)
const data = response.data;
return data
}

export const patchData = async <T> (url:string,payload:any):Promise<T> => {
const response = await axios.patch<T>(url,payload)
const data = response.data;
return data
}

export const deleteData = async <T> (url:string):Promise<T> => {
const response = await axios.delete<T>(url)
const data = response.data;
return data
}