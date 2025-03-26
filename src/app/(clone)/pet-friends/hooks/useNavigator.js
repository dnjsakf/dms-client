
import { useRouter } from "next/navigation";
import useCategoryStore from "../store/navigatorStore";

const useNavigator = () => {
  const router = useRouter();
  const { navItems, setActive } = useCategoryStore();

  const __find = ( cateId ) => {
    return navItems?.find((item)=>(item.id === cateId));
  }
  const __findIndex = ( cateId ) => {
    return navItems?.findIndex((item)=>(item.id === cateId));
  }

  const handleMoveToCate = ( cateId ) => {
    const found = __find(cateId);
    if( found && found.path ) {
      setActive(found.id);
      router.push(found.path);
    }
  }

  return {
    moveToCate: ( cateId ) => {
      handleMoveToCate(cateId);
    },
    moveToEvent: () => {
      handleMoveToCate('cate-10')
    },
  };
}

export default useNavigator;