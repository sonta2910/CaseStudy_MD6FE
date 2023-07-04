import React from 'react';
import {Link} from "react-router-dom";

function HomePage() {
    return (
        <div>
            <div className="container-fluid mt-5 mb-5">
                <div className="row">
                    <div className="col-lg-1"/>
                    <div className="col-lg-5" style={{marginLeft: 45, marginTop: 45}}>
                        <h1 className="color-purple mt-5 animated wow fadeInDown delay-0-1s"
                        >
                            Puzzling
                        </h1>
                        <p className="animated wow fadeInDown delay-0-2s"
                           style={{fontSize: 20}}>
                            App Puzzling là ứng dụng học tập hỗ trợ người dùng có thể tự học hoặc tham gia vào các câu
                            đố nhóm, bài tập và bài thuyết trình trực tiếp từ xa. Ứng dụng được thiết kế để giúp bạn
                            tham gia vào các hoạt động nhóm và tự học bằng cách tạo và tổ chức các câu đố cho người khác
                            trả lời với đa dạng các chủ đề.
                        </p>
                    </div>
                    <div className="col-lg-5" style={{marginTop: 45}}>
                        <img
                            src="/images/right-img.png"
                            className="img-fluid animated wow pulse slow infinite"
                            alt={""}/>
                    </div>
                </div>
                <div className="float-left ml-5">
                    <img
                        src="/images/bottom-img.png"
                        className="img-fluid animated wow swing slower infinite"
                        alt={""}/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;