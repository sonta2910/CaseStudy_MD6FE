import React from 'react';
import {Field} from "formik";
function handleKeyDown(e) {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
}
function NameAndDifficultiesField(props) {
    const {index} = props
    return (
        <div>
            <Field as="textarea"
                   onKeyUp={handleKeyDown}
                name={`questions[${index}].name`} className={"form-control textfield-rounded"}
                   id={`questions.${index}.name`}
                   placeholder="Tên câu hỏi"/>
            <br/>
            <label htmlFor={`questions[${index}].level`}>Chọn độ khó</label>
            <Field as="select" className={"form-control textfield-rounded"} name={`questions.${index}.level`}
                   id={`questions.${index}.level`}>
                <option value="">Chọn</option>
                <option value="EASY"> Dễ</option>
                <option value="MEDIUM"> Vừa</option>
                <option value="HARD"> Khó</option>
            </Field>
        </div>
    );
}

export default NameAndDifficultiesField;