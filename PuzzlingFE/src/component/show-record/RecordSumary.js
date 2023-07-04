import React, {useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
function RecordSumary(props) {
    const navigate = useNavigate();
    const {record} = props
    let percentPoint = Math.round(record.userPoint / record.examPoint * 100)
    let pass = percentPoint >= record.exam.passScore
    return (
        <div className="modal-dialog modal-lg" role="document" style={{fontSize: 18}}>
            <div className="modal-content rounded-modal shadow p-4 border-0 bg-img">
                <h2 style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}>Kết quả bài thi</h2>
                <br/>
                <div style={{marginLeft: 40}}>
                    <div className="row mt-2">
                        <div className="col " style={{fontWeight: "bold"}}>
                            Tên bài thi:
                        </div>
                        <div className="col">
                            {record.exam.name}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col " style={{fontWeight: "bold"}}>
                            Người thực hiện:
                        </div>
                        <div className="col">
                            {record.user.name}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col" style={{fontWeight: "bold"}}>
                            Thời điểm ghi nhận:
                        </div>
                        <div className="col">
                            {record.time}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col" style={{fontWeight: "bold"}}>
                            Tổng điểm bài thi:
                        </div>
                        <div className="col">
                            {record.examPoint}
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col" style={{fontWeight: "bold"}}>
                            Số điểm làm được:
                        </div>
                        <div className="col">
                            {record.userPoint}
                        </div>
                    </div>
                    <div className="row mt-2 mb-5">
                        <div className="col" style={{fontWeight: "bold"}}>
                            Kết quả:
                        </div>
                        <div className="col">
                            {pass ? "Đạt " : "Không đạt "}
                            ({percentPoint}%)
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className={"col col-6"}>
                        <button onClick={() => props.check()} style={{marginLeft: 150}} type="button"
                                className="gradientBtn animated wow fadeInUpy">
                            Xem chi tiết
                        </button>
                    </div>
                    <div className={"col col-6"}>
                        <button style={{marginRight: 150}} type="button" className="gradientBtn animated wow fadeInUpy">
                            <Link style={{textDecoration: 'none', color: "white"}} to={"/"}> Trang chủ</Link>
                        </button>
                    </div>
                </div>

                <div className={"col col-6 mt-4"}>
                    <button onClick={()=> navigate("/exam/leaderBoard/"+record.exam.id)} style={{marginLeft:240}} type="button" className="gradientBtn animated wow fadeInUpy">
                        LeaderBoard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RecordSumary;