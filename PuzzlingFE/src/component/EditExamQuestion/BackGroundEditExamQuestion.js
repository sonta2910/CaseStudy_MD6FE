import React from 'react';
import {Formik} from "formik";
import * as Yup from "yup";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import RenderPagingQuestion from "./RenderPagingQuestion";
import Swal from "sweetalert2";

const validationExam = Yup.object().shape({
    questions: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Tên của câu hỏi không được để trống!"),
            level: Yup.string().required(),
            questionsType: Yup.string(),
            options: Yup.array().when('questionType', ([questionType], schema) => {
                if (questionType === "ONE_CHOICE") {
                    return schema.test("test Option Array", (value, context) => {
                        let checkStatus = false
                        let checkName = true
                        value.forEach((option) => {
                            if (option.status) checkStatus = true
                            if (!option.name) checkName = false
                        })
                        return checkName && checkStatus
                    })
                } else if (questionType === "MULTI_CHOICE") {
                    return schema.test("test Option Array", (value, context) => {
                        let checkName = true
                        let countStatus = 0
                        value.forEach((option) => {
                            if (!option.name) checkName = false
                            if (option.status === true || option.status === 'true') countStatus++
                        })
                        let checkStatus = countStatus >= 2
                        return checkName && checkStatus
                    })
                }
            })
        })
    )
})

function BackGroundEditExamQuestion(props) {
    const navigate = useNavigate();
    const {exam, setExam, id} = props
    return (

        <div className="container">
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content rounded-modal shadow p-3 border-0 bg-img">
                    <div className="col-12">
                        <h3 style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}>
                            Thêm nội dung câu hỏi
                        </h3>
                        <Formik initialValues={exam}
                                onSubmit={(values) => {
                                    console.log(values)
                                    axios.put(`http://localhost:8080/puzzling/exam/update?examId=${id}`, values,
                                        {
                                            auth: JSON.parse(localStorage.getItem('auth'))
                                        }
                                    )
                                        .then(() => {
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'Lưu bài thi thành công!',
                                                showConfirmButton: false,
                                                timer: 1500
                                            }).then(r => r.isConfirmed)
                                            navigate(`/category/${values.category.id}`);
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                            navigate(`/${error.response.status}`)
                                        });
                                }}
                                enableReinitialize={true}
                                validationSchema={validationExam}
                        >
                            {({values, isValid}) => <RenderPagingQuestion
                                values={values}
                                isValid={isValid}
                                setExam={setExam}

                            />
                            }
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BackGroundEditExamQuestion;