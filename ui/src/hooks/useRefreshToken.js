import axios from '../utils/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth, setIsAuthenticated } = useAuth();

    const refresh = async () => {
        const response = await axios.post(
            'http://127.0.0.1:8000/auth/token/refresh/',
            {
                refresh: auth?.refreshToken // Pass the refresh token in the body
            },
            {
                withCredentials: true // Include cookies if needed
            }
        );
        setIsAuthenticated(true);
        setAuth(prev => {
            return { ...prev, accessToken: response.data.access }
        });
        return response.data.access;
    }
    return refresh;
};

export default useRefreshToken;