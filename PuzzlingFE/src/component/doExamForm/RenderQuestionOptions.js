import React from 'react';
import {Field} from "formik";

function RenderQuestionOptions(props) {
    const {currentIndex, formik} = props

    function changeAnswerStatusRadio(trueIndex) {
        formik.values.recordDetail[currentIndex].answers =
            formik.values.recordDetail[currentIndex].answers.map((prev) => ({
                ...prev,
                answerStatus: false
            }))
        // formik.values.recordDetail[currentIndex].answers[trueIndex].answerStatus=true
    }

    // eslint-disable-next-line default-case
    switch (formik.values.exam.questions[currentIndex].questionType) {
        case "MULTI_CHOICE":
            return (
                <div className="row options">
                    {
                        formik.values.exam.questions[currentIndex].options.map((option, index) =>
                            <label className="col col-6 option"
                                   htmlFor={`recordDetail.${currentIndex}.answers.${index}.answerStatus`}>
                                <Field type="checkbox"
                                       id={`recordDetail.${currentIndex}.answers.${index}.answerStatus`}
                                       name={`recordDetail.${currentIndex}.answers.${index}.answerStatus`}
                                       checked={formik.values.recordDetail[currentIndex].answers[index].answerStatus === true}/>
                                <br/>
                                <p style={{paddingLeft:35}}>{option.name}</p>
                            </label>
                        )
                    }
                </div>
            );
        case "ONE_CHOICE":
            return (
                <div className={"row options"}>
                    {
                        formik.values.exam.questions[currentIndex].options.map((option, index) =>

                            <label htmlFor={`recordDetail.${currentIndex}.answers.${index}.answerStatus`}
                                   onClick={() => changeAnswerStatusRadio(index)}
                                   className={"col col-6 option"}
                            >
                                <Field type="radio" value={'true'}
                                       id={`recordDetail.${currentIndex}.answers.${index}.answerStatus`}
                                       name={`recordDetail.${currentIndex}.answers.${index}.answerStatus`}/>
                                <br/>
                                <p style={{paddingLeft:35}}>{option.name}</p>
                            </label>
                        )
                    }
                </div>
            );
    }

}

export default RenderQuestionOptions;