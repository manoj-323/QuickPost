import axios from '../utils/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.post(
            'http://127.0.0.1:8000/auth/token/refresh/',
            {
                refresh: localStorage.getItem('refresh_token') // Pass the refresh token in the body
            },
            {
                withCredentials: true // Include cookies if needed
            }
        );
        setAuth(prev => {
            return { ...prev, accessToken: response.data.access }
        });
        return response.data.access;
    }
    return refresh;
};

export default useRefreshToken;