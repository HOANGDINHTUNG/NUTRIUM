import axios from "axios";
export const axiosInstance = axios.create({
    baseURL:"https://nutrium-server.onrender.com/",
    timeout:3000,
    headers:{
        "Content-Type":"application/json"
    }
})