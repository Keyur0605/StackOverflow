import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useFormik } from 'formik';
import { login } from "../schema/validation"
import Cookies from "universal-cookie"
import { CirclesWithBar } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const initialValues = {
  email: "",
  password: ""

}

const Login = () => {
  const navigate = useNavigate()
  const[loader,setLoader]=useState(false)
  const[dataLoader,setDataLoader]=useState(false)
  const cookies = new Cookies()
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate('/')
    }
  }, [])
  const { values, handleBlur, touched, handleSubmit, handleChange, errors,isValid,dirty } = useFormik({
    initialValues: initialValues,
    validationSchema: login,
    onSubmit: (values, action) => {

      action.resetForm()
      setDataLoader(false)
      fetch(`${process.env.REACT_APP_LINK}/login`, {
        method: "POST",

        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(values)
      }).then(async (response) => {
        const token = await response.json()
        if(response.status === 201){
          let user = token.name
          cookies.set('jwt', token.token, { path: ' /' })
          localStorage.setItem(`user`, JSON.stringify({ user, token: token.token }))
          setLoader(true)
          setDataLoader(true)
          navigate("/")
        }
        else if(response.status === 401){
          toast.error(token.msg, {
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
  })


  return (
    <div>
      <Header />
      {loader ? <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
          /></div>:<div className="container mt-5">
        <div className="row">
          <div className="col-4 mx-auto">
            <form onSubmit={handleSubmit}>
               <h3 className='text-center'>Sign in</h3>
              <div  className='mt-5'>
                <input type="email" className="form-control " placeholder='Email' name='email' value={values.email} onChange={handleChange} onBlur={handleBlur} />
                {errors.email && touched.email ? <p style={{ color: "red" }} className='mb-0'>{errors.email}</p> : null}
              </div>
              <div className='mt-3'> 
                <input type="password" className="form-control" placeholder='Password' name='password' value={values.password} onChange={handleChange} onBlur={handleBlur} />
                {errors.password && touched.password ? <p style={{ color: "red" }} className='mb-0'>{errors.password}</p> : null}
              </div>
              <div className='d-grid' >
               {dataLoader? "" : <button type="submit" className='btn btn-primary mt-4 d-block ' disabled={!(isValid && dirty)} >Sign In</button>}
              </div>
            </form>
            <div className='d-flex justify-content-between'>
              <NavLink to="/forgotpassword"><p className=' mt-4 ' style={{color:"#1976d2",textDecoration:"underline"}}>Forget Password</p></NavLink>
              <NavLink to="/register"><p className=' mt-4 ' style={{color:"#1976d2",textDecoration:"underline"}}>Don't have an account? Sign Up</p></NavLink>
            </div>
           
           
          </div>
        </div>
      </div>}
      <ToastContainer/>
    </div>
  )
}

export default Login
