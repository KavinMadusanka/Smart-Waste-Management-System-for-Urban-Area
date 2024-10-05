import { Routes, Route} from "react-router-dom"
import Register from "./Pages/Auth/Register";
import HomePage from "./Pages/HomePage";
import PageNotFound from "./Pages/PageNotFound";
import Login from "./Pages/Auth/Login";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateCollectionSchedule from "./Pages/Admin/CreateCollectionSchedule";
import ViewSchedules from "./Pages/Admin/ViewSchedules";
import UpdatesSchedules from "./Pages/Admin/UpdateSchedules";
import ViewSchedulesCalendar from './Pages/Admin/ViewSchedulesCalender';
import ScheduleManagement from "./Pages/Admin/ScheduleManagement";
import BulkCategories from "./Pages/Admin/BulkCategories";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path='/register' element={<Register/>}/>
      <Route path='login' element={<Login />} />
      <Route path='/adminDashboard' element={<AdminDashboard /> }/>
      <Route path='/schedule-management/create-schedule' element={<CreateCollectionSchedule />} />
      <Route path='/schedule-management/view-schedules' element={<ViewSchedules />}/>
      <Route path='/schedule-management/update-schedule/:id' element={<UpdatesSchedules />}/>
      <Route path='/schedule-management/schedule-calender-view' element={<ViewSchedulesCalendar />}/>
      <Route path='/schedule-management' element={<ScheduleManagement />}/>
      <Route path='/bulkcategories' element={<BulkCategories/>}/>
    </Routes>  
    </>
  );
}

export default App;