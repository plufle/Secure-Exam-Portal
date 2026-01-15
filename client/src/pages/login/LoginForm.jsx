import "./LoginForm.css";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import {useState} from "react";
function LoginForm() {
    const [userType,setUserType] = useState("student");
    return (
        <div className="login-form-container">
            <div className="login-segmented-control">
                <button className={`login-segmented-btn ${userType === "student" ? "active" : ""}`} onClick={()=>setUserType("student")}>Student</button>
                <button className={`login-segmented-btn ${userType === "teacher" ? "active" : ""}`} onClick={()=>setUserType("teacher")}>Teacher</button>
            </div>
            <div className="login-form">
                <Input type="text" placeholder="Username" label="Username"/>
                <Input type="password" placeholder="Password" label="Password"/>
                <Button type="submit" text="Login" width="100%"/>
            </div>
        </div>
    );
}

export default LoginForm;