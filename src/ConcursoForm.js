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
  const [form, updateForm] = useState(initialFormData)
  const [click, setClick] = useState(0)
  const [file, setFile] = useState()

  const handleChange = (e) => {
    updateForm({
      ...form,
      [e.target.name]: e.target.value.trim()
    })
  }
  const handleFile = (e) =>{
    setFile(e.target.files(0))
  }
//the form data is all the collected form information and image banner
  const formData = new FormData()
  formData.append("file", file)
  formData.append("form", form)

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
      <input name="name" onChange={handleChange} />
    </label>
    <br />
    <label>
      Identificador
      <input name="url" onChange={handleChange} />
    </label>
    <label>
      Fecha Inicio
      <input name="date_start" onChange={handleChange} type="date" />
    </label>
    <label>
      Fecha Fin
      <input name="date_end" onChange={handleChange} type="date" />
    </label>
    <label>
      Premio
      <input name="pay" onChange={handleChange} type="number"/>
    </label>
    <label>
      Guión
      <textarea name="script" onChange={handleChange} type="textarea" rows="7" cols="70"/>
    </label>
    <label>
      Tips
      <textarea name="tips" onChange={handleChange} type="textarea" rows="7" cols="70"/>
    </label>
    <label>
      Banner
      <input
            filename={file} 
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