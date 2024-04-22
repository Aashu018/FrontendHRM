import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Leaverequest from './Components/Leaverequest';
import { Routes, Route } from 'react-router-dom'
import LeaveApproval from './Components/LeaveApproval';
import { UserReport } from './Components/UserReport';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/leaverequest' element={<Leaverequest />} />
        <Route path='/leaveapproval' element={<LeaveApproval />} />
        <Route path='/UserReport' element={<UserReport/>}/>
      </Routes>

    </div>
  );
}

export default App;
