import React, { useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import Header from './Header';
// import { useFormik } from 'formik';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
//import {signUpSchema} from "../schema/validation"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//  const initialValues={
//   name:"",
//   email:"",
//   password:""

//  }
const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email("email not valid"),
  password: yup.string().required().min(6, "password must be at least 6 character"),

})

const Register = () => {

  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem("user")) {

    }
  }, [])
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => {
    console.log(data);
     fetch(`${process.env.REACT_APP_LINK}/register`,{
                method:"POST",
                headers:{
                  "content-type":"application/json"
                },
                body:JSON.stringify(data)
              }).then(async(response)=>{
                const msg= await response.json()
                console.log(msg,"msg");
                if(response.status === 201){
                  navigate('/login')
                }
                else if(response.status === 400){
                  toast.error(msg.msg, {
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
                else if(response.status === 409){
                  toast.error(msg.msg, {
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
              }).catch((error)=>{
                 console.log(error);
              })

  };




  return (
    <div>
      <Header />
      <div className='container mt-5'>
        <div className="row">
          <h2 className='text-center mb-3'>Sign Up</h2>
          <div className="col-5 mx-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder='user_name' {...register("name", { required: true, maxLength: 15 })} />
            <p style={{ color: "red" }}>{errors.name?.message}</p>
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder='email' {...register("email", { required: true })} />
            <p style={{ color: "red" }}>{errors.email?.message}</p>
          </div>
          <div className="mb-3 ">
            <input type="password" className="form-control" placeholder='password' {...register("password", { required: true, min: 6, max: 20 })} />
            <p style={{ color: "red" }}>{errors.password?.message}</p>
          </div>
          <div className="d-grid">
          <button type="submit" className="btn btn-primary">Submit</button>
          <NavLink to="/login"  className='mt-3'><span  style={{color:"#1976d2",textDecoration:"underline",float:"right"}}>Already have an account? Sign in</span></NavLink>
          </div>
        </form>
          </div>
        </div>

      </div>
      <ToastContainer />
    </div>
  )
}

export default Register
