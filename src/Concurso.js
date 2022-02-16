import React from 'react'
import {useState, useEffect} from 'react'

function Concurso(props) {
  return (
    <div>
      <tr onClick ={() => {props.selected(props.concurso)}} />
      <td>{props.concurso.id}</td>
      <td>{props.concurso.nombre}</td>
      <td>{props.concurso.fechainicio}</td>
      <td>{props.concurso.fechafin}</td>
      <td>{props.concurso.url}</td>
     </div>
  )
}

export default Concurso