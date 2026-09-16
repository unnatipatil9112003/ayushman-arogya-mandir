import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginRegister from './pages/LoginRegister';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Families from "./pages/Families";
import AddFamily from './pages/AddFamily';
import FamilyDetails from './pages/FamilyDetails';
import AddMember from './pages/AddMember';
import MemberDetails from './pages/MembersDetails';
import Center from './pages/Center';
import SubCenter from './pages/SubCenter';
import Village from './pages/Village';

function App() {
  return (
    <BrowserRouter basename='/build'>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/families" element={<Families />} />
        <Route path="/add-family" element={<AddFamily />} />
        <Route path="/family-details" element={<FamilyDetails />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/member-details" element={<MemberDetails  />} />
        <Route path="/center" element={<Center />} />
        <Route path="/sub-center" element={<SubCenter />} />
        <Route path="/village" element={<Village />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
