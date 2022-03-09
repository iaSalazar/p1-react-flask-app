import React from 'react'
import Voice from './Voice'
import {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import { useParams } from 'react-router-dom'


function VoiceList(props) {

  const {id_contest, url_contest} = useParams()
  const apiLink = `/api/contests/${id_contest}/voices`
  // const adminLink = "admin"
  //api/contests/${id_contest}
  
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
  return (
    <div>    
    <h1> {admin}</h1>
    
        <Table striped bordered hover>
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>email</th>
                <th>Audio</th>
            </tr>
        </thead>
        <tbody>
            {voices?.map((e,i) =>(<Voice voice={e} key={i} selected={handleSelected} remove={handleClick} id_contest={id_contest} url_contest={url_contest}/>))}
        </tbody>
        </Table>
        {click ? "":""}
    </div>
  )
}

export default VoiceList