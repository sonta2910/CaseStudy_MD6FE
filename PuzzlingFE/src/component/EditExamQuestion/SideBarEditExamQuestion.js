import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function SideBarEditExamQuestion(props) {
    const {setExam, exam} = props
    let {id} = useParams();
    const navigate = useNavigate();

    function addOneChoiceQuestion() {
        setExam(
            {
                ...exam,
                questions: [...exam.questions, {
                    level: "",
                    name: "",
                    questionType: "ONE_CHOICE",
                    options: []
                }]
            })
    }

    function addMultiChoiceQuestion() {
        setExam(
            {
                ...exam,
                questions: [...exam.questions, {
                    level: "",
                    name: "",
                    questionType: "MULTI_CHOICE",
                    options: [],
                }]
            }
        )
    }
    function deleteExamForm(){
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa?',
            showDenyButton: true,
            confirmButtonText: 'Đồng ý',
            icon: "warning",
            denyButtonText: 'Thoát',
            customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:8080/puzzling/exam/delete?examId=${id}`,
                    {
                        auth:JSON.parse(localStorage.getItem("auth"))
                    }
                ).then((response)=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đã xóa!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(r => r.isConfirmed).then(
                        () => navigate("/categories")
                    )
                }).catch((err)=>navigate(`/${err.response.status}`))
            } else if (result.isDenied) {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Chưa xóa!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(r => r.isConfirmed)
            }
        })
    }
    return (
        <div className="container">
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content rounded-modal shadow p-3 border-0 bg-img">
                    <div style={{display: "flex", justifyContent: "right"}} className="container">
                        <button className={"delete-btn animated wow fadeInUp"} type={'submit'}
                                onClick={deleteExamForm}>Xóa bài thi</button>
                    </div>
                    <h4>Vui lòng chọn loại câu hỏi bạn muốn:</h4>
                    <br/>
                    <div className={"row"}>
                        <div className={"col col-16"} style={{display: "flex", justifyContent: "left"}}>
                            <button className="gradientBtn animated wow fadeInUpy" onClick={addOneChoiceQuestion}>
                                Thêm câu hỏi lựa chọn một đáp án
                            </button>
                        </div>
                        <div className={"col col-16"} style={{display: "flex", justifyContent: "center"}}>
                            <button className="gradientBtn animated wow fadeInUpy" onClick={addMultiChoiceQuestion}>
                                Thêm câu hỏi lựa chọn nhiều đáp án
                            </button>
                        </div>
                        <div className={"col col-16"}
                             style={{display: "flex", justifyContent: "right"}}>
                            <button type="button" className="gradientBtn animated wow fadeInUpy"
                                    onClick={() => navigate(`/exam/edit/${exam.id}/search-add`)}>
                                Thêm câu hỏi từ bộ có sẵn
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}

export default SideBarEditExamQuestion;