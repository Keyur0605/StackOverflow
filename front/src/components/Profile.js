import React, { useEffect, useState } from 'react'
import { CirclesWithBar } from 'react-loader-spinner';
import ProfileCard from './ProfileCard'
import Header from './Header'

const Profile = () => {
    const [data, setData] = useState('')
    const [show,setShow] = useState(false)
    useEffect(() => {
       try {
            const localData = JSON.parse(localStorage.getItem("user"))
            const token = localData.token
            fetch(`${process.env.REACT_APP_LINK}/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                }
            }).then(async (response) => {

                const Data = await response.json()
                setData(Data)
                console.log(data,"data ");
                setShow(true)
            }).catch((error) => {
                console.log(error);
            })
        } catch (error) {
        console.log(error);
        }
        
    }, [])



    return (
        <>

            <Header />
            {/* <div>
                {show ? <section className="bg-light section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 mb-4 mb-sm-5">
                                <div className="card card-style1 border-0">
                                    <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                        <div className="row align-items-center">
                                            <div className="col-5 offset-1">
                                                {data.picture === "" ? <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="..." width="200px" height="200px" /> : <img src={data.picture} alt='profile' width="300px" height="400px" />}
                                            </div>
                                            <div className="col-lg-6 px-xl-10">
                                              
                                                <ul className="list-unstyled mb-1-9">
                                                <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600" >Name:</span> <span className='text-capitalize'>{data.name}</span> </li>
                                                    <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600">Email:</span> {data.email}</li>
                                                    <li className="mb-2 mb-xl-3 display-28 text-capitalize"><span className="display-26 text-secondary me-2 font-weight-600 ">Gender:</span > {data.gender}</li>
                                                    <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600">Date Of Birth:</span> {dateOfBirth}</li>
                                                    <li className="mb-2 mb-xl-3 display-28"><span className="display-26 text-secondary me-2 font-weight-600">Type:</span> {data.type}</li>
                                                    <li className="display-28"><span className="display-26 text-secondary me-2 font-weight-600">Tags:</span>{data.tags.map((val, index) => <span className='me-3 profile-home mb-3' key={index}>{val.length === 0 ? "" : val}</span>)}</li>
                                                </ul>
                                                <NavLink to="/updateprofile"><button className='btn btn-info me-3 mt-3'>Update Profile</button></NavLink>
                                                <button className='btn btn-primary mt-3' data-bs-toggle="modal" data-bs-target="#exampleModal" >Reset Password</button>
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
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <ToastContainer />
                </section>
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
                        />
                    </div>
                }


            </div> */}
            { show ? <ProfileCard  name={data.name} picture={data.picture} email={data.email} gender={data.gender} dob={data.dob} type={data.type} tags={data.tags} update="Update Profile"  reset="Reset Password"/> : <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            /></div>}
        </>
    )
}

export default Profile
