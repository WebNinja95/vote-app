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

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>User List:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.uid}>
            {user.name} - {user.email} ({user.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
