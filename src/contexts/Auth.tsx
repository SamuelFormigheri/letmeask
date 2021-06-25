import { createContext, useState, useEffect } from "react";
import { Firebase, FirebaseAuth } from "../services/firebase";

type IUser = {
    id: string;
    name: string;
    avatar: string;
};

export interface IAuthContext {
    user?: IUser
    signInWithGoogle: () => Promise<void>;
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface IAuthProvider {
    children: React.ReactNode;
}

export function AuthProvider({children}: IAuthProvider) {
    const [user, setUser] = useState<IUser>();
    
    const signInWithGoogle = async () => {
        const provider = new Firebase.auth.GoogleAuthProvider();

        const result = await FirebaseAuth.signInWithPopup(provider);

        if(result.user){
            const { displayName, photoURL, uid, email  } = result.user;

            setUser({
                id: uid,
                name: displayName || email || "",
                avatar: photoURL || ""
            });
        }
        
    };

    useEffect(() => {
        const unsubscribe = FirebaseAuth.onAuthStateChanged(user => {
            if(user){    
                const { displayName, photoURL, uid, email  } = user;
            
                setUser({
                    id: uid,
                    name: displayName || email || "",
                    avatar: photoURL || ""
                });
            }
        });

        return () => {
            unsubscribe();
        }
        
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    )
}