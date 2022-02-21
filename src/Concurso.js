import React from 'react'
import {useState, useEffect} from 'react'


function Concurso(props) {
  
  return (
    
      <tr onClick ={() => {props.selected(props.concurso);console.log('HOLAAAAACASDAF$#')}} >
      <td>{props.concurso.id}</td>
      <td>{props.concurso.name}</td>
      <td>{props.concurso.date_start}</td>
      <td>{props.concurso.date_end}</td>
      <td><a href={`api/contests/${props.concurso.id}/${props.concurso.url}`}>api/contests/{props.concurso.id}/{props.concurso.url}</a></td>
      </tr>
  )
}

export default Concurso