import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Plaid_Link from "./Plaid_Link";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/plaid_link" element={<Plaid_Link />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

// Wrap App with Router in index.tsx or main entry point
export default App;
