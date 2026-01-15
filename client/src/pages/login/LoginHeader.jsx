import Button from "../../components/button/Button";
import { useEffect, useState } from "react";
import { TbCone2 } from "react-icons/tb";
import "./LoginHeader.css";
function LoginHeader() {
    const [status, setStatus] = useState(navigator.onLine ? "Online" : "Offline");
    useEffect(() => {
        const handleOnline = () => setStatus("Online");
        const handleOffline = () => setStatus("Offline");
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <div className="header">
            <div className="header-title-container">
                <TbCone2 className="header-icon" />
                <h1 className="header-title">Exam Portal</h1>
            </div>
            <div className="header-left">
                <div className="status-container">
                    <div className="status-dot" style={{ backgroundColor: status === "Online" ? "green" : "red" }}></div>
                    <p className="status-text">Systems {status}</p>
                </div>
                <div className="header-buttons">
                    <Button text="Contact Support" />
                </div>
            </div>
        </div>
    );
}
export default LoginHeader;