import React, {useEffect, useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2"
import * as Yup from 'yup'


function closeNav() {
    document.getElementById("mySidenav").style.cssText = "width:0; border:none; box-shadow: none;";
}

function openNav() {
    document.getElementById("mySidenav").style.cssText = "width:270px; border-right: 10px solid #fff; box-shadow: 1px 8px 8px 8px rgba(73,21,155,0.3); -webkit-box-shadow: 1px 8px 8px 8px rgba(73,21,155,0.3);  -moz-box-shadow: 1px 8px 8px 8px rgba(73,21,155,0.3);";
}

function SideNavBar() {
    const id = JSON.parse(localStorage.getItem("id"))
    const navigate = useNavigate();
    const [account,setAccount]=React.useState({
        username:"",
        user:{
            avatar:""
        }
    })
    const validation = Yup.object().shape({
        username: Yup.string().required("Không được để trống!")
            .min(6, "Tối thiểu là 6 ký tự!!")
            .max(32, "Tối đa 32 ký tự!")
            .test("username", "Tên người dùng đã tồn tại", async function (username) {
                return axios.get("http://localhost:8080/puzzling/check?username=" + username)
                    .then(
                        () => true
                    ).catch(
                        () => false
                    )
            })
        ,
        password: Yup.string().required("Không được để trống!").min(6, "Tối thiểu là 6 ký tự!"),
        confirmPassword: Yup.string().required("Không được để trống!").min(6, "Tối thiểu là 6 ký tự!").max(32, "Tối đa 32 ký tự!").oneOf([Yup.ref('password'), null], 'Mật khẩu không trùng nhau!'),
        user: Yup.object().shape({
            email: Yup.string().required("Không được để trống!").email("Định dạng email chưa đúng")
                .test("username", "Trùng email", async function (email) {
                    return axios.get("http://localhost:8080/puzzling/checkEmail?email=" + email)
                        .then(
                            () => true
                        ).catch(
                            () => false
                        )
                })
        })

    })
    useEffect(()=>{
        if(id) {
            axios.get("http://localhost:8080/puzzling/" + id).then(
                (response) => setAccount(response.data)
            ).catch((err) => navigate(`/${err.response.status}`))
        }
    },[])
    return (
        <div>
            {/*Side Bar*/}
            <div id="mySidenav" className="sidenav">
                <Link to={"#"} className="closebtn " onClick={closeNav}>
                    <i className="fa fa-arrow-left" style={{marginRight: 10, fontSize: 25}}/>
                </Link>
                {id &&
                    <Link to="/profile" className="" onClick={closeNav}>
                        <img
                            src={account.user.avatar}
                            className="user-profile shadow img-fluid rounded-circle ml-3"
                            alt={""}/>
                    </Link>
                }
                {
                    id &&
                    (
                        <Link to="" className="text-white text-left">
                            <small><p>Hello {account.user.name}</p></small>
                        </Link>
                    )
                }
                {id &&(<Link to="/categories" onClick={closeNav}>
                    <i className="fa fa-th-large text-white mr-3"/>
                    Quản lý bài thi
                </Link>)}
                <Link to="/doAQuiz" onClick={closeNav}>
                    <i className="fa fa-question text-white mr-3"/>
                    Giải câu đố
                </Link>
                <Link to="/exam/randomExam" onClick={closeNav}>
                    <i className="fa fa-random text-white mr-3"/>
                    Giải đố ngẫu nhiên
                </Link>
                {id&&(<Link to="/history" onClick={closeNav}>
                    <i className="fa fa-history text-white mr-3"/>
                    Lịch sử thi
                </Link>)}
                {
                    id != null && (
                        <Link to={"/profile"} onClick={closeNav}>
                            <i className="fa fa-user-o text-white mr-3"/>
                            Thông tin cá nhân
                        </Link>
                    )
                }
                {
                    id != null && (
                        <Link to="/" onClick={logout}>
                            <i className="fa fa-power-off text-white mr-3"/>
                            Đăng xuất
                        </Link>
                    )
                }
            </div>
            {/*Nav Bar*/}
            <nav className="navbar navbar-expand-lg">
                <div className="container" style={{textAlign:"center"}}>
                    <span className="menu" onClick={openNav}>
                        <i className="fa fa-list"
                           style={{fontSize: 30, color: "#001fb2"}}/>
                        <span style={{fontSize: 18, marginBottom: 50, color: "#001fb2", fontWeight: "bold"}}>&nbsp;&nbsp;Menu</span>
                    </span>
                    <Link className="zIndex-1 ml-n5 mr-5" to="/">
                        <img
                            src="/images/logo-puzzling.png" alt={""}
                            className="logo-picture d-none d-sm-none d-md-block ml-n5 mr-5"
                        />
                    </Link>
                    {id === null && <ul className="nav">
                        <li className="nav-item" onClick={openLogin}>
                            <Link to={"#"}
                                  className="nav-link cursor-pointer"
                                // data-toggle="modal"
                                // data-target="#loginModal"
                                // data-whatever=""
                            >
                                <p style={{color: "#001fb2", fontWeight: "bold"}}>Đăng nhập</p>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link" href="#">
                                <p style={{color: "#001fb2", fontWeight: "bold"}}>|</p>
                            </span>
                        </li>
                        <li className="nav-item" onClick={openSignUp}>
                            <div
                                className="nav-link cursor-pointer"
                                // data-toggle="modal"
                                // data-target="#signUpModal"
                                // data-whatever=""
                            >
                                <p style={{color: "#001fb2", fontWeight: "bold"}}>Đăng ký</p>
                            </div>
                        </li>
                    </ul>}
                    {id !== null &&
                        <Link className="mt-4" to="/" onClick={closeNav}>
                            <p style={{color: "#001fb2", fontWeight: "bold"}}>Trang chủ</p>
                        </Link>
                    }
                </div>
            </nav>
            {/*Login Modal*/}
            <div
                className="modal mt-5"
                id="loginModal"
                // tabIndex={-1}
                // role="dialog"
                // aria-labelledby="exampleModalLabel"
                // aria-hidden="true"
            >
                <div className="modal-dialog mt-5" role="document">
                    <div
                        className="modal-content rounded-modal shadow p-3"
                        style={{marginTop: "4rem"}}
                    >
                        <center>
                            <span className="loginSquare mt-n5">
                                <p className="text-white" id="exampleModalLabel">
                                    Đăng nhập
                                </p>
                            </span>
                        </center>
                        <div className="modal-header border-0 p-0">
                            <button onClick={closeLogin}
                                    type="submit"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Formik initialValues={{
                                username: "",
                                password: ""
                            }}
                                    onSubmit={(values) => {
                                        login(values)
                                    }}
                            >
                                <Form>
                                    <center>
                                        <div className="form-group input-group w-75 animated wow fadeInDown delay-0-1s">
                                            <Field
                                                type="text"
                                                className="form-control textfield-rounded shadow-sm p-3 mb-3 zIndex-1"
                                                id="username"
                                                placeholder="Username"
                                                name="username"
                                            />
                                            <div className="input-group-append z-Index-2">
                                            <span>
                                                <img src="/images/right-icon.png" className="ml-n6" alt={""}/>
                                                <i className="fa fa-user-o ml-n4-1 text-white"/>
                                            </span>
                                            </div>
                                        </div>
                                        <div className="form-group input-group w-75 animated wow fadeInDown delay-0-2s">
                                            <div className="input-group-prepend z-Index-2">
                                            <span>
                                                <img src="/images/left-icon.png" alt={""}/>
                                                <i className="fa fa-key ml-n4-2 text-white"/>
                                            </span>
                                            </div>
                                            <Field
                                                type="password"
                                                className="form-control textfield-rounded shadow-sm p-3 mb-4 zIndex-1"
                                                id="password"
                                                placeholder="Password"
                                                name="password"
                                            />
                                        </div>
                                    </center>
                                    <center>
                                        <button
                                            type="submit"
                                            className="gradientBtn w-75 animated wow fadeInDown delay-0-3s"
                                        >
                                            Đăng nhập
                                        </button>
                                    </center>
                                    <p className="text-center color-blue mt-3 animated wow fadeInDown delay-0-3s">
                                        Hoặc
                                    </p>
                                </Form>
                            </Formik>
                        </div>
                        <div className="modal-footer border-0 mt-n4">
                            <center>
                                <button
                                    type="button"
                                    className="btn-lg social-login rounded-circle shadow mr-4 bg-white animated wow zoomIn delay-0-5s"
                                >
                                    <i className="fa fa-google google-icon"/>
                                </button>
                                <button
                                    type="button"
                                    className="social-login rounded-circle shadow bg-white animated wow zoomIn delay-0-6s"
                                >
                                    <i className="fa fa-facebook fb-icon"/>
                                </button>
                                <p className="text-center color-dark mt-3 animated wow fadeInUp delay-0-3s">
                                    Bạn chưa có tài khoản?{" "}
                                    <Link to={"#"} onClick={openSignUp}
                                        // data-dismiss="modal"
                                          className="color-blue"
                                        // data-toggle="modal"
                                        // data-target="#signUpModal"
                                        // data-whatever=""
                                    >
                                        Đăng ký
                                    </Link>{" "}
                                </p>
                            </center>
                        </div>
                    </div>
                </div>
            </div>
            {/*Signup modal*/}
            <div
                className="modal mt-5"
                id="signUpModal"
                // tabIndex={-1}
                // role="dialog"
                // aria-labelledby="exampleModalLabel"
                // aria-hidden="true"
                // style={{opacity: "1"}}
            >
                <div className="modal-dialog modal-lg mt-5" role="document">
                    <div
                        className="modal-content rounded-modal shadow p-3"
                        style={{marginTop: "4rem"}}
                    >
                        <center>
                            <span className="loginSquare mt-n5">
                                <p className="text-white" id="exampleModalLabel">
                                    Đăng ký
                                </p>
                            </span>
                        </center>
                        <div className="modal-header border-0 p-0">
                            <button
                                onClick={closeSignUp}
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <Formik initialValues={{
                                username: "",
                                password: "",
                                confirmPassword: "",
                                user: {
                                    email: ""
                                },
                                role: {
                                    id: 2
                                }
                            }}
                                    onSubmit={(values) => {
                                        signup(values)
                                    }}

                                    validationSchema={validation}
                            >
                                <Form>
                                    <center>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <span style={{color: "red", fontSize: 14}}>
                                                    <ErrorMessage name={'username'}/>
                                                </span>
                                                <div
                                                    className="form-group input-group w-75 animated wow fadeInDown delay-0-1s">
                                                    <div className="input-group-prepend z-Index-2">
                                                        <span>
                                                            <img src="/images/left-icon.png" alt={""}/>
                                                            <i className="fa fa-user-o zIndex-2 ml-n4-2 text-white"/>
                                                        </span>
                                                    </div>
                                                    <Field
                                                        type="text"
                                                        className="form-control textfield-rounded shadow-sm p-3 mb-4 zIndex-1"
                                                        id="username"
                                                        placeholder="Username"
                                                        name="username"/>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <span style={{color: "red", fontSize: 14}}>
                                                    <ErrorMessage name={'user.email'}/>
                                                </span>
                                                <div
                                                    className="form-group input-group w-75 animated wow fadeInDown delay-0-2s">
                                                    <div className="input-group-prepend z-Index-2">
                                                        <span>
                                                            <img src="/images/right-icon.png" className="rotate-180"
                                                                 alt={""}/>
                                                            <i className="fa fa-envelope zIndex-2 ml-n4-2 text-white rotate-n0"/>
                                                        </span>
                                                    </div>
                                                    <Field
                                                        type="text"
                                                        className="form-control textfield-rounded shadow-sm p-3 mb-4 zIndex-1"
                                                        id="user.email"
                                                        placeholder="Email"
                                                        name="user.email"/>
                                                    <span style={{color: "red", fontSize: 14}}><ErrorMessage
                                                        name={'email'}/></span>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <span style={{color: "red", fontSize: 14}}>
                                                    <ErrorMessage name={'password'}/>
                                                </span>
                                                <div
                                                    className="form-group input-group w-75 animated wow fadeInDown delay-0-3s">
                                                    <div className="input-group-prepend z-Index-2">
                                                        <span>
                                                            <img src="/images/right-icon.png" className="rotate-180"
                                                                 alt={""}/>
                                                            <i className="fa fa-key rotate-n0 zIndex-2 ml-n4-2 text-white"/>
                                                        </span>
                                                    </div>
                                                    <Field
                                                        type="password"
                                                        className="form-control textfield-rounded shadow-sm p-3 mb-4 zIndex-1"
                                                        id="password"
                                                        placeholder="Password"
                                                        name="password"/>
                                                </div>
                                            </div>

                                            <div className="col-lg-6">
                                                <span style={{color: "red", fontSize: 14}}>
                                                    <ErrorMessage name={'confirmPassword'}/>
                                                </span>
                                                <div
                                                    className="form-group input-group w-75 animated wow fadeInDown delay-0-4s">
                                                    <div className="input-group-prepend z-Index-2">
                                                        <span>
                                                            <img src="/images/left-icon.png" alt={""}/>
                                                            <i className="fa fa-key zIndex-2 ml-n4-2 text-white"/>
                                                        </span>
                                                    </div>
                                                    <Field
                                                        type="password"
                                                        className="form-control textfield-rounded shadow-sm p-3 mb-4 zIndex-1"
                                                        id="confirmPassword"
                                                        placeholder="Confirm Password"
                                                        name="confirmPassword"/>
                                                </div>
                                            </div>
                                        </div>
                                    </center>
                                    <center>
                                        <button
                                            // id={"btn-signup"}
                                            type="submit"
                                            className="gradientBtn w-50 animated wow fadeInUp delay-0-5s"
                                            // data-toggle="modal"
                                            // data-target="#loginModal"
                                            // data-dismiss="modal"
                                            // aria-label="Close"
                                        >
                                            Đăng ký
                                        </button>
                                    </center>
                                    <p className="text-center color-blue mt-3 animated wow fadeInUp delay-0-5s pb-5">
                                        Hoặc
                                    </p>
                                </Form>
                            </Formik>
                            <div className="modal-footer border-0 mt-n5">
                                <center>
                                    <button
                                        type="button"
                                        className="btn-lg social-login rounded-circle shadow mr-4 bg-white animated wow zoomIn delay-0-5s"
                                    >
                                        <i className="fa fa-google google-icon"/>
                                    </button>
                                    <button
                                        type="button"
                                        className="social-login rounded-circle shadow bg-white animated wow zoomIn delay-0-6s"
                                    >
                                        <i className="fa fa-facebook fb-icon"/>
                                    </button>
                                    <p className="text-center color-dark mt-3 animated wow fadeInUp delay-0-6s">
                                        Bạn đã có tài khoản?{" "}
                                        <Link onClick={openLogin}
                                              to={"#"}
                                            // data-dismiss="modal"
                                              className="color-blue"
                                            // data-toggle="modal"
                                            // data-target="#signUpModal"
                                            // data-whatever=""
                                        >
                                            Đăng nhập
                                        </Link>{" "}
                                    </p>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function signup(values,action) {
        console.log(values)
        // alert("ok")
        axios.post('http://localhost:8080/puzzling/register', values).then(() => {
            closeSignUp()
        }).then(() => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Đăng ký thành công!',
                showConfirmButton: false,
                timer: 1500
            }).then(r => r.isConfirmed)
        })
            .catch(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Không thành công!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(r => r.isDenied)
            })
        action.resetForm()
    }

    function login(values) {
        axios.post('http://localhost:8080/puzzling/login', values)
            .then((response) => {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Đăng nhập thành công!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(r => r.isConfirmed)
                localStorage.setItem("id", JSON.stringify(response.data.id));
                localStorage.setItem("auth", JSON.stringify({
                    username: values.username,
                    password: values.password
                }))
            })
            .then(() => {
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            })
            .catch(() => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Sai tài khoản hoặc mật khẩu! Vui lòng thử lại!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(r => r.isDenied)
            });
    }

    function logout() {
        localStorage.removeItem('id');
        localStorage.removeItem('auth');
        localStorage.removeItem("isQuizPage");
        closeNav();
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Bạn đã đăng xuất, mời đăng nhập lại!',
            showConfirmButton: false,
            timer: 1500
        }).then(r => r.isConfirmed)
        navigate("/")
    }

    function openSignUp() {
        document.getElementById("signUpModal").style.display = "block";
    }

    function closeSignUp() {
        document.getElementById("signUpModal").style.display = "none";

    }

    function closeLogin() {
        document.getElementById("loginModal").style.display = "none";
    }

    function openLogin() {
        document.getElementById("loginModal").style.display = "block";
    }
}

export default SideNavBar;