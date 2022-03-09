import React from 'react'
import Table from 'react-bootstrap/Table'
import {useState, useEffect} from 'react'
import {login, authFetch, useAuth, logout} from "./auth"
import { useParams } from 'react-router-dom'
import Button from 'react-bootstrap/Button'


function VoiceSelected(props) {
  let apiLink=`/api/contests/${props.voice.contest_id}/play/${props.voice.id}`
  let trnsLink=`/api/contests/${props.voice.contest_id}/trns/${props.voice.id}`
  let orgLink=`/api/contests/${props.voice.contest_id}/org/${props.voice.id}`


  const [audio,setAudio]= useState()
  const [logged] = useAuth();

  useEffect(()=>{
    const audio = document.querySelector("audio")
    fetch(apiLink).then((res) => res.blob()).then((data)=>{
        var objectURL = URL.createObjectURL(data)
        audio.src = objectURL
        setAudio(objectURL)
    })

  },[])

  const downloadTransformed = () => {
    fetch(trnsLink)
        .then(response => {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = `${props.voice.email}_transformed.mp3`;
                a.click();
            });
            //window.location.href = response.url;
    });
}
  
const downloadOriginal = () => {
  authFetch(orgLink)
      .then(response => {
          response.blob().then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = `${props.voice.email}_original.${props.voice.file_path_org.slice(-3)}`;
              a.click();
          });
          //window.location.href = response.url;
  });
}
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
            <td>{logged ? <div><Button variant="primary" onClick={downloadTransformed}> mp3 format</Button> <span>    </span>
                <Button variant="primary" onClick={downloadOriginal}> Original</Button></div> : ""}
            </td>
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