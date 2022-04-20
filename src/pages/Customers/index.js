import { useContext, useState } from 'react'
import './customers.css'
import Title from '../../components/Title'
import Header from '../../components/Header'
import firebase from '../../services/firebaseConnection'
import { FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function Customers(){
    const [fantasyName, setFantasyName] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [address, setAddress] = useState('')

    const handleAdd = async (e) =>{
        e.preventDefault()
        
        if(fantasyName !== '' && cnpj !== '' && address !== ''){
            await firebase.firestore().collection('customers')
            .add({
               fantasyName: fantasyName,
               cnpj: cnpj,
               address: address, 
            })
            .then(()=>{
                setFantasyName('')
                setCnpj('')
                setAddress('')
                toast.info('Empresa cadastrada com sucesso!')
            })
            .catch((error)=>{
                console.log(error)
                toast.error('Erro ao cadastar essa empresa.')
            })
        }else{
            toast.error('Preencha todos os campos!')
        }
    }


    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='Clientes'>
                    <FiUser size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleAdd}>
                        <label>Nome fantasia</label>
                        <input type='text' placeholder='Nome da sua empresa' value={fantasyName} onChange={(e)=> setFantasyName(e.target.value)}/>
                        
                        <label>CNPJ</label>
                        <input type='text' placeholder='Seu CNPJ' value={cnpj} onChange={(e)=> setCnpj(e.target.value)}/>
                        
                        <label>Endereço</label>
                        <input type='text' placeholder='Endereço da empresa' value={address} onChange={(e)=> setAddress(e.target.value)}/>

                        <button type='submit'>Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}