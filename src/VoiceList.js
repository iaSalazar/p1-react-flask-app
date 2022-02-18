import React from 'react'
import Voice from './Voice'
import {useState, useEffect} from 'react'


function VoiceList() {

  const apiLink = "/api/contests/1/voices"
  // const adminLink = "admin"

  const [voices, setVoices] = useState([])
  const [click, setClick] = useState(0)
  const [admin, setAdmin] = useState()
 
  useEffect(() =>{
    
      fetch(apiLink).then((res) => res.json()).then( (apires) => {
          console.log(apires)
          setVoices(apires)
      })
    //   fetch(adminLink).then((res) => res.json()).then( (apires) => {
    //       console.log(apires)
    //       setAdmin(apires)
    //   })
  },[])

  const handleClick = () => setClick(!click)
  const handleSelected = (concurso) => {  setSelected(concurso)
                                          setClick(!click)}
    const initialState={
        name:"Concurso",
        admin: "Admin"
    }
    const [admin, setAdmin] = useState()
  return (
      <div>    
    <h1> {admin}</h1>
        <Table striped bordered hover>
        <thead>
            <tr>
                <td>#</td>
                <th>Nombre</th>
                <th>email</th>
                <th>Audio</th>
            </tr>
        </thead>
        <tbody>
            {voices?.map((e,i) =>(<Voice voice={e} id={i} selected={handleSelected} remove={handleClick} />))}
        </tbody>
        </Table>
        {click ? "":""}
    </div>
  )
}

export default VoiceList