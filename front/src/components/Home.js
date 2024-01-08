import React, { useState, useEffect } from 'react'
import Header from './Header'
import { CirclesWithBar } from 'react-loader-spinner'
import "./Ask.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink,useNavigate } from 'react-router-dom';


const Home = () => {
  const [value, setValue] = useState([])
  const [option, setOption] = useState()
  const [tagSearch, setTagSearch] = useState()
  const [loader, setLoader] = useState(false)
  const [pageno, setPageNo] = useState(1)
  const [question, setQuestion] = useState([])
  const [totalPage, setTotalPage] = useState('')
  const [search, setSearch] = useState('')
const navigate = useNavigate()
  const prevpage = (e) => {
    e.preventDefault()
    if (pageno >= 2) {
      setPageNo(pageno - 1)
    }
  }
  const nextpage = (e) => {
    e.preventDefault()
    if (pageno === totalPage) {
      setPageNo(1)
    }
    else {
      setPageNo(pageno + 1)
    }
  }

 
  const data = async () => {
    try {
      const api = await fetch(`${process.env.REACT_APP_LINK}/tags/name`)
      const response = await api.json()
      setValue(response)
    } catch (error) {
      console.log(error);
      navigate("/servererror")
    }

  }

  const getQuestion = async () => {
    setLoader(true)
    try {
      const data = await fetch(`${process.env.REACT_APP_LINK}/question/list/${pageno}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      })
      const response = await data.json()
      setQuestion(response.allData)
      setTotalPage(response.total_page_no)
      setLoader(false)
    } catch (error) {
      setLoader(false)
      console.log(error);
      navigate("/servererror")
    }

  }
  const questionSearch = () => {
    try {
      console.log(search, "serach value");
      fetch(`${process.env.REACT_APP_LINK}/question/search/${search}/${pageno}`, {
        method: "GET"
      }).then(async (response) => {
        try {
          const data = await response.json()
          console.log(data);
          setQuestion(data.allData)
          setLoader(false)
          setSearch("")
          if (response.status === 404) {
            toast.error('🦄 Wow so easy!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        } catch (error) {
          console.log(error, "error");
        }

      }).catch((error) => {
        setLoader(false)
        console.log(error);
      })
    } catch (error) {
      console.log(error,"error");
    }
  }
  const getTagSearch = (e) => {
    try {
      e.preventDefault()
      setTagSearch(option)

      fetch(`${process.env.REACT_APP_LINK}/tags/${option}/${pageno}`, {
        method: "GET"
      }).then(async (response) => {
        console.log(response, "response");
        const res = await response.json()
        setQuestion(res.allData);
        setOption("")
      }).catch((error) => {
        console.log(error);
        setOption("")
      })
    }
    catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getQuestion()
    data()
  }, [pageno])



  return (
    <div>
      <Header />
      {
        loader === false ? (<div className="container">
          <div className="row">
            <div className="col-9 my-4 mx-auto">
              <div className="row">
                <div className=" col-xl-5 col-lg-4 col-md-6 col-10 ">
                  <input type="search" className='form-control mb-3' placeholder='Search Question Here ' value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-md-1 col-2 ">
                  <button className='btn btn-primary' type='submit' onClick={questionSearch}>Serach</button>
                </div>
                <div className="col-xl-3 col-lg-2 col-8 mx-auto">
                  <div className="dropdown">
                    <button className="btn btn-warning dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Search By Tag Name
                    </button>
                    <ul className="dropdown-menu " style={{}}>
                      <select onChange={(e) => setOption(e.target.value)} className='form-control mb-3'>
                        <option selected disabled value="">Search By Tag Name</option>
                        {
                          value.map((val, index) => <option key={index}>{val.name}</option>)
                        }
                      </select>
                      <button className='btn btn-primary d-block mx-auto' onClick={getTagSearch}>Search</button>
                    </ul>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-4 ms-auto ">
                  <button className='btn btn-danger' onClick={getQuestion}>Clear Filter</button>
                </div>
              </div>
              {
                question.length === 0 ? <h3 style={{ height: "80vh", display: "flex", justifyContent: "center ", alignItems: "center" }} >No Question Available.</h3> :
                  question.map((item, index) => {
                    const { _id, title, description, tags } = item
                    return <div className="title-home my-2" key={index}>
                      <NavLink to={`/question/${_id}`} style={{ textDecoration: "none", color: "black", fontSize: "21px" }}  >
                        <p className='text-capitalize question-title'>{title}</p>
                      </NavLink>
                      <p className='block-ellipsis'>{description ? description : ''}</p>
                      {tags ? tags.map((tag, index) => (
                        <span className="me-3 p-2 tag-home" key={index + 1}>
                          {tag}
                        </span>
                      )) : ''}
                    </div>
                  })
              }
              {
                question.length === 0 ? "" :
                  <div className='d-flex justify-content-end'>
                    <button className='btn btn-primary me-2' onClick={prevpage}>Prev</button>
                    <span className='mt-2' style={{ fontSize: "17px" }}>{pageno}</span>
                    <button className='btn btn-primary ms-2' onClick={nextpage}>Next</button>
                  </div>
              }
            </div>
          </div>
          <ToastContainer />
        </div>
        ) :
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
            /></div>
      }

    </div>
  )
}

export default Home
