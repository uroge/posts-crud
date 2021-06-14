import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://posts-crud-9a799-default-rtdb.firebaseio.com/'
});

export default axiosInstance;