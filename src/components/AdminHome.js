import React from 'react'
import Button from 'react-bootstrap/Button'
import ConcursoList from '../ConcursoList'
import ConcursoForm from '../ConcursoForm'
import {useState} from 'react'


function AdminHome() {
    const [click, setClick] = useState(1)
    
    const handleClick = () => setClick(!click)

  return (
    
    <div>
        <p>Concursos</p>
        <Button variant="primary" onClick={handleClick}> Agregar</Button>
        {click? <ConcursoList/>: <ConcursoForm/>}

        
    </div>
  )
}

export default AdminHome