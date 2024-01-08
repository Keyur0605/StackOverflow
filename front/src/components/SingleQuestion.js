import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from './Header';
 import "./Ask.css"
import { CirclesWithBar } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
const SingleQuestion = () => {
  const { id } = useParams()
  const [text, setText] = useState('')
  const [commitDisplayText, setCommitDisplayText] = useState('')
  const [answerDisplayText, setAnswerDisplayText] = useState('')
  const [questionData, setQuestionData] = useState('')
  const [questionAnswer, setQuestionAnswer] = useState('')
  const [loader, setLoader] = useState(false)
  const [ques_id, setQues_id] = useState('')
  const [show, setShow] = useState(false)
  const [answerShow, setAnswerShow] = useState(false)
  const [commitError, setCommitError] = useState(true)
  const [answerError, setAnswerError] = useState(true)
  const [name, setName] = useState()
  const[answerCommit,setAnswerCommit]=useState('')
  const[answerCommitId,setAnswerCommitId]=useState('')
  
  const navigate = useNavigate()

  const commitSend = async () => {
    if (!localStorage.getItem("user")) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'You are not Login?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Login To Continue',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })

    }
    else {
      const username = JSON.parse(localStorage.getItem("user"))
      const token = username.token
      const u_name = username.user

      setName(u_name)
      setCommitDisplayText(text)
      console.log(name, "u_name");
      const item = { text, ques_id }
      setShow(true)
      fetch(`${process.env.REACT_APP_LINK}/commit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        body: JSON.stringify(item)
      }).then((response) => {
        if (response.status === 201) {
          setText("")
        }
        else if (response.status === 400) {
          setCommitError(false)
        }
      }).catch((error) => {
        console.log(error);
      })

    }
  }


  const answersend = async () => {
    if (!localStorage.getItem("user")) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'You are not Login?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Login To Continue',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })

    }
    else {
      const username = JSON.parse(localStorage.getItem("user"))
      const token = username.token
      const u_name = username.user
      setName(u_name)
      setAnswerDisplayText(questionAnswer)
      const item = { text: questionAnswer, ques_id: ques_id }
      setAnswerShow(true)
      fetch(`${process.env.REACT_APP_LINK}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        body: JSON.stringify(item)
      }).then((response) => {
        if (response.status === 201) {
          setQuestionAnswer("")
        }
        else if (response.status === 400) {
          setAnswerError(false)
        }
      }).catch((error) => {
        console.log(error);
      })

    }
  }

  const addAnswerCommit=()=>{
    if (!localStorage.getItem("user")) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      swalWithBootstrapButtons.fire({
        title: 'You are not Login?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Login To Continue',
        cancelButtonText: 'Cancel',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })

    }
    else {
  
      const username = JSON.parse(localStorage.getItem("user"))
      const token = username.token
      const item={text:answerCommit , ans_id:answerCommitId}
      fetch(`${process.env.REACT_APP_LINK}/answercommit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`
        },
        body: JSON.stringify(item)
      }).then((response) => {
        if (response.status === 201) {
          toast.success('Your Commit is Added ', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          setAnswerCommit("")
         
        }
        else if (response.status === 400) {
       alert("Plaese Fill Commit Section")
        }
      }).catch((error) => {
        console.log(error);
      })

    }

  }
 
  const getQuestionData = () => {
    fetch(`${process.env.REACT_APP_LINK}/question/${id}`, {
      method: "GET"
    }).then(async (response) => {
      const data = await response.json()
      setQuestionData(data)
      setQues_id(data.data._id)
      setLoader(true)
    }).catch((error) => {
      console.log(error, "Error");
    })
  }

  useEffect(() => {
    getQuestionData()

  }, [])

  
  return (
    <div>
<Header/>
      <div className="container">
        <div className="row">
          <div className="col-10 mx-auto">

            {
              loader ? <div className="card my-3">
                <div className="card-body">
                  <div className='d-flex justify-content-between'>
                    <div>
                      <label className='username'>Question Title</label>
                    </div>
                    <div className='d-flex'>
                      <span className='username'> UserName: <span className='text-capitalize' style={{ fontWeight: "normal" }}>{questionData.user_name}</span></span>
                    </div>

                  </div>
                  <p style={{ fontSize: "30px" }} className='text-capitalize'>{questionData.data.title}</p>
                  <label className='mb-1 username' >Question Description</label>
                  <p className='text-capitalize'>{questionData.data.description}</p>
                  <img src={questionData.data.image} alt='code' style={{maxWidth:"100%"}} />
                  <div className='mt-3' >

                    {
                      questionData.data.tags.map((val, index) => {
                        return (
                          <>
                            <span key={index} className='me-3 tag-home'>{val}</span>
                          </>
                        )
                      })
                    }
                  </div>

                  {/* Question Commits */}
                  <label className='username mt-3'>Question Commits</label>
                  <div className="commits my-2 ">
                    <div className="col-12">
                      {
                        questionData.commits.map((val, index) => {
                          return (
                            <>
                              <div className="specific-commit d-flex justify-content-between" key={index}>

                                <p className='ms-2 my-2 '>{val.text}</p>
                                <p className='username-commit me-4  my-2'> Commit by: <span className='text-capitalize mt-3' style={{ fontWeight: "normal", color: "red" }}>{val.userName}</span></p>
                              </div>
                            </>
                          )
                        })
                      }
                      {show && commitError ? <><div className='d-flex justify-content-between'>
                        <p className='ms-1 mt-3'>{commitDisplayText}</p>
                        <p className='username-commit me-4  my-2'> Commit by: <span className='text-capitalize mt-3' style={{ fontWeight: "normal",color: "red"  }}>{name}</span></p>

                      </div> </> : ""}
                    </div>

                  </div>


                  {/* Add Question */}
                  <form className='mt-3' >
                    <textarea className="form-control" name='text' placeholder='Add Your Commite' value={text} onChange={(e) => setText(e.target.value)} rows="3"></textarea>
                    {commitError ? "" : <p style={{ color: "red", fontSize: "17px" }} className='mt-2'> ** Please Fill Commit Section **</p>}
                    <button type='button' className='btn btn-primary mt-2' onClick={() => commitSend()}>Add Your Commit</button>
                  </form>





                  {/* Answer For Question */}
                  <label className='username mt-3 '>Answer For Question</label>
                  <div className="commits my-2 card">
                    <div className="col-12 ">
                      {
                        questionData.answers.map((val, index) => {
                          const{ans_commits}=val
                         
                          return (
                            <>
                              <div className='specific-commit' key={index}>
                                <div className=" d-flex justify-content-between" >
                                  <p className='ms-2 my-2 '>{val.text}</p>
                                  <p className='username-commit me-4  my-2'> Answer by: <span className='text-capitalize mt-3' style={{ fontWeight: "normal",color: "red"  }}>{val.userName}</span></p>
                                </div>
                                <p className='mb-2 ps-2 commit-answer'data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>setAnswerCommitId(val._id)} >Add To Commit</p>

                                {/* answers commits */}
                                {
                                  ans_commits.map((val,index)=>{
                                    const {text,userName}=val
                                    return(
                                      <>
                                      <div className="col-11  answer_commit offset-1" key={index}>
                                      <div className=" d-flex justify-content-between  mx-3" >
                                    
                                  <p className='ms-5 my-1 ' style={{fontSize:"13px"}}>{text}</p>
                                  <p className='answer-commit me-4  my-2'> Commit by: <span className='text-capitalize mt-3' style={{ fontWeight: "normal",color: "blue"  }}>{userName}</span></p>
                                  
                                </div>
                                </div>
                                      </>
                                    )
                                  })
                                }
                                
                              </div>
                            

                             {/* Answer Commit */}
                              <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1 className="modal-title fs-5" id="exampleModalLabel">Add Commit On Answer</h1>
                                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                    <textarea className="form-control" name='text' value={answerCommit} onChange={(e)=>setAnswerCommit(e.target.value)} placeholder='Add Your Commit'  rows="3"></textarea>
                                    </div>
                                    <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                      <button type="button" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close" onClick={addAnswerCommit}>Add Commit</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )
                        })
                      }
                    </div>

                    {answerShow && answerError ? <><div className='d-flex justify-content-between'>
                      <p className='ms-1 mt-3'>{answerDisplayText}</p>
                      <p className='username-commit me-4  my-2'> Answer by: <span className='text-capitalize mt-3' style={{ fontWeight: "normal",color:"red" }}>{name}</span></p>

                    </div> </> : ""}
                  </div>

                  {/* Add Answer  */}
                  <form className='my-3'>
                    <textarea className="form-control" name='text' placeholder='Add Your Answer' value={questionAnswer} onChange={(e) => setQuestionAnswer(e.target.value)} rows="3"></textarea>
                    {answerError ? "" : <p style={{ color: "red", fontSize: "17px" }} className='mt-2'> ** Please Fill answer Section **</p>}
                    <button type='button' className='btn btn-primary mt-2' onClick={() => answersend()}>Add Your Answer</button>
                  </form>

                </div>
                <ToastContainer/>
              </div>
                : <div style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            }

          </div>
        </div>
      </div>


    </div>
  )
}

export default SingleQuestion
