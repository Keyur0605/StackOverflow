import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { CirclesWithBar } from 'react-loader-spinner';
import io from "socket.io-client"


import "./Chat.css"

var socket = io.connect("http://localhost:8000")
const Chat = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [data, setData] = useState()
  const [loader, setLoader] = useState(false)
  const [chatMessage, setChatMessage] = useState([])
  const [chatloader, setChatLoader] = useState(false)
  const [adminRoom, setAdminRoom] = useState('')
  const [admin, setAdmin] = useState()
  const [userList, setUserList] = useState([])
  const[privateGroup,setPrivateGroup]=useState(false)
  if (localStorage.getItem("user")) {
    const localdata = JSON.parse(localStorage.getItem("user"))
    var user_name = localdata.user
    var token = localdata.token
    
  }
  
  const Private=(name)=>{
    socket.emit("joinPrivateRoom",token,name)
  }

  const sendMeassge = (userName) => {
    if (!localStorage.getItem("user")) {
      navigate("/login")
    }
    else {
      try {
        const data = { message: text, name: user_name }
          socket.emit("message", data.name, text, adminRoom)
          setChatMessage((prev) => {
            return [...prev, data]
          })
          setText('')
      } catch (error) {
        console.log(error,"error");
      }

    }

  }

  const joinChat = () => {

    if (localStorage.getItem("user")) {
      try {
        const localdata = JSON.parse(localStorage.getItem("user"))
        const token = localdata.token
          socket.emit("joinRoom", token, adminRoom)
      } catch (error) {
        console.log(error,"error");
      }

    }
  }

  const joinPrivate=()=>{
    if (localStorage.getItem("user")) {
      try {
        const localdata = JSON.parse(localStorage.getItem("user"))
        const token = localdata.token
          socket.emit("joinPrivateRoom2", token)
          navigate("/privatechatuser")
      } catch (error) {
        console.log(error,"error");
      }

    }
  }

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login")
    }
    else {
      const Profile = () => {
        setLoader(false)
        try {
          const localdata = JSON.parse(localStorage.getItem("user"))
          const token = localdata.token
          fetch(`${process.env.REACT_APP_LINK}/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            }
          }).then(async (response) => {
  
            const Data = await response.json()
            setData(Data)
            setAdminRoom(Data.type)
            setAdmin(Data.admin)
            setLoader(true)
          }).catch((error) => {
            console.log(error);
            navigate("/servererror")
  
          })
        } catch (error) {
          console.log(error,"error");
          navigate("/servererror")
        }
       
      }
      const setUpEvent = () => {
        socket.on("addmessage", (message, name) => {
          const datas = { message, name }
          setChatMessage((prev) => {
            return [...prev, datas]
          })
        })
      }

      Profile()
      setUpEvent()
    }
  }, [])


  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login")
    }
    else {
      const chat = () => {
        try {
          setChatLoader(false)
          fetch(`${process.env.REACT_APP_LINK}/chat/${adminRoom}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${token}`
            }
          }).then(async (response) => {
            const res = await response.json()
            if (res.msg === "There is no message yet.") {
              setChatLoader(true)
              setChatMessage([])
            }
            else {
              setChatMessage(res)
              setChatLoader(false)
            }
          }).catch((error) => {
            console.log(error);
            setChatLoader(false)
          })
        } catch (error) {
          console.log(error,"error");
          navigate("/servererror")
        }

      }
      if (admin) {
        try {
          const userList = () => {
            fetch(`${process.env.REACT_APP_LINK}/chat/userlist/${adminRoom}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
              }
            }).then(async(response)=>{
                if(response.status === 204){
                setChatLoader(false)
                }
                const res = await response.json()
                setUserList(res)
                setLoader(true)
               
            }).catch((error)=>{
              console.log(error);
            })
          }
          userList()
        } catch (error) {
          console.log(error,"error");
        }
      }
      chat()


    }

    joinChat()

  }, [adminRoom])

  socket.on("block",(name)=>{
    if(user_name === name){
      navigate("/")
    }
  })

  const blockUser = async (userName) => {
    try {
      fetch(`${process.env.REACT_APP_LINK}/chat/block/${userName}/${adminRoom}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        }
      }).then(async (response) => {
        if (response.status === 204) {
          const updateBlock = userList.map((val) => {
            if (val.name === userName) {
              if(val.block === false){
                socket.emit("blockuser", userName);
                return { ...val, block: true };
              }
              else{
                return { ...val, block: false };
              }
            }
            return val
          })
          setUserList(updateBlock)
        }
      })
    } catch (error) {
console.log(error,"error");
    }
  }

  socket.on("isPrivateGroup",(bol)=>{
    setPrivateGroup(bol)
    
    
  })
 
  return (
    <>
      {loader ?
        <div className='sections'>
          <div className="container-fluid ">
            <div className="row">
             
              <div className="col-md-2 col-12 p-0"  style={{background:"#242124"}}>
                <section className='mt-4'>

               
                {admin ? <h4 className='text-center my-4 ' style={{ color: "white",fontSize:"27px",lineHeight:"1.5" }}>User List</h4> : ""}
                {admin ? <div style={{borderBottom:"1px solid gray"}}/>:""}
                
                {
                  admin && userList.length !== 0 ? userList.map((val, index) => {
                   
                    return (
                      <>
                  
                        {val.name !== user_name ? 
                        <div className='row px-4 pt-3' key={index}>
                          <div className="col-lg-8 col-md-7 col-6 ">
                        <NavLink to={`/privatechat/${val.name}`}>  <p style={{ color: "white" }} className='mt-2 ' onClick={()=>Private(val.name)}>{val.name}</p></NavLink> 
                          </div>
                           <div className="col-lg-4 col-md-5 col-6">
                           <button type='button' className={val.block ? "btn btn-success " : "btn btn-danger "} onClick={() => blockUser(val.name)}>{val.block ? "Unblock" : "Block"}</button>
                           </div>
                        
                       

                       <hr  style={{color:"white"}} className='mb-0'/>
                         
                        </div>
                       :""}
                      </>
                    )
                  }) : ""
                }
                 </section>
              </div>
              <div className="col-md-10 col-12">
                <div className="row">
                  <div className='mt-3 d-flex' style={{ borderBottom: "1px solid gray" }}>
                    {
                      data.picture === "" ? <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="..." width="55px" height="55px" style={{ borderRadius: "50%" }} /> : <img src={data.picture} alt="..." width="55px" height="55px" style={{ borderRadius: "50%" }} />
                    }

                    <div className='ms-3 mt-1'>
                      <h5 style={{ color: "white" }} className='text-capitalize mb-0'>{data.name}</h5>
                      <span className="dot"></span><span className='active-button'>Active Now</span>
                    </div>
                    <div className='ms-auto d-flex'>
                      {data.admin === true ?
                        <select className="form-select me-3 my-2" value={adminRoom} onChange={(e) => setAdminRoom(e.target.value)} required>
                          <option selected disabled value="">Choose...</option>
                          <option>Frontend Developer</option>
                          <option>Backend Developer</option>
                          <option>Tester</option>
                          <option>Non IT Field</option>
                          <option>Other</option>
                        </select> : ""}
                        {!admin && privateGroup === true ?<button className='btn btn-success me-3' style={{ height: "45px", marginTop: "12px", width: "130px" }} onClick={()=>joinPrivate()}>Private Chat</button> :""}
                      <NavLink to='/' className="mb-3"><button className='btn btn-primary ' style={{ height: "45px", marginTop: "12px", width: "130px" }}>Leave Chat</button></NavLink>

                    </div>
                  </div>
                  <div className="chat-convertation mt-2 scroll" >
                    <ul className='text'>
                      {chatloader === true ? <div style={{ height: "78vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h1 style={{ color: "white" }}>There is no Message Yet.</h1>
                        
                      
                      </div> :
                        chatMessage.map((val, index) => {
                          const { message, name } = val;
                          return (
                            <>
                              <li className={name !== user_name ? "left" : "right"} key={index}>{message} <span className='d-flex justify-content-end' style={{ fontSize: "12px" }}>{name}</span></li>
                            </>
                          )
                        })
                      }

                    </ul>
                  </div>

                </div>
                <div >
                  <form className='d-flex justify-content-center'>
                    <input type="text" placeholder='Message write here' className='w-75 mb-3 inputs' name='text' value={text} onChange={(e) => setText(e.target.value)} />
                    <button type='button' className='btn btn-primary my-3 ms-3' style={{ padding: "0px !important" }} onClick={sendMeassge}>Send</button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
        :
        <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CirclesWithBar
            height="100"
            width="100"
            color="#0d6efd"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            outerCircleColor=""
            innerCircleColor=""
            barColor=""
            ariaLabel='circles-with-bar-loading'
          /></div>
      }
    </>
  )
}

export default Chat
