import useTokenStore from "./token";
import useTabStore from "./collapse";

const useStore = () => {
  return {
    ...useTokenStore(),
    ...useTabStore(),
  };
};

export default useStore;
