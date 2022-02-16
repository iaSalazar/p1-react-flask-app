import React from 'react'
import Voice from './Voice'
import {useState, useEffect} from 'react'


function VoiceList() {
    const initialState={
        name:"Concurso",
        admin: "Admin"
    }
    const [admin, setAdmin] = useState()
  return (
    <div> 
        
    <Voice token={'tokin'} admin={admin} /></div>
  )
}

export default VoiceList