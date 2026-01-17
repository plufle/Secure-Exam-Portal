import "./Button.css";
function Button({text,width, onClick}) {
    return (
        <button className="button" style={{width}} onClick={onClick}>{text}</button>
    );
}
export default Button;