import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function HomePage() {
  const location = useLocation();
  const { role } = location.state || { role: "user" };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      const fetchUsers = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const userList = querySnapshot.docs.map((doc) => doc.data());
          setUsers(userList);
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };
      fetchUsers();
    }
  }, [role]);

  return (
    <div>
      <h1>Welcome to the Homepage!</h1>

      {role === "admin" && (
        <div className="admin-section">
          <h2>Admin Panel: User List</h2>
          <ul>
            {users.map((user) => (
              <li key={user.uid}>
                <strong>Name:</strong> {user.name}, <strong>Email:</strong>{" "}
                {user.email}, <strong>Role:</strong> {user.role}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p>This is the main content of the homepage for all users.</p>
    </div>
  );
}
