import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://ec2-13-202-114-120.ap-south-1.compute.amazonaws.com:3000",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json', 
  },
  withCredentials: true, 
});

export default axiosInstance;