import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { CirclesWithBar } from "react-loader-spinner";
import "./Ask.css";
const Question = () => {
  const navigate = useNavigate()
  const [question, setQuestion] = useState([])
  const [show, setShow] = useState(false)
  const [isLoading, setisLoading] = useState(false);
  const ask = () => {
    navigate("/ask");
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      getQuestion();
    }
  }, []);

  const getQuestion = async () => {
    setisLoading(true);
    try {
      const username = JSON.parse(localStorage.getItem("user"));
      const data = await fetch(`${process.env.REACT_APP_LINK}/question/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${username.token}`,
        },
      });
      const response = await data.json();
      setQuestion(response);
      setisLoading(false);
    } catch (error) {
      console.log(error);
    }
   
  };

  const hideshow = (id) => {
    setShow(id);
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-4 offset-2">
            <h4>Your Ask Question List</h4>
          </div>
          <div className="col-4 d-flex justify-content-end">
            <button
              onClick={ask}
              className="btn btn-primary d-flex justify-content-end"
            >
              Ask Question
            </button>
          </div>
          <div className="col-8 mt-3 mx-auto">
            {question.length !== 0 && isLoading  ? (
              <div
                style={{
                  height: "75vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
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
                  ariaLabel="circles-with-bar-loading"
                />
              </div>
            ) : question.length === 0 && !isLoading ? (
              <h1>No data Found</h1>
            ) : (
              question.map((val, index) => {
                const { _id, title, description, image, tags } = val;
                return (
                  <div className="my-4 card " key={index + 1}>
                    <div className="d-flex backgroundHeader">
                      <div className="col-11 heightForTitle">
                        <h5>{title}</h5>
                      </div>
                      <div className="col-1">
                        <button
                          className="btn btn-light"
                          onClick={() => hideshow(_id)}
                        >
                          ➕
                        </button>
                      </div>
                    </div>
                    {_id === show && (
                      <div>
                        <p className="description my-3">{description}</p>
                        <div className="p-3">
                          <img src={image} alt=" Code" width="100%" />
                        </div>
                        <div className="mt-4">
                          {tags.map((tag, tIndex) => (
                            <span className="mx-3 tag-home" key={tIndex}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          className="btn btn-danger my-3 me-3 d-block ms-auto"
                          onClick={() => setShow(false)}
                        >
                          Show Less
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>

  );
}


export default Question;
