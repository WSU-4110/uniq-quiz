import axios from 'axios';

const configureAxios = () => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
}

export default configureAxios;