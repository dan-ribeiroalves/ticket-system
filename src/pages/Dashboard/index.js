import './dashboard.css'
import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiMessageSquare, FiPlus,FiSearch, FiEdit2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import firebase from '../../services/firebaseConnection'
import Modal from '../../components/Modal'

const listRef = firebase.firestore().collection('calleds').orderBy('created', 'desc')

export default function Dashboard(){
    const [serviceCalls, setServiceCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()
    
    useEffect(()=>{
        
        loadingtickets()


        return() => {

        }

    },[])

    const loadingtickets = async () =>{
        await listRef.limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
        .catch((error)=>{
            console.log(error)
            setLoadingMore(false)
        })
    
        setLoading(false)
    }

    const updateState = async (snapshot) =>{
        const isCollectionEmpty = snapshot.size === 0

        if(!isCollectionEmpty){
            let list = []

            snapshot.forEach((doc)=>{
                list.push({
                    id: doc.id,
                    subject : doc.data().subject,
                    customers: doc.data().customers,
                    customersId: doc.data().customersId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complement: doc.data().complement
                })
            })
                
            const lastDoc = snapshot.docs[snapshot.docs.length -1]

            setServiceCalls(serviceCalls => [...serviceCalls, ...list])
            setLastDocs(lastDoc)

        }else{
            setIsEmpty(true)
        }

        setLoadingMore(false)
    }

    const handleMore = async () =>{
        setLoadingMore(true)
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot)=>{
            updateState(snapshot)
        })
    }

    const togglePostModal = (item) =>{
        setShowPostModal(!showPostModal)
        setDetail(item)      
    }

    if(loading){
        return(
           <div>
            <Header/>
          
            <div className='content'>
                <Title name='Atendimentos'>
                    <FiMessageSquare size={25}/>
                </Title>

                <div className='container dashboard'>
                    <span>Buscando chamdos...</span>
                </div>
            </div>
        </div> 
        )
    }

    return(
        <div>
            <Header/>
          
            <div className='content'>
                <Title name='Atendimentos'>
                    <FiMessageSquare size={25}/>
                </Title>

                {serviceCalls.length === 0 ? (
                    <div className='container dashboard'>
                        <span>Nenhum chamado registrado...</span>
                            <Link to='/new' className='new'>
                                <FiPlus size={25} color='#FFF'/>
                                Novo chamdo
                            </Link>
                </div>
                ) : (
                    <>
                     <Link to='/new' className='new'>
                        <FiPlus size={25} color='#FFF'/>
                            Novo chamdo
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                    <th scope='col'>Cliente</th>
                                    <th scope='col'>Assunto</th>
                                    <th scope='col'>Status</th>
                                    <th scope='col'>Cadastrado em</th>
                                    <th scope='col'>#</th>
                                </tr>
                            </thead>
                            <tbody>

                                {serviceCalls.map((item,index)=>{
                                    return(
                                    <tr key={index}>
                                    <td data-label='Cliente'>{item.customers}</td>
                                    <td data-label='Assunto'>{item.subject}</td>
                                    <td data-label='Status'>
                                        <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span>
                                    </td>
                                    <td data-label='Cadastrado'>{item.createdFormated}</td>
                                    <td data-label='#'>
                                        <button className='action' style={{backgroundColor:'#3583f6'}} onClick={()=> togglePostModal(item)}>
                                            <FiSearch color='#FFF' size={17}/>
                                        </button>
                                        <Link className='action' style={{backgroundColor:'#F6a935'}} to={`/new/${item.id}`}>
                                            <FiEdit2 color='#FFF' size={17}/>
                                        </Link> 
                                    </td>
                                </tr>
                                    )
                                })} 

                                
                            </tbody>
                        </table>

                        {loadingMore && <h3 style={{texAlign:'center', marginTop:15 }}>Buscando dados...</h3>}       
                        {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar mais</button>}
                    </>
                )} 
            </div>

             {showPostModal && (
                 <Modal
                 conteudo={detail}
                 close={togglePostModal}
                 />
             )}                   

        </div>
    )
}