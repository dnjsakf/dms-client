import { useRouter } from 'next/navigation';
import AuthService from "@/services/common/AuthService";
import useAuthStore from '@/store/authStore';

const useAuth = () => {
  const router = useRouter();
  const { isGuest, authenticated } = useAuthStore();

  const redirect = async ( path ) => {
    if ( await AuthService.isAuthenticated() ) {
      router.replace(path);
    } else {
      router.replace('/login');
    }
  };

  const logout = async () => {
    const response = await AuthService.logout();
    if( response.code === 200 ){
      redirect('/');
    }
    return response;
  }

  const login = async () => {
    const response = await AuthService.login();
    if( response.code === 200 ){
      redirect('/login');
    }
    return response;
  }

  return {
    redirect,
    logout,
    login,
    isGuest,
    authenticated
  }
}

export default useAuth;