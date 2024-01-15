import axios from "axios"

const serverUrl = process.env.REACT_APP_SERVER_URL;

const API = axios.create({baseURL: serverUrl});

export const messageData = (id, {method}) => {
    const token = localStorage.getItem("access_token")
    return API.get(`${method}/${id}`, {headers: {token}})}; 