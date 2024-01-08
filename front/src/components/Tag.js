import React, { useState, useEffect } from 'react'
import Header from './Header'
import "./Ask.css"
const Tag = () => {

  
  const [tags, setTags] = useState([])
  const [noData,setNoData]=useState(false)
  const data = async () => {
    try {
      const api = await fetch(`${process.env.REACT_APP_LINK}/tags`)
      const response = await api.json()
      setTags(response)
    } 
    catch (error) {
      console.log(error);
      setNoData(true)
    }
  }
  
  useEffect(() => {
     data()
  }, [])
 
  return (
    <div>
      <Header />
      <div className="container">
        <div className="row">
         
            { noData ?  <h3 style={{ height: "80vh", display: "flex", justifyContent: "center ", alignItems: "center" }} >No Tags Available.</h3>  :
              tags.map((val, index) => {
                const {name,description}=val
                return (
                  <>
                  <div className="col-3 mx-auto my-3" key={index}>
                    <div className="card" style={{width:"18rem"}}>
                      <div className="card-body">
                      <h6 className="card-title" style={{background:"#e1ecf4",display:"inline-block",padding:"10px",borderRadius:"10px",color:"#39739d",cursor:"pointer"}}>{name}</h6>
                        <div className='asdf'>
                        <p className="card-text" style={{fontSize:"15px"}}>{description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )
              })
            }
          </div>
        </div>
      </div>
 
  )
}

export default Tag
