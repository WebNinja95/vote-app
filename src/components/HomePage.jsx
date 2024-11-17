import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Card from "./CardVote.jsx";

export default function Home() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  // Fetch user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };
    fetchUserRole();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <h2>Vote</h2>
        <div>
          {role === "admin" && (
            <button className="admin-button" onClick={() => navigate("/admin")}>
              Admin
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="cards-container">
        <Card
          imageSrc="/images/barack.png"
          title="Barack Obama"
          onVote={() => handleVote(1)}
        />
        <Card
          imageSrc="/images/trump.png"
          title="Donald Trump"
          onVote={() => handleVote(2)}
        />
        <Card
          imageSrc="/images/biden.png"
          title="Joe Biden"
          onVote={() => handleVote(3)}
        />
        <Card
          imageSrc="/images/putin2.png"
          title="Vladimir Putin"
          onVote={() => handleVote(4)}
        />
      </div>
    </div>
  );
}
