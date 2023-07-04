import React from 'react';
import RenderPaging from "./RenderPaging";

function QuestionPaging(props) {
    const {formik, currentIndex, setCurrentIndex} = props
    const recordDetailTouched = formik.touched.recordDetail
    return (
        <div>
            <ul className='pagination'>
                {recordDetailTouched === undefined ?
                    formik.values.exam.questions.map((number, index) => (
                        <RenderPaging
                            index={index}
                            setCurrentIndex={setCurrentIndex}
                            type={"untouched"}
                            currentIndex={currentIndex}
                        />
                    )) :
                    formik.values.exam.questions.map((number, index) => (
                        typeof recordDetailTouched[index] === 'undefined' ?
                            <RenderPaging
                                index={index}
                                setCurrentIndex={setCurrentIndex}
                                type={"untouched"}
                                currentIndex={currentIndex}

                            />
                            :
                            <RenderPaging
                                index={index}
                                setCurrentIndex={setCurrentIndex}
                                type={"touched"}
                                currentIndex={currentIndex}
                            />
                    ))
                }
            </ul>
        </div>
    );
}

export default QuestionPaging;