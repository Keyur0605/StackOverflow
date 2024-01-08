import React,{useState} from 'react'
import {  NavLink,useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import io from "socket.io-client"
import "./Ask.css"
import "./Profile.css"
var socket = io.connect("http://localhost:8000")
const ProfileCard = (props) => {
    const navigate=useNavigate()
    const [resetpassword, setResetPassword] = useState('')
    const [resetConfirmPassword, setResetConfirmPassword] = useState('')
     const resetPassword = (e) => {
         e.preventDefault()
 
         if (resetpassword !== resetConfirmPassword) {
             alert("password does not match")
         }
         else if (resetpassword === "" || resetConfirmPassword === "") {
             toast.error('Please Fill Password Details', {
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
             const item = { resetpassword }
             console.log(item);
             const localdata = JSON.parse(localStorage.getItem("user"))
             const token = localdata.token
             fetch(`${process.env.REACT_APP_LINK}/resetpassword`, {
                 method: "PATCH",
                 headers: {
                     "Content-Type": "application/json",
                     "Authorization": `${token}`
                 },
                 body: JSON.stringify(item)
             }).then((response) => {
                 console.log(response);
             }).catch((error) => {
                 console.log(error);
             })
         }
     }

     const privateChat=(name)=>{
        if(localStorage.getItem("user")){
            const localdata = JSON.parse(localStorage.getItem("user"))
                 const token = localdata.token
            socket.emit("joinPrivateRoom",token,name)
            navigate('/privatechat')
        }
     }
  return (
    <div>
      <div>
                 <section className="bg-light section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mb-4 mb-sm-5">
                                <div className="card card-style1 border-0">
                                    <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                        <div className="row align-items-center">
                                            <div className="col-5 offset-1">
                                                {props.picture === ""?    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="..." width="200px" height="200px" />: <img src={props.picture} alt='profile' width="300px" height="400px" />}
                                            </div>
                                            <div className="col-lg-6 px-xl-10">
                                              
                                                <ul className="list-unstyled mb-1-9">
                                                <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600" >Name:</span> <span className='text-capitalize'>{props.name}</span> </li>
                                                    <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600">Email:</span> {props.email}</li>
                                                    <li className="mb-2 mb-xl-3 display-28 text-capitalize"><span className="display-26 text-secondary me-2 font-weight-600 ">Gender:</span > {props.gender}</li>
                                                    <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600">Date Of Birth:</span> {props.dob}</li>
                                                    <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600">Type:</span> {props.type}</li>
                                                    <li className="display-28"><span className="display-26 text-secondary me-2 font-weight-600">Tags:</span>{props.tags.map((val, index) => <span className='me-3 profile-home mb-3' key={index}>{val.length === 0 ? "" : val}</span>)}</li>
                                                </ul>
                                               {props.update && props.reset ? <><NavLink to="/updateprofile"><button className='btn btn-info me-3 mt-3'>{props.update}</button></NavLink>
                                                <button className='btn btn-primary mt-3' data-bs-toggle="modal" data-bs-target="#exampleModal" >{props.reset}</button>
                                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Reset Password</h1>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <label className='form-label'>New Password</label>
                                                                <input type="password" name='password' className='form-control' value={resetpassword} onChange={(e) => setResetPassword(e.target.value)} required /> <br />
                                                                <label className='form-label'>Confirm Password</label>
                                                                <input type="password" name='Confirmpassword' value={resetConfirmPassword} className='form-control' onChange={(e) => setResetConfirmPassword(e.target.value)} required />
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                <button className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close"
                                                                    onClick={resetPassword}>Update Password</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div></>: <><button className='btn btn-primary' onClick={()=>privateChat(props.name)}>{props.message}</button>  <NavLink to="/chat"><button className='btn btn-warning'>Back To Chat</button></NavLink></>}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <ToastContainer />
                </section>
            </div>
    </div>
  )
}

export default ProfileCard
