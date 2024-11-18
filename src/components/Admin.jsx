import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => doc.data());
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userRole");
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Admin Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <h3>User List</h3>
      <div className="user-list">
        {users.map((user) => (
          <div className="user-card" key={user.uid}>
            <h4>{user.name}</h4>
            <p>Email: {user.email}</p>
            <p>
              Role:{" "}
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
