import { useState, useEffect, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import firebase from '../../services/firebaseConnection'
import './new.css'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { AuthContext } from '../../contexts/auth'
import { FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'


export default function New(){
    
    const { id } = useParams()
    const history = useHistory()
    
    const [loadCustomers, setLoadCustomers] = useState(true)
    const [customers, setCustomers] = useState([])
    const [customersSelected, setCustomersSelected] = useState(0)
    const [subject, setSubject] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')
    const [complement, setComplement] = useState('')
    const [idCustomer, setIdCustomer] = useState(false)
    
    const { user } = useContext(AuthContext)

    useEffect(()=>{
        const loadCustomers = async () =>{
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot)=>{
                let list = []

                snapshot.forEach((doc)=>{
                    list.push({
                        id: doc.id,
                        fantasyName: doc.data().fantasyName
                    })
                })

                if(list.length === 0){
                    console.log('Nenhuma empresa encontrada!')
                    setCustomers([ { id:'1', fantasyName: 'FREELA' }])
                    setLoadCustomers(false)
                    return
                }

                setCustomers(list)
                setLoadCustomers(false)

                if(id){
                    loadId(list)
                }

            })
            .catch((error)=>{
                console.log('Deu algum erro!', error)
                setLoadCustomers(false)
                setCustomers([ { id:'1', fantasyName: '' }])
            })
        }

        loadCustomers()

    },[])

    const loadId = async (list) =>{
        await firebase.firestore().collection('calleds').doc(id)
        .get()
        .then((snapshot)=>{
            setSubject(snapshot.data().subject)
            setStatus(snapshot.data().status)
            setComplement(snapshot.data().complement)

            let index = list.findIndex(item => item.id === snapshot.data().customersId)
            setCustomersSelected(index)
            setIdCustomer(true)
        })
        .catch((error)=>{
            console.log('Erro no Id passado:', error)
            setIdCustomer(false)
        })
    }

    const handleRegister = async (e) =>{
        e.preventDefault()

        if(idCustomer){
            await firebase.firestore().collection('calleds').doc(id)
            .update({
            customers: customers[customersSelected].fantasyName,
            customersId: customers[customersSelected].id,
            subject: subject,
            status: status,
            complement: complement,
            userId: user.uid 
            })
            .then(()=>{
                toast.success('Chamado Editado com sucesso!')
                setCustomersSelected(0)
                setComplement('')
                history.push('/dashboard')
            })
            .catch((error)=>{
                toast.error('Ops erro ao registrar, tente novamete mais tarde.')
            })
            
            return
        }

        await firebase.firestore().collection('calleds')
        .add({
            created: new Date(),
            customers: customers[customersSelected].fantasyName,
            customersId: customers[customersSelected].id,
            subject: subject,
            status: status,
            complement: complement,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Chamado criado com sucesso!')
            setComplement('')
            setCustomersSelected(0)
        })
        .catch((error)=>{
            toast.error('Ops erro ao registrar, tente novamente mais tarde.')
            console.log(error)
        })
    }

    const handleChangeSelect = (e) =>{
        setSubject(e.target.value)   
    }

    const handleOptionChange = (e) =>{
        setStatus(e.target.value)
    }

    const handleChangeCustomers = (e) =>{
        // console.log('Index do Cliente', e.target.value)
        // console.log('Cliente selecionada', customers[e.target.value])
        setCustomersSelected(e.target.value)
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name={!idCustomer ? 'Novo Chamado' : 'Editar Chamado'}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className='container'>
                    
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Clientes</label>

                        {loadCustomers ? (
                            <input type='text' disabled={true} value='Carregando clientes...'/>
                        ) : (
                            <select value={customersSelected} onChange={handleChangeCustomers}>
                            {customers.map((item, index) =>{
                                return(
                                    <option key={item.id} value={index}>
                                        {item.fantasyName}
                                    </option>
                                )
                            })}
                        </select>
                        )}                       

                        <label>Assunto</label>
                        <select value={subject} onChange={handleChangeSelect}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Técnica'>Visita Técnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='satus'>

                            <input type='radio' name='radio' value='Aberto' onChange={handleOptionChange} checked={status === 'Aberto'}/>
                            <span>Em Aberto</span>

                            <input type='radio' name='radio' value='Progresso' onChange={handleOptionChange} checked={status === 'Progresso'}/>
                            <span>Progresso</span>

                            <input type='radio' name='radio' value='Atendido' onChange={handleOptionChange} checked={status === 'Atendido'}/>
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type='text' placeholder='Descreva seu problema (opcional).' value={complement} onChange={(e)=> setComplement(e.target.value)}/>

                        <button type='submit'>Registrar</button>
                    </form>
                   
                </div>

            </div>
        </div>
    )
}