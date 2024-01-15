import axios from "axios"

const serverUrl = process.env.REACT_APP_SERVER_URL;

const API = axios.create({baseURL: serverUrl});

export const addProd = (data, {method}) => {
    const token = localStorage.getItem("access_token")
    return API.post(`${method}`, data, {headers: {token}})}; 
export const addComment = (id, data, {method}) => {
    const token = localStorage.getItem("access_token")
    return API.post(`${method}/${id}`, data, {headers: {token}})}; 