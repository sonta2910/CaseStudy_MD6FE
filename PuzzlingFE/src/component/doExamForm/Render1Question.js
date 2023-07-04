import React from 'react';
import RenderQuestionOptions from "./RenderQuestionOptions";

function Render1Question(props) {
    const {currentIndex, formik} = props
    const currentQuestion = formik.values.exam.questions[currentIndex]
    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col-sm-12 col-sm-offset-2" id="quiz_web">
                    <div className="progress mb-2">
                        <div className="progress-bar bg-color-blue" role="progressbar"
                             style={{width: `${(currentIndex + 1) / formik.values.exam.questions.length * 100}%`}}
                             aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="question mb-3 animated wow zoomIn">
                        <h3><span className="label label-warning" id="qid">{currentIndex + 1}.</span>
                            <span id="question"> {currentQuestion.name}</span>
                        </h3>
                    </div>
                    <div className="container">
                            {
                                <RenderQuestionOptions
                                    currentIndex={currentIndex}
                                    formik={formik}
                                />
                            }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Render1Question;