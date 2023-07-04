import React from 'react';

function Render1RecordDetail(props) {
    const {recordDetailElement} = props
    return (
        <div className="container ">
            <div className="modal-dialog modal-xl" role="document">
                <div className='list-group-item rounded-modal shadow p-4 border-0 mt-4'>
                    <div className="row">
                        <div style={{fontWeight: "bold"}}>Câu hỏi: &nbsp;</div>
                        {recordDetailElement.question.name}
                    </div>
                    <div className="row">
                        <div className="col-6 mt-4" style={{fontWeight: "bold"}}>
                            Đáp án:
                        </div>
                        <div className="col-6 mt-4" style={{fontWeight: "bold"}}>
                            Câu trả lời của bạn:
                        </div>
                    </div>
                    <div className="row">
                        {
                            recordDetailElement.answers.map((answer) =>
                                <>
                                    <div className="col-6">
                                        <tbody>
                                        <tr>
                                            <td style={{textAlign: "left"}}>
                                                {
                                                    answer.option.status === 'true' ?
                                                        <i className={"fa fa-check"}
                                                           style={{color: "forestgreen"}}></i> :
                                                        <i className={"fa fa-remove"}
                                                           style={{color: "red"}}></i>
                                                }
                                                &nbsp;{answer.option.name}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </div>
                                    <div
                                        className={answer.option.status === answer.answerStatus ? "col-6" : "col-6"}>
                                        <tbody>
                                        <tr>
                                            <td style={{textAlign: "left"}}>
                                                {
                                                    answer.answerStatus === 'true' ?
                                                        <i className={"fa fa-check"}
                                                           style={{color: "forestgreen"}}></i> :
                                                        <i className={"fa fa-remove"}
                                                           style={{color: "red"}}></i>
                                                }
                                                &nbsp;{answer.option.name}
                                            </td>
                                        </tr>
                                        </tbody>

                                    </div>
                                </>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Render1RecordDetail;