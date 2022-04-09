import { selectPlugState, useAppSelector } from 'src/store';

export const usePlugStore = () => useAppSelector(selectPlugState);
