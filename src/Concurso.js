import React from 'react'
import {useState, useEffect} from 'react'

function Concurso(props) {
  return (
    <div>
      <tr onClick ={() => {props.selected(props.concurso)}} />
      <td>{props.id}</td>
      <td>{props.concurso.name}</td>
      <td>{props.concurso.date_start}</td>
      <td>{props.concurso.date_end}</td>
      <td>{props.concurso.url}</td>
     </div>
  )
}

export default Concurso