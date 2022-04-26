import { useState, useContext} from 'react'
import './profile.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiSettings, FiUpload } from 'react-icons/fi'
import { AuthContext } from '../../contexts/auth'
import { toast } from 'react-toastify'
import avatar from '../../assets/avatar.png'
import firebase from '../../services/firebaseConnection'

export default function Profile(){
    const { user, signOut, setUser, storageUser } = useContext(AuthContext)
    const [name, setName] = useState(user && user.name)
    const [email, setEmail] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null)

    const handleFile = (e) =>{

        if(e.target.files[0]){
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(e.target.files[0]))
            }else{
                alert('Envie uma imagem do tipo JPEG ou PNG')
                setImageAvatar(null)
                return null
            }
        }
       
    }
    
    const handleUpload = async () =>{
        const currentUid = user.uid
        const uploadTask = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then( async ()=>{
            console.log('Foto enviada com sucesso!')
            
            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then(async (url)=>{
                let urlFoto = url

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlFoto,
                    name: name
                })
                .then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        name: name
                        
                    }
                
                    setUser(data)
                    storageUser(data)
                    
                })
            })
        })
    }
    
    
    const handleSave = async (e) =>{
        e.preventDefault()
        
        if(imageAvatar === null && name !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                name: name
            })
            .then(()=>{
                let data= {
                    ...user,
                    name: name
                }
                toast.success('Editado com sucesso!')
                setUser(data)
                storageUser(data)
            })
        }
        else if(name !== '' && avatarUrl !== null){
            toast.success('Editado com sucesso!')
            handleUpload()
        }
    }


    return(
        <div>
            <Header></Header>

            <div className='content'>
                <Title name='Meu Perfil'>
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                            <span>
                               <FiUpload color='#FFF' size={25}/> 
                            </span>

                            <input type='file' accept='image/*' onChange={handleFile} /><br/>
                            {avatarUrl === null ?
                                <img src={avatar} width='250' height='250' alt='Foto de perfil do usuario' />
                                :
                                <img src={avatarUrl} width='250' height='250' alt='Foto de perfil do usuario' />
                            }
                        </label>
                        
                        <label>Nome</label>
                        <input type='text' value={name} onChange={ (e)=> setName(e.target.value)}/>
                        
                        <label>Email</label>
                        <input type='text' value={email} disabled={true}/>

                        <button type='submit'>Salvar</button>
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={()=> signOut()}>Sair</button> 
                </div>
            </div>
        </div>
    )
}