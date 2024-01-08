import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import io from "socket.io-client"


var socket = io.connect("http://localhost:8000")
const PrivateChatAdmin = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const [chatMessage, setChatMessage] = useState([])
  const [text, setText] = useState('')

  if (localStorage.getItem("user")) {
    const localdata = JSON.parse(localStorage.getItem("user"))
    var user_name = localdata.user
    var token = localdata.token

  }
  const sendMeassge = () => {
    if (!localStorage.getItem("user")) {
      navigate("/login")
    }
    else {
      try {
        const data = { message: text, name: user_name }
        socket.emit("privateMessage", text, token, name)
        setChatMessage((prev) => {
          return [...prev, data]

        })
        setText('')
      } catch (error) {
        console.log(error, "error");
      }

    }

  }

 const setup=()=>{
    socket.on("privateaddmessage", (message, name) => {
      console.log("dszfgvh");
        const datas = { message, name }
        setChatMessage((prev) => {
            return [...prev, datas]
        })
    })
}
useEffect(()=>{
    setup()
},[])

const leaveChat=()=>{
  socket.emit("deleteChat",name)
  navigate("/chat")
}

  return (
    <>
      {/* {loader ? */}
      <div className='sections'>
        <div className="container-fluid ">
          <div className="row">

            <div className=" col-12">
              <div className="row">
                <div className='mt-3 d-flex' style={{ borderBottom: "1px solid gray" }}>
                  <div className='ms-3 mt-1'>
                    <h5 style={{ color: "white" }} className='text-capitalize mb-0'>{name}</h5>
                    <span className="dot"></span><span className='active-button'>Active Now</span>
                  </div>
                  <div className='ms-auto d-flex'>
                    <button className='btn btn-primary me-3  mb-3' style={{ height: "45px", marginTop: "12px", width: "130px" }} onClick={()=>leaveChat()}>Leave Chat</button>

                  </div>
                </div>
                <div className="chat-convertation mt-2 scroll" >
                  <ul className='text'>
                    {
                      chatMessage.map((val, index) => {
                        const { message, name } = val;
                        return (
                          <>
                            <li className={name !== user_name ? "left" : "right"} key={index+1}>{message} <span className='d-flex justify-content-end' style={{ fontSize: "12px" }}>{name}</span></li>
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
      {/* :
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
      } */}
    </>
  )
}

export default PrivateChatAdmin
