import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter} from 'react-router-dom'
import AutthProvider from './contexts/auth'
import Routes from './routes'
import { ToastContainer } from 'react-toastify'

export default function App() {
    return(
    <AutthProvider>
        <BrowserRouter>
            <ToastContainer autoClose={3000}/>
            <Routes/>
        </BrowserRouter>
    </AutthProvider>
    )
}