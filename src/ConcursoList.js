import React from 'react'
import {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import Concurso from './Concurso'
import { useParams } from 'react-router-dom'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Navigate,
    useNavigate,
    Link
  } from "react-router-dom";

function ConcursoList(props) {
    //let navigate = useNavigate();
    //const { id_user } = this.props.match.params.id_user
    //const {id_user} = useParams()
    //console.log(id_user)
    const id_user = sessionStorage.getItem("id")
    const apiLink = `/api/contests/user/${id_user}/list`
    const adminLink = "admin"

    const [concursos, setConcursos] = useState([])
    const [click, setClick] = useState(0)
    const [selected, setSelected] = useState()
    const [admin, setAdmin] = useState()
    const [refresh, setrefresh] = useState()

    useEffect(() =>{
        console.log("HOLAAAAAAAAAAAAAAAAAAAAa")
        setTimeout(12000)
        fetch(`/api/contests/user/${id_user}/list`).then((res) => res.json()).then( (apires) => {
            console.log(apires)
            setConcursos(apires.reverse())
            console.log(concursos)
        })
        // fetch(adminLink).then((res) => res.json()).then( (apires) => {
        //     console.log(apires)
        //     setAdmin(apires)
        // })
    },[click])

    
    const handleClick = () => setClick(!click)
    //const navi = () => navigate("/Voice")
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