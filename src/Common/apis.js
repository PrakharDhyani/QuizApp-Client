import axios from "axios"

const api = axios.create({
    //baseURL: "",
    baseURL: "http://localhost:8000/",
})

export default api;