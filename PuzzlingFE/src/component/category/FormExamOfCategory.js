import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Pagination from "../searchAddQuestion/Pagination";
import { useParams } from 'react-router-dom';

export default function FormExamOfCategory() {
    const isQuizPage = JSON.parse(localStorage.getItem("isQuizPage"));
    const { categoriesId } =useParams();
    const [exam, setExam] = useState([]);
    const [category,setCategory] = useState({
        name:"",
        picture:""
    })
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [ElementPerPage] = useState(6)
    const indexOfLastElement = currentPage * ElementPerPage;
    const indexOfFirstElement = indexOfLastElement - ElementPerPage;
    const currentElements = exam.slice(indexOfFirstElement, indexOfLastElement);
    const paginate = pageNumber => setCurrentPage(pageNumber);
    console.log(categoriesId)
    useEffect(() => {
        if(isQuizPage) {
            axios.get(`http://localhost:8080/puzzling/exam/searchExamsByCategory?categoriesId=${categoriesId}`)
                .then((response)=>{
                    setExam(response.data)
                })
                .catch((error) => {
                    navigate(`/${error.response.status}`)
                })
        }else{
            axios.get(`http://localhost:8080/puzzling/exam/searchExamsByCategoryAndUser?categoriesId=${categoriesId}&account=${JSON.parse(localStorage.getItem("id"))}`)
                .then((response) => {
                    setExam(response.data)
                })
                .catch((error) => {
                    navigate(`/${error.response.status}`)
                })
        }
            axios.get(`http://localhost:8080/puzzling/categories/${categoriesId}`)
                .then((response) => {
                    setCategory(response.data)
                })
                .catch((error) => {
                    navigate(`/${error.response.status}`)
                })
        }, [categoriesId]
    )
    return (
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-modal shadow p-4 border-0 bg-img">
                <div
                    className={'row'}
                >
                    <div className={'col-lg-11'} style={{textAlign: "center"}}>
                        <h2 style={{fontWeight: "bold", fontSize: 45}}>
                            Bài thi chủ đề {category.name} của bạn
                            <br/>
                        </h2></div>
                    {!isQuizPage && (
                        <div className=" text-center col-lg-1" style={{float: "right", paddingRight: "50px"}}>
                            <Link to={"/exam/create"}>
                                <i className={"fa fa-plus-circle"} style={{fontSize: 60}}></i>
                            </Link>
                        </div>
                    )}
                </div>
                <div>
                </div>
                <br/>
                <div className="container table-light rounded-modal">
                    <div className=" col-12 container">
                        <div className="row gy-5">

                            {currentElements&&
                                currentElements.map((item) => (
                                    <div className={"col col-4 p-3 bg-lightblue"}
                                         style={{display: "flex", justifyContent: "center"}}
                                         key={item.id}
                                    >
                                        {!isQuizPage ? (
                                            <button className={"btn btn-outline-dark"} style={{width: "300px"}}
                                                    onClick={() => navigate("/exam/edit/" + item.id)}>
                                                <h4 style={{fontWeight: "bold"}}> Bài thi số: {item.id}</h4>
                                                <hr/>
                                                <div>
                                                    <h5>Tên bài thi: {item.name}</h5>
                                                    Thời gian làm bài: {item.time} phút
                                                    <br/>
                                                    Điểm tối thiểu: {item.passScore}%
                                                    <br/>
                                                    Người tạo: {item.user.name}

                                                </div>
                                            </button>
                                        ):
                                            (
                                                <button className={"btn btn-outline-dark"} style={{width: "300px"}}
                                                        onClick={() => navigate("/exam/do/" + item.id)}>
                                                    <h4 style={{fontWeight: "bold"}}> Bài thi số: {item.id}</h4>
                                                    <hr/>
                                                    <div>
                                                        <h5>Tên bài thi: {item.name}</h5>
                                                        Thời gian làm bài: {item.time} phút
                                                        <br/>
                                                        Điểm tối thiểu: {item.passScore}%
                                                        <br/>
                                                    </div>
                                                </button>
                                            )}

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <br/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                    <Pagination
                        elementPerPage={ElementPerPage}
                        totalElements={exam.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                    </div>
                    )
                <br/>
            </div>
        </div>
    );
}