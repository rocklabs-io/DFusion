import { useAppSelector } from "src/store/hooks";
import { selectUserExtState } from "./userExt-slice";

export const useUserExtStore = () => useAppSelector(selectUserExtState);