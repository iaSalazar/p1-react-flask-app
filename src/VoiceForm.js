import React from 'react'
import { useState, useEffect } from 'react'
import { login, authFetch, useAuth, logout } from "./auth"
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

var file = ''
var s3_url = ''
var file_format = ''
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
  const { id_contest, url_contest } = useParams()
  const [click, setClick] = useState(0)
  const [first_name, setFirstName] = useState()
  const [second_name, setSecondName] = useState()
  const [last_name, setLastName] = useState()
  const [audio_file, setFile] = useState()
  const [email, setEmail] = useState()
  const [observations, setObs] = useState()
  const [file_name, setFileName] = useState()
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
  const handleAudioFile = (e) => {
    file_format = e.target.files[0].name.split(".")[1]
    if (file_format === 'mp3') {
      var file_name = uuidv4() + '_transformed.' + file_format
      setFileName(file_name)
    }else{
      var file_name = uuidv4() + '.' + e.target.files[0].name.split(".")[1]
    console.log(file_name)
    setFileName(file_name)
    }

    
    file = e.target.files[0]
    fetch(`/api/pre_signed_url_post/${file_name}`, {
      method: 'GET',
      headers: {
        "Content-type": "application/json"
      },
    }).then(response => response.text()).then(response => JSON.parse(response)).then(result => {

      s3_url = result.url
      console.log(s3_url)
    })
  }

  //the form data is all the collected form information and image banner

  formData.append("first_name", first_name)
  formData.append("second_name", second_name)
  formData.append("last_name", last_name)
  formData.append("email", email)
  formData.append("observations", observations)
  formData.append("file_name", file_name)





  const handleSubmit = (e) => {
    e.preventDefault()
    setClick(!click)
    //props.clickback(1)
    console.log([formData]);
    for (let [key, value] of formData) {
      console.log(`${key}: ${value}`)
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "audio/*");

    var requestOptions = {
      method: 'PUT',
      //headers: myHeaders,
      body: file,
      redirect: 'follow'
    };

    if (file_format === 'mp3') {
      console.log('ENTRO AL MP3')
      console.log(`${s3_url}contests/${id_contest}/voices/transformed/${file_name}`)
      fetch(`${s3_url}contests/${id_contest}/voices/transformed/${file_name}`, requestOptions)
        .then(response => response.text()).then(response => {
          console.log(response)
          console.log(`/api/contests/${id_contest}/${url_contest}/upload`)
          var requestOptions = {
            method: 'POST',
            body: formData
          }
          fetch(`/api/contests/${id_contest}/${url_contest}/upload`,
            requestOptions).then(response => response.text()).then(response => JSON.parse(response)).then(result => {
              console.log(result)
            })
        });

    } else {
      console.log('NOOOOO AL MP3')
      console.log(`${s3_url}contests/${id_contest}/voices/original/${file_name}`)
      fetch(`${s3_url}contests/${id_contest}/voices/original/${file_name}`, requestOptions)
        .then(response => response.text()).then(response => {
          console.log(response)
          console.log(`/api/contests/${id_contest}/${url_contest}/upload`)
          var requestOptions = {
            method: 'POST',
            body: formData
          }
          fetch(`/api/contests/${id_contest}/${url_contest}/upload`,
            requestOptions).then(response => response.text()).then(response => JSON.parse(response)).then(result => {
              console.log(result)
            })
        });
    }

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
        <input name="pay" onChange={handleObservations} type="textarea" />
      </label>
      <label>
        Audio
        <input
          filename={audio_file}
          onChange={e => { handleAudioFile(e) }}
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