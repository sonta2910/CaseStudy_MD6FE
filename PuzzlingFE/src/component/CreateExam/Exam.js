import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

export default function Exam() {
    const [exam, setExam] = useState({});
    const navigate = useNavigate();
    const [change, setChange] = useState(true)
    useEffect(() => {
            axios.get(`http://localhost:8080/puzzling/exam/randomExam`)
                .then((response) => {
                    setExam(response.data)
                })
                .catch((error) => {
                    console.log("error");
                })
        }, [change]
    )
    return (
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-modal shadow p-4 border-0 bg-img">
                <div
                    className={'row'}
                >
                    <div className={'col-lg-11'} style={{textAlign: "center"}}>
                        <h2 style={{fontWeight: "bold", fontSize: 45}}>
                            Giải đố ngẫu nhiên
                            <br/>
                        </h2>
                    </div>
                </div>
                <div>
                </div>
                <br/>
                <div className="container table-light rounded-modal">
                    <div className="col-12 container">
                        <div className="row gy-5">

                            {
                                <div className={"col col-4 p-3 bg-lightblue"}
                                     style={{display: "flex", justifyContent: "center"}}
                                     key={exam.id}
                                >
                                    <button className={"btn btn-outline-dark"} style={{width: "300px"}}
                                            onClick={() => navigate("/exam/do/" + exam.id)}>
                                        <h4 style={{fontWeight: "bold"}}> Bài thi số: {exam.id}</h4>
                                        <hr/>
                                        <div>
                                            <h5>Tên bài thi: {exam.name}</h5>
                                            Thời gian làm bài: {exam.time} phút
                                            <br/>
                                            {
                                                exam.questions && (
                                                    <div>
                                                        Số lượng câu hỏi:{exam.questions.length} câu
                                                    </div>
                                                )
                                            }
                                            <br/>
                                            Điểm tối thiểu: {exam.passScore}%
                                            <br/>
                                        </div>
                                    </button>
                                </div>
                            }
                        </div>
                        <button type="button" onClick={() => setChange((prevState) => !prevState)}
                                className="gradientBtn w-50 animated wow fadeInUp">
                            Tạo ngẫu nhiên
                        </button>
                    </div>
                </div>
                <br/>
                <br/>
            </div>
        </div>
    );

}

