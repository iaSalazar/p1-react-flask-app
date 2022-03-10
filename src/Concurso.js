import React from 'react'
import {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  Link
} from "react-router-dom";



function Concurso(props) {

  const [click, setClick] = useState(1)

  const handleClick = () => setClick(!click)
  
  return (
    
      <tr onClick ={() => {props.selected(props.concurso);console.log('HOLAAAAACASDAF$#')}} >
      <td>{props.concurso.id}</td>
      <td>{props.concurso.name}</td>
      <td>{props.concurso.date_start}</td>
      <td>{props.concurso.date_end}</td>
      <td>{click ? <Button variant="success" onClick={handleClick}> Go !</Button>: <Navigate to ={`/contests/${props.concurso.id}/${props.concurso.url}`}/>}</td>
      </tr>
  )
}

export default Concurso