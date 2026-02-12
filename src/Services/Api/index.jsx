import axios from "axios";

const api = axios.create({
    baseURL: "https://api.brasilapifacil.com.br/v1/"
})


export default api;