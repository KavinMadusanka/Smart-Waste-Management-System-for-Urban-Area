import { Routes, Route} from "react-router-dom"
import Register from "./Pages/Auth/Register";
import HomePage from "./Pages/HomePage";
import PageNotFound from "./Pages/PageNotFound";
import Login from "./Pages/Auth/Login";


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path='/register' element={<Register/>}/>
      <Route path='login' element={<Login />} />
    </Routes>
    
     
    </>
  );
}

export default App;