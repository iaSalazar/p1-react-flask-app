    import React from 'react'
    import {useState, useEffect} from 'react'
    import Button from 'react-bootstrap/Button'

    function Voice(props) {

      const baseURL=""

      const link = "/api/contests/1/play/103"

      const [click, setClick] = useState(0)
      const [selected, setSelected] = useState()
      const [blob, setBlob] = useState()

      const handleClick = () => setClick(!click)
      const handleSelected = (concurso) => {  setSelected(concurso)
                                              setClick(!click)}
      
      useEffect(() =>{
          const multimedia = document.getquerySelector("audio")

          fetch(link).then((res) => res.blob()).then(function(data)  {
            console.log(data) 
            var objectURL = URL.createObjectURL(data)
            multimedia.src = objectURL
            console.log(multimedia.src)
            console.log(blob.src)
            })

          
      })

      return (
        <div>
        <td>{props.id}</td>
        <td>{props.voic.first_name + " " + props.voic.last_name}</td>
        <td>{props.voic.email}</td>
        <td>{props.voic.trabsformed}</td>
        <td><Button variant="success" onClick={() => {props.selected(props.voice)}}> Play</Button></td>
        <audio id="audio" controls preload="auto">
          <source src={blob.src} type="audio/mp3" />
        </audio>
       </div>
      )
    }
    
    export default Voice