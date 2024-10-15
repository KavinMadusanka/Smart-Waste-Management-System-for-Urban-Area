import { Routes, Route} from "react-router-dom"

import HomePage from "./Pages/HomePage";
import PageNotFound from "./Pages/PageNotFound";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import CreateCollectionSchedule from "./Pages/Admin/CreateCollectionSchedule";
import ViewSchedules from "./Pages/Admin/ViewSchedules";
import UpdatesSchedules from "./Pages/Admin/UpdateSchedules";
import ViewSchedulesCalendar from './Pages/Admin/ViewSchedulesCalender';
import ScheduleManagement from "./Pages/Admin/ScheduleManagement";
import BulkCategories from "./Pages/Admin/BulkCategories";
import BulkCategoryUser from "./Pages/User/BulkCategoryUser";
import BulkWasteRequestForm from "./Pages/User/BulkWasteRequestForm"
import WasteCategory from "./Pages/Admin/WasteCategory"
import UsermaintenanceRequest from "./Pages/User/UsermaintenanceRequest"
import CollectorSchedules from "./Pages/WasteCollector/CollectorSchedules";
import UserRegister from "./Pages/Auth/UserRegister";
import WasteCollectorRegister from "./Pages/Auth/WasteCollectorRegister";
import AuthLogin from "./Pages/Auth/AuthLogin";
import CollectorProfile from "./Pages/WasteCollector/CollectorProfile";
import ViewAllSchedules from "./Pages/User/ViewAllSchedules";
import MaintaintRequestDashboard from "./Pages/Admin/MaintaintRequestDashboard"
import ApproveForm from "./Pages/Admin/ApproveForm"
import WasteCategoryUser from "./Pages/User/wasteCategoryUser"
import RegisterOption from "./Pages/Auth/RegisterOption";
import UserSchedules from "./Pages/User/UserSchedules";
import BRequests from "./Pages/User/BRequests"
import AllBRequests from "./Pages/WasteCollector/AllBRequests";
import Notifications from "./Pages/User/Notifications";
import CollectionHistory from "./Pages/User/WasteCollectionHistory";
import WasteRequestForm from "./Pages/Form/WasteRequestForm";
import Rewards from "./Pages/Admin/CreateRedeemReward";
import RedeemRewards from "./Pages/User/RedeemRewards"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./Pages/WasteCollector/Home";
import CollectorNotifications from "./Pages/WasteCollector/CollectorNotifications";
import RejectForm from "./Pages/Admin/RejectForm";
import AllRequest from "./Pages/User/AllRequest"
//import WasteRequestForm from "./Pages/Form/WasteRequestForm";
//import Rewards from "./Pages/Admin/CreateRedeemReward";
import UpdateBRequestForm from "./Pages/User/UpdateBulkWasteRequestForm"
import AdminWasteRequests from "./Pages/Admin/AdminWasteRequests"

//import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


//import WasteRequestForm from "./Pages/Form/WasteRequestForm";
//import Rewards from "./Pages/Admin/CreateRedeemReward";
//import UpdateBRequestForm from "./Pages/User/UpdateBulkWasteRequestForm"

//import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path='/adminDashboard' element={<AdminDashboard /> }/>
      <Route path='/schedule-management/create-schedule' element={<CreateCollectionSchedule />} />
      <Route path='/schedule-management/view-schedules' element={<ViewSchedules />}/>
      <Route path='/schedule-management/update-schedule/:id' element={<UpdatesSchedules />}/>
      <Route path='/schedule-management/schedule-calender-view' element={<ViewSchedulesCalendar />}/>
      <Route path='/schedule-management' element={<ScheduleManagement />}/>
      <Route path='/bulkcategories' element={<BulkCategories/>}/>
      <Route path='/bcategories' element={<BulkCategoryUser/>}/>
      <Route path='/brequestform' element={<BulkWasteRequestForm/>}/>
      <Route path='/WasteCategory' element={<WasteCategory/>}/>
      <Route path='/usermaintenanceRequest' element={<UsermaintenanceRequest/>}/>
      <Route path='/collector-schedule' element={<CollectorSchedules />}/>
      <Route path='/registerUser' element={<UserRegister />}/>
      <Route path='/registerCollector' element={<WasteCollectorRegister />}/>
      <Route path='/login' element={<AuthLogin />}/>
      <Route path='/collector-profile' element={<CollectorProfile />}/>
      <Route path='/all-schedule' element={<ViewAllSchedules />}/>
      <Route path='/maintaintRequestDashboard' element={<MaintaintRequestDashboard />}/>
      <Route path='/approveForm' element={<ApproveForm />}/>
      <Route path='/wasteCategoryUser' element={<WasteCategoryUser/>}/>
      <Route path='/register-option' element={<RegisterOption />}/>
      <Route path='/my-schedule' element={<UserSchedules />}/>
      <Route path='/bRequests' element={<BRequests />}/>
      <Route path='/allbRequests' element={<AllBRequests />}/>
      <Route path='/updatebRequest/:_id' element={<UpdateBRequestForm />}/>
      <Route path='/rejectForm' element={<RejectForm />}/>
      <Route path='/allRequest' element={<AllRequest />}/>



      <Route path='/notifications' element={<Notifications />}/>
      <Route path='/collection-history' element={<CollectionHistory />}/>
      <Route path='/WasteRequestForm' element={<WasteRequestForm/>}/>
      <Route path='/Rewards' element={<Rewards/>}/>
      <Route path='/RedeemRewards' element={<RedeemRewards/>} />
      <Route path='/whome' element={<Home />}/>
      <Route path="/notify" element={<CollectorNotifications />}/>
      <Route path='/WasteRequestForm' element={<WasteRequestForm/>}/>
      <Route path='/Rewards' element={<Rewards/>}/>
      <Route path='/RedeemRewards' element={<RedeemRewards/>} />
      <Route path='/AdminWasteRequests' element={<AdminWasteRequests/>} />
    </Routes>

    </>
  );
}

export default App;