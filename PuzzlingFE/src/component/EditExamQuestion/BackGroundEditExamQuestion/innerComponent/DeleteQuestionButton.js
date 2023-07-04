import React from 'react';

function DeleteQuestionButton(props) {
    const {exam, setExam, index} = props
    return (
        <div>
            <div className="btn-group float-right mb-2" role="group">
                <button type="button" className="delete-btn animated wow fadeInUp"
                        onClick={() => {
                            exam.questions.splice(index, 1)
                            setExam({...exam})
                        }}
                >Xoá câu hỏi
                </button>
            </div>
        </div>
    );
}

export default DeleteQuestionButton;