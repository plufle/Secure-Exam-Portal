import "./LoginForm.css";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import {login, studentChangePassword} from "../../services/LoginAuth";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginForm() {
    const [userType,setUserType] = useState("admin");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [isPasswordChangeMode, setIsPasswordChangeMode] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        const data = await login(username, userType, password);
        if(data.success){
            if(userType === "student"){
                navigate("/student-dashboard",{replace:true});
            }else{
                navigate("/admin-dashboard",{replace:true});
            }
        }else{
            if(data.needsPasswordChange) {
                setIsPasswordChangeMode(true);
                setStudentEmail(data.email);
            } else {
                alert(data.message);
            }
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (newPassword === password) {
            alert("New password cannot be the same as the old temporary password");
            return;
        }

        const data = await studentChangePassword(studentEmail, password, newPassword);
        if (data.success) {
            alert("Password updated successfully!");
            navigate("/student-dashboard", {replace:true});
        } else {
            alert(data.message);
        }
    };

    if (isPasswordChangeMode) {
        return (
            <div className="login-form-container">
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h3>Change Password Required</h3>
                    <p>Please update your temporary password to continue.</p>
                </div>
                <div className="login-form">
                    <Input type="password" placeholder="New Password" label="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                    <Input type="password" placeholder="Confirm Password" label="Confirm Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <Button type="submit" text="Change Password" width="100%" onClick={handleChangePassword}/>
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                        <button type="button" className="btn-link" style={{background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', padding: 0}} onClick={() => setIsPasswordChangeMode(false)}>Back to Login</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-form-container">
            <div className="login-segmented-control">
                <button className={`login-segmented-btn ${userType === "student" ? "active" : ""}`} onClick={()=>setUserType("student")}>Student</button>
                <button className={`login-segmented-btn ${userType === "admin" ? "active" : ""}`} onClick={()=>setUserType("admin")}>Admin</button>
            </div>
            <div className="login-form">
                <Input type="text" placeholder="Username (Email)" label="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <Input type="password" placeholder="Password" label="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <Button type="submit" text="Login" width="100%" onClick={handleLogin}/>
            </div>
        </div>
    );
}

export default LoginForm;