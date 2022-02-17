import React from 'react'
import {useState} from 'react'
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
  formData.append("form", description)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData);
  }

  return (
    <div>C
    
    <label>
      Contest Name
      <input name="name" onChange={handleChange} />
    </label>
    <br />
    <label>
      Identifier
      <input name="url" onChange={handleChange} />
    </label>
    <input
          filename={file} 
          onChange={e => setFile(e.target.files[0])} 
          type="file" 
          accept="image/*"
    ></input>
    <br />
    <button onClick={handleSubmit}>Submit</button>
      
      
    </div>
  )
}

export default ConcursoForm