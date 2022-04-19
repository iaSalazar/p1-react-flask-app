import React from 'react'
import Button from 'react-bootstrap/Button'
import VoiceList from './VoiceList'
import VoiceForm from './VoiceForm'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'


function VoiceHome(props) {
    console.log(props)
    const [click, setClick] = useState(1)
    const [infoClick, setInfoClick] = useState(1)

    
    const handleClick = () => setClick(!click)
    const handleInfoClick = () => setInfoClick(!infoClick)
    const {id_contest, url_contest} = useParams()

    let bannerLink=`/api/contests/${id_contest}/${url_contest}/banner`
    let bannerLink2='https://contests-voices.s3.amazonaws.com/contests/2/contest_banner/banner.jpg'
    const [banner, setBanner] = useState()

    
    useEffect(()=>{
      fetch(bannerLink).then((res) => res.text()).then((data)=>{
          var objectURL = data
          console.log(data)
          setBanner(objectURL)
      })
  
    },[])
//{display:flex; align-items:left padding:1rem}
//style='display:inline-block  jus'
  return (
    
    <div>
        <p>Concurso {url_contest}</p>
        <img src={banner} height="200" ></img>
        <div >
            <Button variant="primary" onClick={handleClick}> Agregar</Button> <span>    </span>
            <Button variant="primary" onClick={handleClick} > Info</Button>
            <p> </p>
            <p>Los usuarios pueden ver en el home las voces ya convertidas que han sido
subidas en la página de cada concurso y asi mismo pueden reproducir las voces</p>
        </div>
        {console.log(window.location.href)}
        {click? <VoiceList id={id_contest}/>: <VoiceForm id={id_contest}/>}

        
    </div>
  )
}

export default VoiceHome