import axios from 'axios';

const axi = axios.create({
    baseURL:"/api/api",
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
            },
    withCredentials: true,
});

export default axi;