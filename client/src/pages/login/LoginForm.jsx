import "./LoginForm.css";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import {login} from "../../services/LoginAuth";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
function LoginForm() {
    const [userType,setUserType] = useState("admin");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async () => {
        const data = await login(username, userType, password);
        console.log(localStorage.getItem("token"));
        if(data.success){
            if(userType === "student"){
                navigate("/student-dashboard",{replace:true});
            }else{
                navigate("/admin-dashboard",{replace:true});
            }
        }else{
            alert(data.message);
        }
    };

    return (
        <div className="login-form-container">
            <div className="login-segmented-control">
                <button className={`login-segmented-btn ${userType === "student" ? "active" : ""}`} onClick={()=>setUserType("student")}>Student</button>
                <button className={`login-segmented-btn ${userType === "admin" ? "active" : ""}`} onClick={()=>setUserType("admin")}>Admin</button>
            </div>
            <div className="login-form">
                <Input type="text" placeholder="Username" label="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                <Input type="password" placeholder="Password" label="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <Button type="submit" text="Login" width="100%" onClick={handleLogin}/>
            </div>
        </div>
    );
}

export default LoginForm;