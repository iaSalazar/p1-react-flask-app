import React from 'react'
import {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import Concurso from './Concurso'

function ConcursoList(props) {

    const apiLink = "no link"
    const adminLink = "admin"

    const [concursos, setConcursos] = useState()
    const [click, setClick] = useState(0)
    const [selected, setSelected] = useState()
    const [admin, setAdmin] = useState()
    const initialState={
        name:"Concurso",
        admin: "Admin"
    }
    useEffect(() =>{
        fetch(apiLink).then((res) => res.json()).then( (apires) => {
            console.log(apires)
            setConcursos(apires)
        })
        fetch(adminLink).then((res) => res.json()).then( (apires) => {
            console.log(apires)
            setConcursos(apires)
        })
    })

    const handleClick = () => setClick(!click)
    const handleSelected = (concurso) => {  setSelected(concurso)
                                            setClick(!click)}
  return (
    <div>    
    <h1> {initialState.admin} style={}</h1>

        <Table striped bordered hover>
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>URL</th>
            </tr>
        </thead>
        <tbody>
            {concursos?.map((e,i) =>(<Concurso concurso={e} id={i} selected={handleSelected} remove={handleClick} />))}
        </tbody>
        </Table>
        {click ? "":""}
    </div>

  )
}

export default ConcursoList