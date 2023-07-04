import React from 'react';
import {ErrorMessage, Field, Form, Formik} from "formik";
import axios from "axios";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";


function CreateExamForm() {
    const navigate = useNavigate();
    const [exam, setExam] = React.useState({
        name: "",
        category: {
            id: ""
        },
    })

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Vui lòng nhập tên bài thi!")
            .test("name", "Bạn đã có bài thi này", async function (examName) {
                return axios.get(`http://localhost:8080/puzzling/exam/check/${examName}?account=${JSON.parse(localStorage.getItem('id'))}`)
                    .then((response) => {
                        return response.data === "OK";
                    })
                    .catch((response) => {
                        navigate(`/${response.response.status}`)
                    })
            })
        ,
        category: Yup.object().shape({
            id: Yup.string().required()
        }),
        passScore: Yup.number()
            .required("Vui lòng nhập điểm tối thiểu để qua bài thi!")
            .min(1, "Điểm tối thiểu để qua bài thi phải lớn hơn 1%")
            .max(100, "Điểm tối đa để qua bài thi là 100%!"),
        time: Yup.number().required("Vui lòng nhập thời gian làm bài thi!")
            .min(1, "Thời gian làm bài phải hợp lệ!"),
    })
    const [categories, setCategories] = React.useState([])
    React.useEffect(() => {
        axios.get("http://localhost:8080/puzzling/categories/").then((response) => {
            setCategories(response.data)
        })
    }, [])
    return (
        <div className="container">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content rounded-modal shadow p-3 border-0 bg-img">
                    <Formik
                        initialValues={exam}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            axios.post(`http://localhost:8080/puzzling/exam/create?account=${JSON.parse(localStorage.getItem('id'))}`, values)
                                .then((response) => {
                                    navigate(`/exam/edit/${response.data.id}`);
                                })
                                .catch((error) => {
                                    navigate(`/${error.response.status}`)
                                });
                        }}
                    >
                        {({isValid}) =>
                            (
                                <Form>
                                    <h1 style={{textAlign: "center", fontWeight: "bold"}}
                                        className="title,">
                                        Tạo bài thi mới
                                    </h1>
                                    <hr/>
                                    <div className="container mt-5">
                                        <label htmlFor={"name"} style={{fontSize: 18}}>Tiêu đề bài thi</label>
                                        <Field name={`name`} className={"form-control textfield-rounded"}
                                               id={`name`} placeholder="Tên Bài thi"
                                        />
                                        <span style={{color: "red", fontSize: 14 + "px"}}>
                                        < ErrorMessage name={'name'}/></span>
                                        <br/>
                                        <label htmlFor={"category"} style={{fontSize: 18}}>Danh mục bài thi</label>
                                        <div
                                            className="form-group input-group w-100 animated wow ">
                                            <div className="input-group-prepend">
                                            </div>
                                            <Field as="select" name="category.id"
                                                   className={"form-control textfield-rounded"}>
                                                <option value="" hidden>Vui lòng chọn</option>
                                                {categories.map((cate) => (
                                                    <>
                                                        <option value={`${cate.id}`}>{cate.name}</option>
                                                    </>
                                                ))}
                                            </Field>
                                        </div>

                                        <label htmlFor={"passScore"} style={{fontSize: 18}}>Điểm đạt (%)</label>
                                        <div
                                            className="wrapper">
                                            <div className="input-group-prepend">
                                            </div>
                                            <Field type="number" name="passScore"
                                                   className={"form-control textfield-rounded"}
                                                   placeholder="Tối đa 100%"/>
                                            <span style={{color: "red", fontSize: 14 + "px"}}>
                                                < ErrorMessage name={'passScore'}/></span>
                                        </div>
                                        <br/>
                                        <label htmlFor={"time"} style={{fontSize: 18}}>Thời gian làm bài (phút)</label>
                                        <div
                                            className="wrapper">
                                            <div className="input-group-prepend">
                                            </div>
                                            <Field type="text" name="time" className={"form-control textfield-rounded"}
                                                   placeholder="Nhập thời gian làm bài thi"/>
                                            <span style={{color: "red", fontSize: 14 + "px"}}>
                                                < ErrorMessage name={'time'}/></span>
                                        </div>
                                        <div style={{textAlign: "center"}}>
                                            <button type="submit" className="gradientBtn mt-4 animated wow fadeInUp"
                                                    disabled={!isValid}>Tạo bài thi
                                            </button>
                                        </div>
                                    </div>
                                </Form>

                            )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default CreateExamForm;