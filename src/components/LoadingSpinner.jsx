import "./LoadingSpinner.css";

export default function LoadingSpinner({ size = "md" }) {
  return (
    <div className="spinner-wrap">
      <div className={`spinner spinner--${size}`} />
    </div>
  );
}
