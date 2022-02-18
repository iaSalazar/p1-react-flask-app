    import React from 'react'
    import {useState, useEffect} from 'react'
    
    function Voice(props) {

      const baseURL=""

      const [click, setClick] = useState(0)
      const [selected, setSelected] = useState()
      const [audio, setAudio] = useState()

      const handleClick = () => setClick(!click)
      const handleSelected = (concurso) => {  setSelected(concurso)
                                              setClick(!click)}
      
      useEffect(() =>{
          fetch(baseURL).then((res) => res.json()).then( (apires) => {
              console.log(apires)
              setAudio(apires)
          })
      })

      return (
        <div>
        <td>{props.id}</td>
        <td>{props.concurso.name}</td>
        <td>{props.concurso.email}</td>
        <td>{props.concurso.url}</td>
        <td><Button variant="success" onClick={() => {props.selected(props.voice)}}> Play</Button></td>
       </div>
      )
    }
    
    export default Voice