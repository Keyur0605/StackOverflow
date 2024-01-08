import React from 'react'
import { NavLink } from 'react-router-dom'
import "./Error.css"
const ErrorPage = () => {
  return (
    <>
    <div className='body'>

    <div class="mainbox">
    <div class="err">4</div>
    <i class="far fa-question-circle fa-spin"></i>
    <div class="err2">4</div>
    <div className='msg'><h3>Page Not Found</h3></div>
    <div class="msg-1"><NavLink to="/"><button className='btn btn-primary'>Back To Home Page</button></NavLink></div>
      </div>
    </div>
    </>
  )
}

export default ErrorPage
