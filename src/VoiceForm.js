import React from 'react'
import {useState, useEffect} from 'react'
import {login, authFetch, useAuth, logout} from "./auth"
import { useParams } from 'react-router-dom'


function VoiceForm(props) {
  const initialFormData = Object.freeze({
    name: "",
    url: "",
    date_start: "",
    date_end: "",
    pay: "",
    script: "",
    tips: "",
    img_file: "",

  });
  const {id_contest, url_contest} = useParams()
  const [click, setClick] = useState(0)
  const [first_name, setFirstName] = useState()
  const [second_name, setSecondName] = useState()
  const [last_name, setLastName] = useState()
  const [audio_file, setFile] = useState()
  const [email, setEmail] = useState()
  const [observations, setObs] = useState()
  
  const formData = new FormData()


  const handleFirst = (e) => {
    setFirstName(e.target.value.trim())
     formData.append("first_name", e.target.value.trim())
  }
  const handleSecond = (e) => {
    setSecondName(e.target.value.trim())
    formData.append("second_name", e.target.value.trim())
  }
  const handleLast = (e) => {
    setLastName(e.target.value.trim())
    formData.append("last_name", e.target.value.trim())
  }
  const handleEmail = (e) => {
    setEmail(e.target.value.trim())
  }
  const handleObservations = (e) => {
    setObs(e.target.value.trim())
  }

//the form data is all the collected form information and image banner
  formData.append("audio_file", audio_file)
  formData.append("first_name", first_name)
  formData.append("second_name", second_name)
  formData.append("last_name", last_name)
  formData.append("email", email)
  formData.append("observations", observations)


  const handleSubmit = (e) => {
    e.preventDefault()
    setClick(!click)
    //props.clickback(1)
    console.log([formData]);
    for (let [key, value] of formData) {
      console.log(`${key}: ${value}`)
    }
    const requestOptions ={
      method:'POST',
      body:formData
    }
    authFetch(`/api/contests/${id_contest}/${url_contest}/upload`,
          requestOptions)
  }
  

  // useEffect(() =>{
    
  //   const requestOptions ={
  //     headers: {
  //       "Content-type": "multipart/forrm-data"
  //     },
  //     method:'POST',
  //     body:formData

  //   }
  //   authFetch("/api/contests/create",
  //         requestOptions)
  // },[click])

  return (
    <div>
    
    <label>
      First Name
      <input name="first_name" onChange={handleFirst} />
    </label>
    <br />
    <label>
      Second Name
      <input name="second_name" onChange={handleSecond} />
    </label>
    <label>
      Last Name
      <input name="last_name" onChange={handleLast} />
    </label>
    <label>
      Email
      <input name="email" onChange={handleEmail} type="email" />
    </label>
    <label>
      Observations
      <input name="pay" onChange={handleObservations} type="textarea"/>
    </label>
    <label>
      Audio
      <input
            filename={audio_file} 
            onChange={e => formData.append("audio_file", e.target.files[0]) } 
            type="file" 
            name="audio_file"
            accept="audio/*"
      ></input>
    </label>
    <br />
    <button onClick={handleSubmit}>Submit</button>
      
      
    </div>
  )
}

export default VoiceForm