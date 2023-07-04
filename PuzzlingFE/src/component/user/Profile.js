import {Link, useNavigate} from "react-router-dom";
import ChangePassword from "./ChangePassword";
import {ErrorMessage, Field, Form, Formik} from "formik";
import axios from "axios";
import {useEffect, useState} from "react";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "../../firebase";
import * as Yup from "yup";
import Swal from "sweetalert2";

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({})
    const [imgUrl, setImgUrl] = useState(null);
    const id = JSON.parse(localStorage.getItem("id"));
    const [progressPercent, setProgressPercent] = useState(0);
    const initialValues = {
        avatar: imgUrl || user.avatar,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().required("Không được để trống!")
            .test("email", "Không được trùng với email của người khác", async function (email) {
                return axios.get(`http://localhost:8080/puzzling/users/checkEmail/${id}?email=` + email,
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
        phone: Yup.string()
            .test("phone", "Không được trùng với số điện thoại của người khác", async function (phone) {
                return axios.get(`http://localhost:8080/puzzling/users/checkPhone/${id}?phone=` + phone,
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
    })

    useEffect(() => {
        axios
            .get(`http://localhost:8080/puzzling/users/${id}`,
                {
                    auth:JSON.parse(localStorage.getItem('auth'))
                }
                )
            .then((response) => {
                setImgUrl(response.data.avatar)
                setUser(response.data);
            })
            .catch((response) => {
                navigate(`/${response.response.status}`)
            });
    }, []);

    return (
        <div className="container">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content rounded-modal shadow p-3 border-0" style={{marginTop: 6 + 'rem'}}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values) => handleChangeProfile(values)}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                    >
                        <Form>
                            <div className={"imageUpload"} style={{textAlign: "center"}}>
                                <label htmlFor={"avatar"}>
                                    <img src={initialValues.avatar} alt={""}
                                         className="user-profile shadow mx-auto img-fluid rounded-circle mt-n5 mb-1 animated wow pulse"/>
                                </label>
                                <input type="file" id="avatar" name="avatar"
                                       className="user-profile shadow mx-auto img-fluid rounded-circle mt-n5 mb-1 animated wow pulse"
                                       onChange={(event) => uploadAvatar(event)}/>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-6">
                                        <span style={{color: "red", fontSize: 14}}><ErrorMessage name={"name"}/></span>
                                        <div
                                            className="form-group input-group w-100 animated wow fadeInDown delay-0-1s">
                                            <div className="input-group-prepend">
                                                <span><img src="/images/left-icon.png" alt={""}/></span>
                                            </div>
                                            <Field type="text" id="recipient-user"
                                                   name={"name"} placeholder="Họ tên..."
                                                   className="form-control textfield-rounded shadow-sm mb-4 ml-n3"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <span style={{color: "red", fontSize: 14}}><ErrorMessage name={"email"}/></span>
                                        <div
                                            className="form-group input-group w-100 animated wow fadeInDown delay-0-2s">
                                            <div className="input-group-prepend">
                                                <span><img src="/images/right-icon.png" className="rotate-180"
                                                           alt={""}/></span>
                                            </div>
                                            <Field type="text" id="recipient-mobile"
                                                   name={"email"} placeholder="Email..."
                                                   className="form-control textfield-rounded shadow-sm p-3 mb-4 ml-n3"/>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <span style={{color: "red", fontSize: 14}}><ErrorMessage name={"phone"}/></span>
                                        <div
                                            className="form-group input-group w-100 animated wow fadeInDown delay-0-3s">
                                            <div className="input-group-prepend">
                                                <span><img src="/images/right-icon.png" className="rotate-180"
                                                           alt={""}/></span>
                                            </div>
                                            <Field type="text" id="recipient-adress"
                                                   name={"phone"} placeholder="Số điện thoại..."
                                                   className="form-control textfield-rounded shadow-sm p-3 mb-4 ml-n3"/>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div
                                            className="form-group input-group w-100 animated wow fadeInDown delay-0-4s">
                                            <div className="input-group-prepend">
                                                <span><img src="/images/left-icon.png" alt={""}/></span>
                                            </div>
                                            <Field as="select" name={"gender"}
                                                   className="form-control textfield-rounded gender-value shadow-sm mb-4 ml-n3">
                                                <option value={""} hidden>Chọn</option>
                                                <option value={"MALE"}> Nam</option>
                                                <option value={"FEMALE"}>Nữ</option>

                                            </Field>
                                        </div>
                                    </div>
                                </div>
                                <center>
                                    <button type="submit" className="gradientBtn w-50 animated wow fadeInUp">Lưu thông
                                        tin
                                    </button>
                                </center>
                            </div>
                            <div className="modal-footer border-0 mt-n4">
                                <center>
                                    <p className="text-center mt-3 animated wow fadeInUp">
                                        <Link to={""} data-toggle="modal" data-target="#passModal"
                                              data-whatever="" className="color-blue">
                                            Đổi mật khẩu
                                        </Link>
                                    </p>
                                </center>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
            {/*Change Password Modal*/}
            <ChangePassword/>
        </div>
    )

    function handleChangeProfile(values){
        Swal.fire({
            title: 'Bạn muốn thay đổi thông tin?',
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
                if (values.avatar)
                    values.avatar = imgUrl;
                axios.put(`http://localhost:8080/puzzling/users/${id}`, values,
                    {
                        auth:JSON.parse(localStorage.getItem('auth'))
                    }
                ).then((response)=>{
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Đổi thông tin thành công!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(r => r.isConfirmed).then(
                        () => navigate("/")
                    ).then (() => window.location.reload())
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

    function uploadAvatar(event) {
        const file = event.target.files[0]
        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes));
                setProgressPercent(progress);
                console.log(progress)
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                });
            }
        );
    }
}