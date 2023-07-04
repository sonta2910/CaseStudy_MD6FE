import React from 'react';
import RenderOnceChoiceQuestion from "./RenderOnceChoiceQuestion";
import RenderMultiChoiceQuestion from "./RenderMultiChoiceQuestion";

function RenderQuestionForm(props) {
    const {question, index, setExam, exam} = props
    switch (question.questionType) {
        case "ONE_CHOICE":
            return <RenderOnceChoiceQuestion
                question={question}
                index={index}
                setExam={setExam}
                exam={exam}
            />
        case "MULTI_CHOICE":
            return (
                <RenderMultiChoiceQuestion
                    question={question}
                    index={index}
                    setExam={setExam}
                    exam={exam}
                />
            )
    }
}

export default RenderQuestionForm;