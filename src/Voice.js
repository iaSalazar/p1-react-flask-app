import React from 'react'
import Button from 'react-bootstrap/Button'
import {useState, useEffect} from 'react'



function Voice(props) {



  const [click, setClick] = useState(0)
  const [selected, setSelected] = useState()

  const link = `/api/contests/${props.id_contest}/play/${selected}`

  const handleClick = () => setClick(!click)
  const handleSelected = (voice) => {  setSelected(voice)
                                          setClick(!click)
                                          }
  

  /*
   <audio id="audio" controls preload="auto">
      <source src={blob.src} type="audio/mp3" />
    </audio>
  */
  return (
    <tr>
    <td>{props.voice.id}</td>
    <td>{props.voice.first_name + " " + props.voice.last_name}</td>
    <td>{props.voice.email}</td>
    <td>{props.voice.trabsformed}</td>
    <td><Button variant="success" onClick={() => {handleSelected(props.selected(props.voice.file_path))}}> Play</Button></td>
 
   </tr>
  )
}

export default Voice