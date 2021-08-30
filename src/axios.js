import axios from 'axios';

axios.defaults.baseURL = 
    process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "http://localhost:3002"
axios.defaults.headers = {
    "Content-Type": "application/json"
}
export default axios;