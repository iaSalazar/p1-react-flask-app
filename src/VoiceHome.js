import React from 'react'
import Button from 'react-bootstrap/Button'
import VoiceList from './VoiceList'
import VoiceForm from './VoiceForm'
import {useState} from 'react'

function VoiceHome(props) {
    const [click, setClick] = useState(1)
    const [infoClick, setInfoClick] = useState(1)
    
    const handleClick = () => setClick(!click)
    const handleInfoClick = () => setInfoClick(!infoClick)

    const {id_contest} = this.props.match.params

  return (
    
    <div>
        <p>Concurso</p>
        <section style='display:inline-block  jus'>
            <Button variant="primary" onClick={handleClick}> Agregar</Button>
            <Button variant="primary" onClick={handleClick} style='display:flex align-items:left padding:1rem'> Info</Button>
        </section>
        {console.log(window.location.href)}
        {click? <VoiceList id={id_contest}/>: <VoiceForm id={id_contest}/>}

        
    </div>
  )
}

export default VoiceHome