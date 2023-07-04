import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import Render1RecordDetail from "./Render1Record";
import RecordSumary from "./RecordSumary";


function ShowRecordForm(props) {
    const [showDetailRecord, setShowDetailRecord] = useState(false);
    const {recordId} = useParams();
    const [record, setRecord] = useState({
        time: "",
        recordDetail: [
            {
                answers: [],
                question: {
                    name: ""
                }
            }
        ],
        user: {},
        exam: {
            name: "",
            passScore: 0
        },
        userPoint: 0,
        examPoint: 0
    })
    useEffect(() => {
        axios.get("http://localhost:8080/puzzling/record/" + recordId).then(
            (response) => setRecord(response.data)
        )

    }, [])
    return (
        <div className="container">
            <RecordSumary
                record={record}
                check={() => checkDemo()}
            />
            {showDetailRecord &&
                <div className={"modal-content rounded-modal shadow p-4 border-0 bg-img"}>
                    <h3 style={{display: "flex", justifyContent: "center", fontWeight: "bold"}}>Chi tiết đáp án</h3>
                    {
                        record.recordDetail.map((recordDetailElement) =>
                            <Render1RecordDetail
                                recordDetailElement={recordDetailElement}
                            />
                        )
                    }
                </div>
            }
        </div>
    );

    function checkDemo() {
        setShowDetailRecord(!showDetailRecord)
    }

}

export default ShowRecordForm;