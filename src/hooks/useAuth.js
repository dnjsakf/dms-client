import { useRouter } from 'next/navigation';
import AuthService from "@/services/common/AuthService";

const useAuth = () => {
  const router = useRouter();

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

  return {
    redirect,
    logout,
  }
}

export default useAuth;