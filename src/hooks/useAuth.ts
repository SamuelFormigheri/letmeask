import { useContext } from "react";
import {AuthContext, IAuthContext} from '../contexts/Auth';

export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);

    if (!context){
        throw new Error('useAuth must be used within the Auth Provider');
    }

    return context;
}