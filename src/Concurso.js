import React from 'react'
import {useState, useEffect} from 'react'


function Concurso(props) {
  
  return (
    
      <tr onClick ={() => {props.selected(props.concurso);console.log('HOLAAAAACASDAF$#')}} >
      <td>{props.concurso.id}</td>
      <td>{props.concurso.name}</td>
      <td>{props.concurso.date_start}</td>
      <td>{props.concurso.date_end}</td>
      <td><img src={props.concurso.image}></img></td>
      </tr>
  )
}

export default Concurso