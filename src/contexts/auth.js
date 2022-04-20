import {useState, createContext, useEffect } from 'react'
import firebase from '../services/firebaseConnection'
import { toast } from 'react-toastify'

export const AuthContext= createContext({})

function AutthProvider({ children }){
    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loadin, setLoading] = useState(true) 

    useEffect(()=>{

        const loadStorage = ()=>{
            const storageUser = localStorage.getItem('SistemaUser')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
    
            setLoading(false)
        }

        loadStorage()

    },[])

    const signIn = async (email, passwor) => {
        setLoadingAuth(true)
        await firebase.auth().signInWithEmailAndPassword(email, passwor)
        .then(async(value)=>{
            let uid = value.user.uid
            const userProfile = await firebase.firestore().collection('users').doc(uid).get()
            let data = {
                uid: uid,
                name: userProfile.data().name,
                avatarUrl: userProfile.data().avatarUrl,
                email : value.user.email
            }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success('Bem vindo de volta!')

        })
            .catch((error)=>{
                console.log(error)
                setLoadingAuth(false)
                toast.error('Ops, algo deu errado!')
            })

    }

    const signUp = async (email, passwor, name) => {
        setLoadingAuth(true)
        await firebase.auth().createUserWithEmailAndPassword(email, passwor)
        .then( async (value)=>{
            let uid = value.user.uid
            await firebase.firestore().collection('users')
            .doc(uid).set({
                name: name,
                avatarUrl: null,
            })
            .then( () => {
               let data = {
                   uid: uid,
                   name: name,
                   email: value.user.email,
                   avatarUrl: null
               }
               
               setUser(data)
               storageUser(data)
               setLoadingAuth(false)
               toast.success('Bem vindo a plataforma!')

            })
            .catch((error)=>{
                console.log(error)
                toast.error('Ops, algo deu errado!')
                setLoadingAuth(false)
            })
        })
    }

    const storageUser = (data) =>{
        localStorage.setItem('SistemaUser', JSON.stringify(data) )
    }

    const signOut = async () =>{
        await firebase.auth().signOut()
        localStorage.removeItem('SistemaUser')
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{signed: !!user, 
        user, 
        loadin, 
        signUp, 
        signOut, 
        signIn, 
        loadingAuth,
        setUser,
        storageUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AutthProvider