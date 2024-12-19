import { axiosPrivate } from "../utils/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                console.log('Request Interceptor Triggered');
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        
        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                console.log('Response Interceptor Triggered');
                const prevRequest = error?.config;

                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    console.log('401 Error: Retrying request...');
                    
                    prevRequest.sent = true; // Prevent infinite retry loops
                    
                    try {
                        const newAccessToken = await refresh();

                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        
                        // Retry the request with the updated token
                        return axiosPrivate(prevRequest);
                    } catch (refreshError) {
                        console.error('Token Refresh Failed:', refreshError);
                        return Promise.reject(refreshError);
                    }
                }
                
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refresh]);

    return axiosPrivate;
};

export default useAxiosPrivate;
