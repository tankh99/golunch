import store from '../store/store';
import { toggleLoading } from '../constants/actionCreators';

export function dispatchToggleLoading(loading: boolean){
    store.dispatch(toggleLoading(loading));
}

