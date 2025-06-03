import axios from 'axios';

const axi = axios.create({
    baseURL:"http://localhost:5000/api",
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
            },
    withCredentials: true,
});

export default axi;