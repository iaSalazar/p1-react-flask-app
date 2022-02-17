import React from 'react'
import {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import Concurso from './Concurso'

function ConcursoList(props) {

    const apiLink = "http://127.0.0.1:5000/api/contests/user/1/list"
    const adminLink = "admin"

    const [concursos, setConcursos] = useState([])
    const [click, setClick] = useState(0)
    const [selected, setSelected] = useState()
    const [admin, setAdmin] = useState()

    const initialState={
        name:"Concurso",
        admin: "Admin"
    }
    useEffect(() =>{
        console.log("HOLAAAAAAAAAAAAAAAAAAAAa")
        fetch(apiLink).then((res) => res.json()).then( (apires) => {
            console.log(apires)
            setConcursos(apires)
            console.log(concursos)
        })
        // fetch(adminLink).then((res) => res.json()).then( (apires) => {
        //     console.log(apires)
        //     setAdmin(apires)
        // })
    },[])

    
    const handleClick = () => setClick(!click)
    const handleSelected = (concurso) => {  setSelected(concurso)
                                            setClick(!click)}
  return (
    <div>    
    <h1> {admin}</h1>

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