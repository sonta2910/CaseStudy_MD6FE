import {ErrorMessage, Field, Form, Formik} from "formik";
import axios from "axios";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

export default function ChangePassword() {
    const navigate = useNavigate();
    const id = JSON.parse(localStorage.getItem("id"));
    const initialValues = {
        oldPassword: "", newPassword: "", confirmPassword: ""
    }

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required("Không được để trống!")
            .test("oldPassword", "Sai mật khẩu", async function (password) {
                return axios.get(`http://localhost:8080/puzzling/users/check/${id}?password=` + password,
                    {
                        auth:JSON.parse(localStorage.getItem('auth'))
                    }
                    )
                    .then((response) => {
                        return response.data === "OK";
                    })
                    .catch((response) => {
                        navigate(`/${response.response.status}`)
                    });
            }),
        newPassword: Yup.string().required("Không được để trống!")
            .min(6, "Tối thiểu là 6 ký tự!")
            .max(32, "Tối đa 32 ký tự!"),
        confirmPassword: Yup.string().required("Không được để trống!")
            .min(6, "Tối thiểu là 6 ký tự!")
            .max(32, "Tối đa 32 ký tự!")
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không trùng nhau!'),
    })

    return (<div className="modal fade mt-5" id="passModal" tabIndex="-1" role="dialog"
                 aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
        <div className="modal-dialog mt-5" role="document">
            <div className="modal-content rounded-modal shadow p-3" style={{marginTop: 4 + 'rem'}}>
                <center>
                        <span className="loginSquare mt-n5">
                        <p className="text-white line-height-20 text-center ml-n2 mt-2 change-pass">
                            Đổi mật khẩu
                        </p>
                    </span>
                </center>
                <div className="modal-header border-0 p-0">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Formik initialValues={initialValues}
                            onSubmit={(values) => handleChangePassword(values)}
                            validationSchema={validationSchema}>
                        <Form>
                            <center>
                                <span style={{color: "red", fontSize: 14}}><ErrorMessage name={"oldPassword"}/></span>
                                <div className="form-group input-group w-75 animated wow fadeInDown delay-0-1s">
                                    <Field type="password" name={"oldPassword"}
                                           className="form-control textfield-rounded shadow-sm p-3 mb-3 zIndex-1"
                                           id="oldPassword" placeholder="Mật khẩu cũ..."/>
                                    <div className="input-group-append z-Index-2">
                                        <span>
                                            <img src="/images/right-icon.png" className="ml-n6" alt={""}/>
                                            <i className="fa fa-key ml-n4-1 text-white"></i>
                                        </span>
                                    </div>
                                </div>

                                <span style={{color: "red", fontSize: 14}}><ErrorMessage name={"newPassword"}/></span>
                                <div
                                    className="form-group input-group w-75 z-Index-2 animated wow fadeInDown delay-0-2s">
                                    <div className="input-group-prepend z-Index-2">
                                        <span>
                                            <img src="/images/left-icon.png" alt={""}/>
                                            <i className="fa fa-key ml-n4-2 text-white"></i>
                                        </span>
                                    </div>
                                    <Field type="password" name={"newPassword"}
                                           className="form-control textfield-rounded shadow-sm p-3 mb-3 zIndex-1"
                                           id="newPassword" placeholder="Mật khẩu mới..."/>
                                </div>

                                <span style={{color: "red", fontSize: 14}}><ErrorMessage
                                    name={"confirmPassword"}/></span>
                                <div
                                    className="form-group input-group w-75 z-Index-2 animated wow fadeInDown delay-0-3s">
                                    <div className="input-group-prepend z-Index-2">
                                        <span>
                                            <img src="/images/left-icon.png" alt={""}/>
                                            <i className="fa fa-key ml-n4-2 text-white"></i>
                                        </span>
                                    </div>
                                    <Field type="password" name={"confirmPassword"}
                                           className="form-control textfield-rounded shadow-sm p-3 mb-4 zIndex-1"
                                           id="confirmPassword" placeholder="Xác nhận mật khẩu..."/>
                                </div>
                            </center>
                            <center>
                                <button type="submit"
                                        className="gradientBtn w-75 animated wow fadeInUp delay-0-4s">
                                    Lưu
                                </button>
                            </center>
                        </Form>
                    </Formik>
                </div>
            </div>
        </div>
    </div>)

    function handleChangePassword(values) {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn đổi mật khẩu?',
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
                axios.put("http://localhost:8080/puzzling/users/changePassword/" + JSON.parse(localStorage.getItem("id")), values,
                    {
                        auth:JSON.parse(localStorage.getItem('auth'))
                    }
                ).then((response)=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đổi mật khẩu thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                        .then(r => r.isConfirmed)
                        .then(()=>logout())
                }).catch((err)=>navigate(`/${err.response.status}`))
            } else if (result.isDenied) {
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Không thành công!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(r => r.isConfirmed)
            }
        })
    }
    function logout() {
        localStorage.removeItem('id');
        localStorage.removeItem('auth')
        document.getElementById("mySidenav").style.cssText = "width:0; border:none; box-shadow: none;";
        navigate("/")
        window.location.reload()
    }
}
