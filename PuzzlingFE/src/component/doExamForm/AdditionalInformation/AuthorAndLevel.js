import React from 'react';

function AuthorAndLevel(props) {
    const {formik, currentIndex} = props
    const author = formik.values.exam.user
    const level = formik.values.exam.questions[currentIndex].level
    let str_lv = "";
    if (level === "EASY") {
        str_lv = "Dễ";
    } else if (level === "MEDIUM") {
        str_lv = "Trung bình";
    } else if (level === "HARD") {
        str_lv = "Khó";
    }
    return (
        <div style={{paddingTop: 20, paddingRight: 20, fontWeight: "bold"}}>
            <p>Mức độ: {str_lv}</p>
        </div>
    );
}

export default AuthorAndLevel;