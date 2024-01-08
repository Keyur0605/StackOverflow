import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [disable, setDisable] = useState(false)
    const[forget,setForget]=useState(false)
    const[forgetpass,setForgetpass]=useState(false)
    const [two, setTwo] = useState(false)
    const [otp, setOtp] = useState("")
    const [newpass, setNewPass] = useState("")
    const [cnewpass, setCNewPass] = useState("")
    const[token,setToken]=useState('')
    const[optDisable,setOtpDisable]=useState(false)
const navigate= useNavigate()
    const send = (e) => {
        e.preventDefault()
        let item = { email }

        if (email === "") {
            toast.error('Plz Enter Register Email Address ', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        else {
            fetch(`${process.env.REACT_APP_LINK}/forgetpassword/email`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(item)
            }).then(async(response) => {
                console.log(response,"response",response.status);
                if (response.status === 200) {
                    toast.success('OTP send ', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setDisable(true)
                   const jwt=await response.json()
                   setToken(jwt.token)
                   setOtpDisable(true)
                   setForget(true)


                }
                else if (response.status === 204) {
                    toast.error('E-mail Does Not Exist ', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }


    const otpsCheck = (e) => {
        e.preventDefault()
        if (otp === "") {
            toast.error('Please Enter OTP ', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        else {
            const item = { otp }
            fetch(`${process.env.REACT_APP_LINK}/forgetpassword/otp`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "POST",
                body: JSON.stringify(item)
            }).then((responce) => {
                if (responce.status === 200) {
                    toast.success('OTP match ', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setTwo(true)
                    setForget(true)
                    setForgetpass(true)
                }
                else if (responce.status === 204 || responce.status === 400) {
                    toast.error(' OTP Not Match', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }


    const setPassword=(e)=>{
        e.preventDefault()
        if(newpass === "" || cnewpass === ""){
            toast.error('Please Enter Form Details', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
        else if(newpass === cnewpass && newpass.length >= 6){
            const item = {newpass}
            fetch(`${process.env.REACT_APP_LINK}/forgetpassword/password`,{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                method: "PATCH",
                body: JSON.stringify(item)
            }).then((responce)=>{
                if(responce.status === 201){
                    navigate('/login')
                } 
                else if(responce.status === 204){
                    toast.error('Password Not Match', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    }); 
                }
            })
        }

        else if(newpass.length <=6){
            toast.error('Password length must be greter than 6 character ', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });  
        }
        else{
           
            toast.error('Enter same Password', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });  
        }
    }


    return (
        <>
        <Header/>
        
        <div className="container mt-5">
            <div className="row">
                <div className="col-7 mx-auto">
                  { two?"":
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" name="email" disabled={disable} placeholder='Enter Your Register Email Address' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {disable ? "" : <button type="submit" onClick={send} className="btn btn-primary mb-4">Send OTP</button>}
                    </form>}
                   
                   {two?"": <form>
                        <div className="mb-3">

                            <label htmlFor="exampleInputEmail1" className="form-label">OTP</label>
                            <input type="text" className="form-control" placeholder='Enter Your OTP' name='otp' value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </div>

                        <button type="submit" onClick={otpsCheck} disabled={optDisable?"":"otpDisable"} className="btn btn-primary mb-5"> OTP Verify</button>
                    </form>}

                    {forget && forgetpass &&<form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Set New Password</label>
                            <input type="password" className="form-control mb-4" name="newpass" placeholder='Enter Your New Password' value={newpass} onChange={(e) => setNewPass(e.target.value)} />
                            <input type="password" className="form-control" name="cnewpass" placeholder='Enter Your New Confirm  Password' value={cnewpass} onChange={(e) => setCNewPass(e.target.value)} />
                        </div>

                        <button type="submit" onClick={setPassword} className="btn btn-primary">send</button>
                    </form>}


                </div>
            </div>
            <ToastContainer />
        </div>
        </>
    )
}

export default ForgotPassword
