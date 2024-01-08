import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const Protectrd = (props) => {
    const Cmp=props.Cmp
    const navigate=useNavigate()
    useEffect(() => {
    if(!localStorage.getItem("user")){
        navigate("/login")
    }
    }, [])
  return (
    <div>
      <Cmp/>
    </div>
  )
}

export default Protectrd
