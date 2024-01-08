import React, { useState, useEffect } from 'react'
import Multiselect from 'multiselect-react-dropdown';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Header from "./Header"
const UpdateProfile = () => {
    const [addtag, setAddTag] = useState([])
    const [tags, setTags] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [dob, setDob] = useState('')
    const [type, setType] = useState('')
    const [gender, setGender] = useState('')
    const [picture, setPicture] = useState('')
    const navigate= useNavigate()
    
    const imagesAdd = (e) => {
        const render = new FileReader()
        render.readAsDataURL(e.target.files[0]);
        render.onload = () => {

            setPicture(render.result)
        };
        render.onerror = (error) => {
            console.log(error);
        }
    }

    

    useEffect(() => {

            if(localStorage.getItem("user")){
                try {
                    const data = async () => {
                        let getadat = []
                        const api = await fetch(`${process.env.REACT_APP_LINK}/tags/name`)
                        const response = await api.json()
                        for (let index = 0; index < response.length; index++) {
                            let a = response[index]
                            getadat.push(a.name)
                        }
                        setAddTag(getadat)
                
                    }
                    data()

                } catch (error) {
                    navigate("/servererror")
                }
                const profile= async()=>{
                    try {
                        const localdata = JSON.parse(localStorage.getItem("user"))
                        const token = localdata.token
                        const api = await fetch(`${process.env.REACT_APP_LINK}/profile`, {
                           method: "GET",
                           headers: {
                               "Content-Type": "application/json",
                               "Authorization": `${token}`
                           }
                       })
                       const response =  await api.json()
                       console.log(response,"profile data");
                       setName(response.name)
                       setEmail(response.email)
                       setDob(response.dob)
                       setPicture(response.picture)
                       setType(response.type)
                       setGender(response.gender)
                       setTags(response.tags)
                    } catch (error) {
                        console.log(error);
                        navigate("/servererror")
                    }
               
                }
               
                profile()
            }
       
      
    }, [])

    const updateProfile = (e) => {
        e.preventDefault()
        if(name === "" || email === "" || dob === "" || gender === "" || type === ""){
            toast.error('Please Fill Profile Details', {
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
            const localdata= JSON.parse(localStorage.getItem('user'))
            const token=localdata.token
        const item = { name, email, dob, type, gender, tags ,picture}
        console.log(item, "user profile details");
        fetch(`${process.env.REACT_APP_LINK}/profile/update`,{
            method:"PUT",
            headers:{
              "Content-Type": "application/json",
              "Authorization": `${token}`
            },
            body:JSON.stringify(item)
        }).then((response)=>{
            setTags([])
            setDob("")
            setEmail("")
            setGender('')
            setName('')
            setType('')
            navigate('/profile')
        }).catch((error)=>{
            console.log(error);
            navigate("/servererror")
        })
    }
}

    return (
        <div >
            <Header/>
            <div className='container  d-flex justify-content-center my-5 ' style={{ height: "100vh" }}>
                <div className="row">
                    <div className="col-8 mx-auto">
                        <h2 className='text-center mb-3'>Update Profile Details Form</h2>
                        <form className="row g-3">
                            <div className="col-md-8 mx-auto">
                                <label className="form-label">UserName</label>
                                <input type="text" className="form-control" name='name' value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>

                            <div className="col-md-8 mx-auto">
                                <label className="form-label">E-mail</label>
                                <input type="email" className="form-control" name='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="col-md-8 mx-auto">
                                <label className="form-label">Profile Image</label>
                                <input className="form-control" type="file" onChange={imagesAdd} />
                                <img src={picture} className='mt-3' alt="" width="200px" />
                            </div>
                            <div className="col-md-8 mx-auto">
                                <label className="form-label">Date Of Birth</label>
                                <input type="date" className="form-control" name='dob' value={dob} onChange={(e) => setDob(e.target.value)} required />
                            </div>
                            <div className="col-md-8 mx-auto">
                                <label className="form-label">Type</label>
                                <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
                                    <option selected disabled value="">Choose...</option>
                                    <option>Frontend Developer</option>
                                    <option>Backend Developer</option>
                                    <option>Tester</option>
                                    <option>Non IT Field</option>
                                </select>
                            </div>
                            <div className="col-md-8 mx-auto">
                                <label className="form-label me-5">Gender</label>
                                <div className="form-check form-check-inline">

                                    <input className="form-check-input" type="radio" name="gender" value="male"  checked={gender === "male"} onChange={(e) => setGender(e.target.value)} required  />
                                    <label className="form-check-label" >
                                        Male
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} />
                                    <label className="form-check-label" >
                                        Female
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="gender" value="other" checked={gender === "other"} onChange={(e) => setGender(e.target.value)} />
                                    <label className="form-check-label">
                                        Other
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-8  mx-auto">
                                <div className="row">


                                    <div className="col-2">
                                        <label className='form-label'>Tag</label>
                                    </div>
                                    <div className="col-10">
                                        <Multiselect
                                            isObject={false}
                                            onRemove={(event) => setTags(event)}
                                            onSearch={(event) => event}
                                            options={addtag}
                                            selectedValues={tags}
                                            onSelect={(event) => setTags(event)}

                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-8 mx-auto">
                                <button className="btn btn-primary mb-4" type='submit' onClick={updateProfile}>Update Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default UpdateProfile
