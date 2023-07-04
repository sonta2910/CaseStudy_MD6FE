import React, {useEffect, useRef, useState} from 'react';

function Clock(props) {
    const {formik} = props
    const [timer, setTimer] = useState({
        minute: formik.values.exam.time,
        second: 0
    })
    let lastInterval = useRef(0)
    useEffect(() => {
        setTimer({
            minute: formik.values.exam.time,
            second: 0
        })
        clearInterval(lastInterval.current)
        lastInterval.current = setInterval(function () {
            setTimer(prevState => {
                if (prevState.second === 0) {
                    if (prevState.minute === 0) {
                        formik.handleSubmit();
                    }
                    return {
                        minute: prevState.minute - 1,
                        second: 59
                    }
                } else {
                    return {
                        minute: prevState.minute,
                        second: prevState.second - 1
                    }
                }
            })
        }, 1000)
    }, [formik.values.exam.time])
    return (
        <div style={{fontWeight: "bold"}}>
            <p style={{paddingLeft: 15, paddingTop: 20}}>Thời gian còn lại: {timer.minute}:{timer.second}</p>
        </div>
    );
}

export default Clock;