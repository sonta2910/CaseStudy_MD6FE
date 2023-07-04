import React, {useEffect, useState} from 'react';
import axios from "axios";
import Pagination from "./Pagination";
import MappingQuestionsSearched from "./MappingQuestionsSearched";
import {Field, FieldArray, Form, Formik} from "formik";
import {useNavigate, useParams} from "react-router-dom";

function SearchAddQuestion(props) {
    const {exam, setExam} = props
    let {id} = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [ElementPerPage] = useState(5);
    const [selectQuestionToAdd, setSelectQuestionToAdd] = useState({elements: []})
    const [searchForm,setSearchForm] = useState({
        name: "",
        category: exam.category.name,
        questionType: "",
        level: ""
    })
    console.log(searchForm)
    function addToExam(values, action) {
        let newQ = []
        values.elements.forEach((element) => {
            let question = element.question
            if (element.add)
                newQ.push({
                    level: question.level,
                    name: question.name,
                    questionType: question.questionType,
                    options: question.options.map((option) => ({
                        name: option.name,
                        status: option.status
                    }))
                })
        })
        setExam((exam) => ({
            ...exam,
            questions: [
                ...exam.questions,
                ...newQ
            ]
        }))
        action.resetForm()
        navigate(`/exam/edit/${id}`)
    }

    function search(searchForm) {
        axios.post(`http://localhost:8080/puzzling/question/search`, searchForm)
            .then((response) => {
                let mapper = response.data.map((question) =>
                    ({
                        question: question,
                        add: false
                    })
                )
                setCurrentPage(1)
                setSelectQuestionToAdd({elements: mapper})
            })
    }

    useEffect(() => {
        search(searchForm)
    }, [searchForm]);

    useEffect(() => {
        setSearchForm({
            name: "",
            category: exam.category.name,
            questionType: "",
            level: ""
        })
    }, [exam]);
    // Get current posts
    const indexOfLastElement = currentPage * ElementPerPage;
    const indexOfFirstElement = indexOfLastElement - ElementPerPage;
    const currentElements = selectQuestionToAdd.elements.slice(indexOfFirstElement, indexOfLastElement);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container mt-5">
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content rounded-modal shadow p-4 border-0 bg-img">
                    <div className={"col col-4"}>
                        <button type="button"
                                onClick={() => navigate(`/exam/edit/${id}`)}
                                className="gradientBtn mt-4 animated wow fadeInUp"
                        >
                            Quay lại
                        </button>
                    </div>
                    <h2 className='mb-4'
                        style={{textAlign: "center", fontWeight: "bold"}}
                    >
                        Tìm kiếm câu hỏi
                    </h2>
                    <Formik initialValues={searchForm}
                            onSubmit={search}
                            enableReinitialize={true}
                    >
                        {() =>
                            <Form>
                                <div className={"container"}>
                                    <div className={"row"}>
                                        <div className={"row col col-12"}>
                                            <div className={"col col-9"}>
                                                <Field name={"name"} className={"form-control textfield-rounded mt-4"}
                                                       id={"name"} placeholder="Tên câu hỏi"/>
                                            </div>
                                            <div className={"col col-3"}>
                                                <button type="submit" style={{width: 100 + "%"}}
                                                        className="gradientBtn mt-4 animated wow fadeInUp">
                                                    <i className={"fa fa-search"} style={{fontSize: "20px"}}>&nbsp;</i>
                                                    Tìm kiếm
                                                </button>
                                            </div>
                                        </div>
                                        <div className={"col col-6"}>
                                            <label htmlFor={"level"} className={"mt-4"} style={{fontSize: 18}}>Độ
                                                khó: </label>
                                            <Field as="select" className={"form-control textfield-rounded mt-2"}
                                                   name={"level"} id={"level"}>
                                                <option value="">Chọn tất cả</option>
                                                <option value="EASY"> Dễ</option>
                                                <option value="MEDIUM">Trung bình</option>
                                                <option value="HARD"> Khó</option>
                                            </Field>
                                        </div>
                                        <div className={"col col-6"}>
                                            <label htmlFor={"questionType"} className={"mt-4"} style={{fontSize: 18}}>Loại
                                                câu hỏi:</label>
                                            <Field as="select" className={"form-control textfield-rounded mt-2"}
                                                   name={"questionType"}
                                                   id={"questionType"}>
                                                <option value="">Chọn tất cả</option>
                                                <option value="ONE_CHOICE"> Một đáp án</option>
                                                <option value="MULTI_CHOICE">Nhiều đáp án</option>
                                            </Field>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        }
                    </Formik>
                    <br/>
                    <Formik
                        initialValues={selectQuestionToAdd}
                        enableReinitialize={true}
                        onSubmit={addToExam}
                    >
                        <Form className={"mt-4"}>
                            <FieldArray name={"element"}>
                                {
                                    () =>
                                        <MappingQuestionsSearched
                                            elements={currentElements}
                                            startIndex={indexOfFirstElement}/>
                                }
                            </FieldArray>
                            <button type="submit" style={{float: "right", marginRight: 30}}
                                    className="gradientBtn mt-4 animated wow fadeInUp">
                                Thêm vào
                            </button>
                        </Form>
                    </Formik>
                    <div className={"mt-4"} style={{display: "flex", justifyContent: "center"}}>
                        <Pagination
                            elementPerPage={ElementPerPage}
                            totalElements={selectQuestionToAdd.elements.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchAddQuestion;