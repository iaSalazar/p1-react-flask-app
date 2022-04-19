import React from 'react'
import { useState, useEffect } from 'react'
import { login, authFetch, useAuth, logout } from "./auth"
function ConcursoForm(props) {
  var file

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
  const [click, setClick] = useState(0)
  const [name, setName] = useState()
  const [img_file, setFile] = useState()
  const [url, setUrl] = useState()
  const [date_start, setDateS] = useState()
  const [date_end, setDateE] = useState()
  const [pay, setPay] = useState()
  const [script, setScript] = useState()
  const [tips, setTips] = useState()

  const formData = new FormData()

  const handleName = (e) => {
    setName(e.target.value.trim())
    formData.append("name", e.target.value.trim())
  }
  const handleUrl = (e) => {
    setUrl(e.target.value.trim())
    formData.append("url", e.target.value.trim())
  }
  const handleDateS = (e) => {
    setDateS(e.target.value.trim())
    formData.append("date_start", e.target.value.trim())
  }
  const handleDateE = (e) => {
    setDateE(e.target.value.trim())
  }
  const handlePay = (e) => {
    setPay(e.target.value.trim())
  }
  const handleScript = (e) => {
    setScript(e.target.value.trim())
  }
  const handleTips = (e) => {
    setTips(e.target.value.trim())
  }

  //the form data is all the collected form information and image banner
  formData.append("name", name)
  formData.append("url", url)
  formData.append("date_start", date_start)
  formData.append("date_end", date_end)
  formData.append("pay", pay)
  formData.append("script", script)
  formData.append("tips", tips)


  const handleSubmit = (e) => {
    e.preventDefault()
    setClick(!click)
    props.clickback(1)
    console.log([formData]);
    for (let [key, value] of formData) {
      console.log(`${key}: ${value}`)
    }
    const requestOptions = {
      method: 'POST',
      body: formData
    }

    authFetch("/api/contests/create",
      requestOptions).then(response => response.text()).then(response => JSON.parse(response)).then(result => {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "image/png");

        
        var file_name_path = result.image
        var s3_url = result.url
        console.log(s3_url)
        console.log(file_name_path)
        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: file,
          redirect: 'follow'
        };

        fetch(s3_url+file_name_path, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      })
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
      <p>Los usuarios pueden subir una voz a un concurso completando el formulario</p>

      <p>La voz es procesada, el estado de la voz cambia en la tabla principal. El usuario recibe un email donde se le informa que la
        voz ya ha sido publicada en la página pública del concurso.</p>

      <label>
        Nombre Concurso
        <input name="name" onChange={handleName} />
      </label>
      <br />
      <label>
        Identificador
        <input name="url" onChange={handleUrl} />
      </label>
      <label>
        Fecha Inicio
        <input name="date_start" onChange={handleDateS} type="date" />
      </label>
      <label>
        Fecha Fin
        <input name="date_end" onChange={handleDateE} type="date" />
      </label>
      <label>
        Premio
        <input name="pay" onChange={handlePay} />
      </label>
      <label>
        Guión
        <textarea name="script" onChange={handleScript} type="textarea" rows="7" cols="70" />
      </label>
      <label>
        Tips
        <textarea name="tips" onChange={handleTips} type="textarea" rows="7" cols="70" />
      </label>
      <label>
        Banner
        <input
          id='file_input'
          filename={img_file}
          onChange={e => {  file = e.target.files[0] }}//formData.append("img_file", e.target.files[0]); }}
          type="file"
          name="img_file"
          accept="image/*"
        ></input>
      </label>
      <br />
      <button onClick={handleSubmit}>Submit</button>


    </div>
  )
}

export default ConcursoForm