import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import "./LoginPage.css";
function LoginPage() {
    return (
        <div className="login-page">
            <LoginHeader />
            <div className="login-container">
                <h1 className="login-text-title">Welcome Back</h1>
                <p className="login-text-subtitle">Access your examnination dashboard</p>
                <LoginForm />
            </div>
        </div>
    );
}

export default LoginPage;