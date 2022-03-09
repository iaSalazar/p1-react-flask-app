import React from 'react'
import Table from 'react-bootstrap/Table'
import {useState, useEffect} from 'react'
import {login, authFetch, useAuth, logout} from "./auth"
import { useParams } from 'react-router-dom'


function VoiceSelected(props) {
  let apiLink=`/api/contests/${props.voice.contest_id}/play/${props.voice.id}`
  const [audio,setAudio]= useState()

  useEffect(()=>{
    const audio = document.querySelector("audio")
    fetch(apiLink).then((res) => res.blob()).then((data)=>{
        var objectURL = URL.createObjectURL(data)
        audio.src = objectURL
        setAudio(objectURL)
    })

  },[])
  
  return (
    <div>
        <Table bordered hover>
        <thead>
            <tr>
                <th>Player</th>
                <th>Nombre</th>
                <th>email</th>
                <th>Download</th>
                <th>Audio</th>
            </tr>
        </thead>
        <tbody>
        <tr>
            <td>{props.voice.id}</td>
            <td>{props.voice.first_name + " " + props.voice.last_name}</td>
            <td>{props.voice.email}</td>
            <td>{props.voice.transformed}</td>
            <td><audio id="audio" controls preload="auto">
                <source src={audio} type="audio/mp3" />
              </audio></td>
        
    </tr>
        </tbody>
        </Table>

    </div>
  )
}

export default VoiceSelected