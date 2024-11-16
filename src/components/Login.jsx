import { FaUser, FaLock } from "react-icons/fa";

export default function () {
  return (
    <div className="warp">
      <div className="Form-Login">
        <h2>Login</h2>
        <form>
          <div className="input-container">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Email" className="input-field" />
          </div>
          <div className="input-container">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
            />
          </div>
          {/* Create Account Link */}
          <a href="/signup" className="create-account-link">
            Create an Account
          </a>
          <button className="login-button">Login</button>
        </form>
      </div>
      <img src="/images/vote2.jpg" alt="" />
    </div>
  );
}
