import axios from 'axios';

axios.defaults.headers = {
    Accept: 'application/json'
};
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});
export default axiosInstance;