import React from 'react'
import {useState, useEffect} from 'react'
function ConcursoForm() {


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
  


  const handleName = (e) => {
     setName(e.target.value.trim())
  }
  const handleUrl = (e) => {
    setUrl(e.target.value.trim())
  }
  const handleDateS = (e) => {
    setDateS(e.target.value.trim())
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
  const handleTips = (e) =>{
    setTips(e.target.value.trim())
  }
//the form data is all the collected form information and image banner
  const formData = new FormData()
  formData.append("img_file", img_file)
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
    console.log([formData]);
    for (let [key, value] of formData) {
      console.log(`${key}: ${value}`)
    }
  }

  useEffect(() =>{
    
    const requestOptions ={
      method:'POST',
      body:formData
    }
    fetch("api/contests/create",
          requestOptions)
  },[click])

  return (
    <div>C
    
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
      <input name="pay" onChange={handlePay} type="number"/>
    </label>
    <label>
      Guión
      <textarea name="script" onChange={handleScript} type="textarea" rows="7" cols="70"/>
    </label>
    <label>
      Tips
      <textarea name="tips" onChange={handleTips} type="textarea" rows="7" cols="70"/>
    </label>
    <label>
      Banner
      <input
            filename={img_file} 
            onChange={e => setFile(e.target.files[0])} 
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