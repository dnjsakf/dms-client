import { useRouter } from 'next/navigation';
import AuthService from "@/services/common/AuthService";
import useAuthStore from '@/store/authStore';

const useAuthHook = () => {

  const router = useRouter();
  const { isGuest, authenticated } = useAuthStore();

  const redirect = async ( path ) => {
    if ( await AuthService.isAuthenticated() ) {
      router.replace(path);
    } else {
      router.replace('/login');
    }
  };

  const doLogout = async () => {
    const response = await AuthService.logout();
    if( response.code === 200 ){
      router.replace('/');
    }
    return response;
  }

  const doTokenRefresh = async () => {
    try {
      const response = await AuthService.refreshToken();
      console.log(response);
      return response;
    } catch ( error ){
      console.error(error);
    }
  }

  const goHome = async () => {
    router.replace('/');
  }
  const goLoginPage = async () => {
    router.replace('/login');
  }

  return {
    redirect,
    doLogout,
    doTokenRefresh,
    goHome,
    goLoginPage,
    isGuest,
    authenticated
  }
}

export default useAuthHook;