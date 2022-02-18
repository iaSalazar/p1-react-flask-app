    import React from 'react'
    import {useState, useEffect} from 'react'
    
    function Voice(props) {

      const baseURL=""

      const link = "http://127.0.0.1:5000/api/contests/<int:contest_id>/trns/<int:voice_id>"

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
            console.log(audio.src)
            console.log(blob.src)
            })

          fetch(BaseURL).then((res) => res.json()).then( (apires) => {
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
        <audio id="audio" controls preload="auto">
          <source src={blob.src} type="audio/mp3" />
        </audio>
       </div>
      )
    }
    
    export default Voice