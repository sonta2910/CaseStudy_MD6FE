import React from 'react';
import {Field} from "formik";

const MappingQuestionsSearched = ({elements, startIndex}) => {
    function renderLevel(level) {
        let str_lv = "";
        if (level === "EASY") {
            str_lv = "Dễ";
        } else if (level === "MEDIUM") {
            str_lv = "Trung bình";
        } else if (level === "HARD") {
            str_lv = "Khó";
        }
        return (
            <div className={"mt-4"} style={{textAlign: "right"}}>Mức độ: {str_lv}</div>
        )
    }

    return (
        <div className='list-group mb-4'>
            {elements.map((element, index) => (
                <div key={index + startIndex} className='list-group-item rounded-modal shadow p-4 border-0 mt-4'>
                    <div style={{textAlign: "right"}}>
                        <Field type="checkbox" className={"form-check-input"}
                               id={`elements.${index + startIndex}.add`}
                               name={`elements.${index + startIndex}.add`}>
                        </Field>
                        <label htmlFor={`elements.${index + startIndex}.add`}
                               className={"form-check-label"}>
                            Chọn
                        </label>
                    </div>
                    {renderLevel(element.question.level)}
                    <p>Câu hỏi: {element.question.name}</p>
                    <hr/>
                    <small className={"text-muted"}>Lựa chọn đáp án</small>
                    <table className={"mt-2"} style={{marginLeft: 20}}>
                        {
                            element.question.options.map((option) => (
                                <tbody>
                                <tr>
                                    <td style={{textAlign: "left"}}>
                                        {
                                            option.status === 'true' ?
                                                <i className={"fa fa-check"} style={{color: "forestgreen"}}></i> :
                                                <i className={"fa fa-remove"} style={{color: "red"}}></i>
                                        }
                                        &nbsp;{option.name}
                                    </td>
                                </tr>
                                </tbody>
                            ))
                        }
                    </table>

                </div>
            ))}
        </div>
    )
};

export default MappingQuestionsSearched;