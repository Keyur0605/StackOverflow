import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import "./Ask.css"
import Multiselect from 'multiselect-react-dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Ask() {
 
  const [image, setImage] = useState('')
  const [addtag, setAddTag] = useState([])
  const [tags, setTags] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate=useNavigate()
  useEffect(()=>{
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
          console.log(error);
          navigate("/servererror")
        }
        
    }
  },[])
  

 

  const imagesAdd = (e) => {
    const render = new FileReader()
    render.readAsDataURL(e.target.files[0]);
    render.onload = () => {

      setImage(render.result)
    };
    render.onerror = (error) => {
      console.log(error);
    }
  }

  const add = (e) => {
    e.preventDefault()

    if (title === "" || description === "") {
      toast.error('Please Title and Body Filed', {
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
      const username= JSON.parse(localStorage.getItem("user"))
      const token=username.token
      const item = { title, description, image, tags }
      fetch(`${process.env.REACT_APP_LINK}/question/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        body: JSON.stringify(item)
      }).then((response) => {
        if(response.status === 401){
          toast.error('Please  Login', {
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
        setTags([])
        setTitle('')
        setDescription('')
        setImage('')
           navigate("/")

      }).catch((error) => {
        console.log(error);
        navigate("/servererror")
      })
    }

  }





  return (
    <>
      <Header />
      <div className="container">
        <div className="row">

          <div className="col-10 mx-auto">
            <div className='center-box'>
              <div className="main-box">
                <form>
                <div className="title-text">
                  <h3>Title</h3>
                  <span>Be Specific and imagine you are asking a question to another person</span>
                  <div className="mt-2  mb-4">
                    <input type="text" className="form-control" name='title' value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question Title" />
                   
                  </div>
                </div>

                <div className="description">
                  <h3>Body</h3>
                  <span>Include All The Information About Question</span>
                  <div className="mb-4 mt-2">
                    <textarea className="form-control" name='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description About The Question' rows="3"></textarea>
                    
                  </div>
                  <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Image Upload Not Neccessary</label>
                    <input className="form-control" type="file" onChange={imagesAdd} />
                    <img src={image} alt="" width="400px" />
                  </div>
                </div>


                <div className="tag">
                  <h3>Tags</h3>
                  <span>Add Up to 3 Tages to describe your question is about</span>
                  <div className='mt-3'>
                    
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
                </form>
                
              </div>
              <button onClick={add} className='mt-5 btn btn-primary mb-5'>Add Question</button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  )
}

export default Ask
