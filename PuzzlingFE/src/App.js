import SideNavBar from "./component/SideNavBar";
import {Route, Routes} from "react-router-dom";
import HomePage from "./component/HomePage";
import Categories from "./component/category/Categories";
import EditExamQuestionForm from "./component/EditExamQuestion/EditExamQuestionForm";
import CreateExamForm from "./component/CreateExam/CreateExamForm";
import Exam from "./component/CreateExam/Exam";
import Profile from "./component/user/Profile";
import DoExamForm from "./component/doExamForm/DoExamForm";
import ShowRecordForm from "./component/show-record/ShowRecordForm";
import FormExamOfCategory from "./component/category/FormExamOfCategory";
import History from "./component/show-record/History";
import LeaderBoard from "./component/show-record/LeaderBoard";
import Status400 from "./component/err/Status400";
import Status500 from "./component/err/Status500";
import Status401 from "./component/err/Status401";
import Status403 from "./component/err/Status403";
import Other from "./component/err/Other";

function App() {

    return (
        <div>
            <SideNavBar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/categories" element={<Categories isQuizPage={false}/>}/>
                <Route path="/doAQuiz" element={<Categories isQuizPage={true} />} />
                <Route path="/exam/edit/:id/*" element={<EditExamQuestionForm/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/history" element={<History/>}/>
                <Route path="/exam/all" element={<Exam/>}/>
                <Route path="/exam/create" element={<CreateExamForm/>}/>
                <Route path="/exam/do/:examId" element={<DoExamForm/>}/>
                <Route path="/record/:recordId" element={<ShowRecordForm/>}/>
                <Route path="exam/leaderBoard/:examId" element={<LeaderBoard/>}/>
                <Route path="/exam/randomExam" element={<Exam/>}/>
                <Route path="/category/:categoriesId" element={<FormExamOfCategory />}/>
                <Route path="/400" element={<Status400/>}/>
                <Route path="/401" element={<Status401/>}/>
                <Route path="/403" element={<Status403/>}/>
                <Route path="/500" element={<Status500/>}/>
                <Route path="/*" element={<Other/>}/>
            </Routes>
        </div>
    );
}

export default App;
