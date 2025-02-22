import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InfoNGOform from "./pages/InfoNGOform";
import RegisterNGO from "./pages/RegisterNGO";
import LoginNGO from "./pages/LoginNGO";
import RegisterUser from "./pages/RegisterUser";
import LoginUser from "./pages/LoginUser";
// import HomePage from "./pages/HomePage";
// import NGOIssuesDashboard from './pages/NGOIssuesDashboard';
// import ProfilePage from './pages/ProfilePage';
import Reportform from "./pages/Reportform";
import Postform from "./pages/Postform";
// import CategorySearch from "./pages/CategorySearch";

function App() {

  return (

    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/register-ngo-info" element={<InfoNGOform />} />
        <Route path="/register-ngo" element={<RegisterNGO />} />
        <Route path="/login-ngo" element={<LoginNGO />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/login-user" element={<LoginUser />} />
        {/* <Route path="/dashboard" element={<NGOIssuesDashboard />} /> */}
        {/* <Route path="/profile" element={<ProfilePage/>} /> */}
        <Route path="/report" element={<Reportform />} />
        <Route path="/post" element={<Postform />} />
        {/* <Route path="/category/:category" element={<CategorySearch />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
