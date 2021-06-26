import { createContext, ReactNode, useEffect, useState } from "react";
import { auth,firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthConextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
  }

  type AuthContextProviderProps = {
      children: ReactNode;
  }

export const AuthContext = createContext({} as AuthConextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>();

    //monitora se ouve autenticação do usuario e retorna as informações
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            const {displayName, photoURL, uid} = user
    
            if(!displayName || !photoURL){
              throw new Error('Missing information from Google Account.');
            }
  
              setUser ({
                id: uid,
                name: displayName,
                avatar: photoURL
          })
        }
      })
  
      return () => {
        unsubscribe();
      }
    }, [])
  
    //navegar e autenticar usuario
    async function signInWithGoogle(){
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider)
  
      if (result.user) {
        const {displayName, photoURL, uid} = result.user
   
      if(!displayName || !photoURL){
         throw new Error('Missing information from Google Account.');
      }
  
        setUser ({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
    } 
  }


    return (
        <AuthContext.Provider value={{ user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}