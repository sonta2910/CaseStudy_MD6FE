import React, {useEffect} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Render1Question from "./Render1Question";
import {Form, Formik} from "formik";
import AdditionalInformation from "./AdditionalInformation";
import Clock from "./AdditionalInformation/Clock";
import AuthorAndLevel from "./AdditionalInformation/AuthorAndLevel";

function DoExamForm(props) {
    const {examId} = useParams();
    const navigate = useNavigate();

    function submitRecord(values) {
        console.log(values)
        axios.post(`http://localhost:8080/puzzling/record/createExamResult/${JSON.parse(localStorage.getItem("id"))}`, values)
            .then((response) => {
                navigate(`/record/` + response.data.id)
            })
            .catch((error) => {
                navigate(`/${error.response.status}`)
            });
    }

    const [record, setRecord] = React.useState(
        {
            user: {
                id: ""
            },
            exam: {
                id: "",
                name: "",
                time: 10,
                passScore: 0,
                questions: [{
                    name: "",
                    level: "",
                    options: [{
                        name: ""
                    }]
                }],
                category: "",
                user: {}
            },
            recordDetail: [
                {
                    question: {},
                    answers: [
                        {
                            option: {},
                            answerStatus: "false"
                        }
                    ]
                }
            ]
        });
    const [currentIndex, setCurrentIndex] = React.useState(0);
    useEffect(() => {
        axios.get(`http://localhost:8080/puzzling/exam/info?examId=${examId}`)
            .then((response) => {
                console.log(response.data)
                let Sexam = {
                    name: response.data.name,
                    time: response.data.time,
                    passScore: response.data.passScore,
                    category: response.data.category,
                    user: response.data.user,
                    questions: response.data.questions.map((question) => ({
                        level: question.level,
                        name: question.name,
                        questionType: question.questionType,
                        options: question.options.map((option) => ({
                            name: option.name,
                            status: option.status
                        }))
                    }))
                }
                console.log(Sexam)
                setRecord({
                    user: {
                        id: ""
                    },
                    exam: Sexam,
                    recordDetail: Sexam.questions.map((question) => ({
                        question: question,
                        answers: question.options.map((option) => ({
                            option: option,
                            answerStatus: "false"
                        }))
                    }))
                })
                console.log(record)
            })
            .catch((error) => {
                navigate(`/${error.response.status}`)
            })
    }, [])
    return (
        <div className="container mt-5">
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content rounded-modal shadow p-4 border-0 bg-img">
                    <Formik initialValues={record}
                            onSubmit={submitRecord}
                            enableReinitialize={true}
                    >
                        {
                            (formik) => {
                                if (formik.values.exam.questions[currentIndex])
                                    return (
                                        <Form>
                                            <div className={"row"}>
                                                <div className={"col col-6"}>
                                                    <Clock
                                                        formik={formik}
                                                    />
                                                </div>
                                                <div className={"col col-6"} style={{textAlign: "right"}}>
                                                    <AuthorAndLevel
                                                        formik={formik}
                                                        currentIndex={currentIndex}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Render1Question
                                                    currentIndex={currentIndex}
                                                    formik={formik}
                                                />
                                            </div>
                                            <AdditionalInformation
                                                formik={formik}
                                                currentIndex={currentIndex}
                                                setCurrentIndex={setCurrentIndex}
                                            />
                                            <div>
                                                {currentIndex !== 0 &&
                                                    <button type="button"
                                                            onClick={() => setCurrentIndex((cur) => --cur)}
                                                            className="gradientBtn mt-4 animated wow fadeInUp">
                                                        Câu hỏi trước
                                                    </button>
                                                }
                                                {
                                                    currentIndex !== record.exam.questions.length - 1 &&
                                                    <button type="button"
                                                            onClick={() => setCurrentIndex((cur) => ++cur)}
                                                            className="gradientBtn mt-4 animated wow fadeInUp">
                                                        Câu hỏi tiếp theo
                                                    </button>
                                                }
                                                {
                                                    currentIndex === record.exam.questions.length - 1 &&
                                                    <button type="submit"
                                                            className="gradientBtn mt-4 animated wow fadeInUp">
                                                        Nộp bài thi
                                                    </button>
                                                }
                                            </div>
                                        </Form>
                                    )
                                else
                                    return (
                                        <>
                                            Bài thi này không có câu hỏi
                                            <Link to="/doAQuiz">
                                                <button type={"button"}
                                                        className={"gradientBtn animated wow fadeInUp mt-4 mb-3"}>
                                                    Trở lại
                                                </button>
                                            </Link>
                                        </>
                                    )
                            }
                        }
                    </Formik>

                </div>
            </div>
        </div>
    );
}

export default DoExamForm;