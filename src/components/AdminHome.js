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

function logout_server_session() {
  fetch('/api/logout', {
    method: 'POST',
    headers: {
      "Content-type": "application/json"
    },
    
  }).then(response=>response.json()).then(response => {
    if(response.status=='200'){
      console.log('LOGGED OUT FROM SERVER SESSION')
    }else{
      console.log('something happened')
    }
  })
}

function AdminHome() {
    window.location.reload(true);
    const [logged] = useAuth();
    let navigate = useNavigate();
    const [click, setClick] = useState(1)
    
    const handleClick = () => {setClick(!click); console.log(click)}

  return (
    
    <div>
        <p>Concursos</p>
        <p> </p>
        <p>El administrador puede gestionar los concursos (CRUD de concursos)</p>
        {logged?(<div><Button variant="danger" onClick={() => {logout();logout_server_session();navigate('/')}  }>Logout</Button>
        <span>   </span>
        <Button variant="primary" onClick={handleClick}> Agregar</Button></div>):<p>NO SE ENCUENTRA CONECTADO PARA ADMINISTRAR LOS CONCURSOS</p>}
        
        
        
        {click? <ConcursoList/>: <ConcursoForm clickback={setClick}/>}


    </div>
    
  )
}

export default AdminHome