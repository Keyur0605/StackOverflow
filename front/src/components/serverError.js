import React from 'react'
import { NavLink } from 'react-router-dom'

const ServerError = () => {
    return (
        <>
            <div className='body text-center ' style={{ justifyContent: "center" }}>

                <div >
                    <div className='d-flex justify-content-center ms-1' style={{ fontSize: "90px" }}>
                        <div className='me-2'>5</div>
                        <div className='me-2'>0</div>
                        <div >0</div>
                    </div>

                    <div className='mt-2'><h3>Sorry, unexpected error </h3></div>
                    <div className='mt-2 mb-2'><h5>We Are Working On Fixing the Problem Be back soon </h5></div>
                    <div><h5 style={{color:"red"}}>Please Our Web site Visit after some time </h5></div>
                    <div><h5 style={{color:"red"}}>🙏 Thank You for Visiting Our Web site </h5></div>
                    {/* <div ><NavLink to="/"><button className='btn btn-primary'>Back To Home Page</button></NavLink></div> */}
                </div>
            </div>
        </>
    )
}

export default ServerError;
