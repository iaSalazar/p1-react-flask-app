import React from 'react'
import Voice from './Voice'
import {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import { useParams } from 'react-router-dom'
import VoiceSelected from './VoiceSelected'


function VoiceList(props) {

  const {id_contest, url_contest} = useParams()
  const apiLink = `/api/contests/${id_contest}/voices`
  // const adminLink = "admin"
  //api/contests/${id_contest}
  //{id: 1, first_name: "empty", last_name: "list", email: "no@mail.com", transformed: "./"}
  const [voices, setVoices] = useState([])
  const [click, setClick] = useState(0)
  const [admin, setAdmin] = useState()
  const [selected, setSelected] = useState()
 
  useEffect(() =>{
      console.log("aa")
      fetch(apiLink).then((res) => res.json()).then( (apires) => {
          console.log(apires)
          setVoices(apires)
          
      })
    //   fetch(adminLink).then((res) => res.json()).then( (apires) => {
    //       console.log(apires)
    //       setAdmin(apires)
    //   })
  },[admin])

  const handleClick = () => setClick(!click)
  const handleSelected = (concurso) => {  setSelected(concurso)
                                          setClick(!click)
                                          console.log(`This is ${selected}`)}
    const initialState={
        name:"Concurso",
        admin: "Admin"
    }
    //{click ? <VoiceSelected key={1} voice={selected}/>:""}
  return (
    <div>    
    <h1> {admin}</h1>
        {click ? <VoiceSelected key={1} voice={selected}/>:""}
        <Table striped bordered hover>
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>email</th>
                <th>Transformed</th>
                <th>Audio</th>
            </tr>
        </thead>
        <tbody>
            {voices?.reverse().map((e,i) =>(<Voice voice={e} key={i} selected={handleSelected} remove={handleClick} id_contest={id_contest} url_contest={url_contest}/>))}
        </tbody>
        </Table>
        
    </div>
  )
}

export default VoiceList