import React from 'react'
import {useState, useEffect} from 'react'
import Button from 'react-bootstrap/Button'
import {login, authFetch, useAuth, logout} from "./auth"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Navigate,
  Link
} from "react-router-dom";


var [logged] = '';
function checkLoginStatus() {
  fetch('/api/check_logged', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    },
    
  }).then(response=>response.json()).then(response => {
    if(response.status_loged=='logged'){
      logged = true
      console.log('es igual a ' + response.status_loged)
    }
  })
}

function Concurso(props) {
  
  const [logged] = useAuth();
  const [click, setClick] = useState(1)

  const handleClick = () => setClick(!click)
  const deLink= `/api/contests/${props.concurso.id}/delete`
  const handleDelete =() =>{
    
    const requestOptions ={
      method:'DELETE'
    }
    authFetch(deLink,
          requestOptions)
  }
  
  return (
    
      <tr onClick ={() => {props.selected(props.concurso);console.log('HOLAAAAACASDAF$#')}} >
      <td>{props.concurso.id}</td>
      <td>{props.concurso.name}</td>
      <td>{props.concurso.date_start}</td>
      <td>{props.concurso.date_end}</td>
      {logged?(<td><Button variant="danger" onClick={handleDelete}>Delete!!</Button></td>):<td></td>}
      
      <td>{click ? <Button variant="success" onClick={handleClick}> Go !</Button>: <Navigate to ={`/contests/${props.concurso.id}/${props.concurso.url}`}/>}</td>
      </tr>
  )
}

export default Concurso