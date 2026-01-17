import { useNavigate } from "react-router-dom";
import { logout } from "../../services/LoginAuth";
function StudentDashboard() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Student Dashboard</h1>
            <button onClick={() => {
                logout();
                navigate("/");
            }}>Logout</button>
        </div>
    );
}

export default StudentDashboard;