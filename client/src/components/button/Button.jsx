import "./Button.css";
function Button({text,width}) {
    return (
        <button className="button" style={{width}}>{text}</button>
    );
}
export default Button;