import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Pagination from "../searchAddQuestion/Pagination";
 function History() {
    const [record, setRecord] = useState([{
        exam:{
            id:0,
            name:""
        },
        time:"",
        userPoint:0,
        user:{
            name:""
        }
    }]);
    const id = JSON.parse(localStorage.getItem("id"));
    const navigate = useNavigate();

    useEffect(() => {
            axios.get(`http://localhost:8080/puzzling/record/findRecordByUser/${id}`)
                .then((response) => {
                    setRecord(response.data)
                })
                .catch((error) => {
                    console.log(error.message)
                })
        }, []
    )
    return (
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content rounded-modal shadow p-4 border-0"
                 style={{ backgroundColor: "#bef6fd"}}>
                <div className={'col-lg-12'} style={{textAlign: "center"}}>
                    <h2 style={{fontWeight: "bold",fontSize:45}}>
                       Lịch sử thi
                        <br/>
                        <small className="text-muted" style={{fontSize:20}}>Án vào bài để xem chi tiết</small>
                    </h2></div>
                <div className={"col col-6"} style={{marginLeft:470}}>
                    <button style={{marginRight:150}} type="button" className="gradientBtn animated wow fadeInUpy">
                        <Link style={{ textDecoration: 'none',color:"white" }} to={"/"}> Trang chủ</Link>
                    </button>
                </div>
                <div
                    className={'row'}
                >
                </div>
                <div>
                </div>
                <br/>
                <div className="container table-light rounded-modal">
                    <div className=" col-12 container">
                        <div className="row gy-5">

                            {record&&
                                record.map((record) => (
                                    <div className={"col col-4 p-3 bg-lightblue"} style={{display:"flex",justifyContent:"center"}}
                                         key={record.id}
                                    >
                                        <button className={"btn btn-outline-dark"} style={{width:"300px"}}
                                                onClick={() => navigate("/record/"+record.id)}>
                                            <h4 style={{fontWeight: "bold"}}> Bài thi số: {record.exam.id}</h4>
                                            <hr/>
                                            <div>
                                                <h5>Tên bài thi: {record.exam.name}</h5>
                                                Thời gian ghi nhận: {record.time}
                                                <br/>
                                                Điểm của bạn: {Math.round(record.userPoint / record.examPoint * 100)}%
                                                <br/>
                                                Người tạo: {record.user.name}
                                                <br/>
                                            </div>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <br/>
                <br/>
            </div>
        </div>
    );
}
export default History;