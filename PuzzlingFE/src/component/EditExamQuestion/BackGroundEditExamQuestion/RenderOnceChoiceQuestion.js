import React from 'react';
import {Field, FieldArray} from "formik";
import DeleteQuestionButton from "./innerComponent/DeleteQuestionButton";
import NameAndDifficultiesField from "./innerComponent/NameAndDifficultiesField";
import CreateDeleteOptionsButton from "./innerComponent/CreateDeleteOptionsButton";

function RenderOnceChoiceQuestion(props) {
    const {question, index, setExam, exam} = props

    function changeStatusOfOptionsInArrayRadioFields(options, trueIndex) {
        let newOpt = options.map(option => ({
            name: option.name,
            status: "false"
        }))
        newOpt[trueIndex].status = "true";
        question.options = newOpt;
        setExam({...exam})
    }

    return (
        <div className={"form-group"} key={index}>
            <br/>
            <br/>
            <hr/>
            <h4>Câu hỏi lựa chọn một đáp án</h4>
            <DeleteQuestionButton
                exam={exam}
                setExam={setExam}
                index={index}
            />
            <NameAndDifficultiesField
                index={index}
            />
            <FieldArray name={`questions[${index}].options`} render={optionArrayHelpers => {
                return <>
                    <CreateDeleteOptionsButton
                        exam={exam}
                        setExam={setExam}
                        index={index}
                        question={question}
                    />
                    {question.options.map(((option, optionIndex) => {
                            return <>
                                <div className="input-group mt-1">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">
                                            <Field type="radio"
                                                   name={`questions.${index}.options.${optionIndex}.status`}
                                                   id={`questions.${index}.options.${optionIndex}.status`}
                                                   value={`true`}
                                                   onClick={() => changeStatusOfOptionsInArrayRadioFields(question.options, optionIndex)}
                                            />
                                        </div>
                                    </div>
                                    <Field type="text" className="form-control"
                                           name={`questions.${index}.options.${optionIndex}.name`}
                                           id={`questions.${index}.options.${optionIndex}.name`}
                                           placeholder="Tên lựa chọn"
                                    />
                                </div>
                            </>
                        }
                    ))}
                </>
            }
            }/>
        </div>
    )
}

export default RenderOnceChoiceQuestion;