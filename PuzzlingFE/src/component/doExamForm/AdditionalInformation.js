import React, {useEffect} from 'react';
import QuestionPaging from "./AdditionalInformation/QuestionPaging";

function AdditionalInformation(props) {
    const {formik, currentIndex, setCurrentIndex} = props
    useEffect(() => {
        if (JSON.parse(localStorage.getItem("id")) === null) {
            document.getElementById("loginModal").style.display = "block";
        }
    }, [formik])
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <QuestionPaging
                formik={formik}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
            />
        </div>
    );
}

export default AdditionalInformation;