import React from 'react'
import Button from 'react-bootstrap/Button'
import ConcursoList from '../ConcursoList'
import ConcursoForm from '../ConcursoForm'
import {useState} from 'react'
import {login, authFetch, useAuth, logout} from "../auth"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  useNavigate,
  Link,
  useHistory
} from "react-router-dom";





function AdminHome() {
    const [logged] = useAuth();
    let navigate = useNavigate();
    const [click, setClick] = useState(1)
    
    const handleClick = () => {setClick(!click); console.log(click)}

  return (
    
    <div>
        <p>Concursos</p>
        <p> </p>
        <p>El administrador puede gestionar los concursos (CRUD de concursos)</p>
        
        {logged?(<div><Button variant="danger" onClick={() => {logout();navigate('/')}  }>Logout</Button>
        <span>   </span>
        <Button variant="primary" onClick={handleClick}> Agregar</Button></div>):<p>NO SE ENCUENTRA CONECTADO PARA ADMINISTRAR LOS CONCURSOS</p>}
        
        
        
        {click? <ConcursoList/>: <ConcursoForm clickback={setClick}/>}


    </div>
    
  )
}

export default AdminHome