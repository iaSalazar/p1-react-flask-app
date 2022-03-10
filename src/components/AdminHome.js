import React from 'react'
import Button from 'react-bootstrap/Button'
import ConcursoList from '../ConcursoList'
import ConcursoUpdate from '../ConcursoUpdate'
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

    let navigate = useNavigate();
    const [click, setClick] = useState(1)
    const [put, setPut] = useState(0)
    const clickPut = () => {setPut(!put); console.log(put)}

    const [current, setCurrent] =useState()

    const handleCurrent=(e)=>{
        setCurrent(e)
    }

    
    const handleClick = () => {setClick(!click); console.log(click)}

  return (
    
    <div>
        <p>Concursos</p>
        <p> </p>
        <p>El administrador puede gestionar los concursos</p>
        <div>
        <Button variant="danger" onClick={() => {logout();navigate('/')}  }>Logout</Button>
        <span>   </span>
        <Button variant="primary" onClick={handleClick}> Agregar</Button>
        </div>
        
        {put? <ConcursoUpdate clickPut={clickPut} concurso={current}  />  :  click? <ConcursoList clickPut={clickPut} setCurrent={handleCurrent}/>: <ConcursoForm clickback={setClick}/>}


    </div>
    
  )
}

export default AdminHome