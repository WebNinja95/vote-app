import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Card from "./CardVote.jsx";

export default function Home() {
  const [role, setRole] = useState("");
  const [vote, setVote] = useState([0, 0, 0, 0]); // Initialize vote state as an array
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

  const handleVote = async (cardNum) => {
    try {
      const votesRef = doc(db, "votes", "cardVotes");
      const votesDoc = await getDoc(votesRef);

      if (!votesDoc.exists()) {
        // Initialize the document if it does not exist
        await setDoc(votesRef, { counts: [0, 0, 0, 0] });
        console.log("Document initialized with counts array.");
      }

      const currentCounts = votesDoc.exists()
        ? votesDoc.data().counts
        : [0, 0, 0, 0];
      currentCounts[cardNum - 1] += 1;

      await updateDoc(votesRef, { counts: currentCounts });
      setVote(currentCounts); // Update the local vote state
      console.log("Vote updated successfully:", currentCounts);
    } catch (error) {
      console.error("Error updating vote:", error);
    }
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
          sumVote={vote[0]} // Display individual vote for this card
          onVote={() => handleVote(1)}
        />
        <Card
          imageSrc="/images/trump.png"
          title="Donald Trump"
          sumVote={vote[1]} // Display individual vote for this card
          onVote={() => handleVote(2)}
        />
        <Card
          imageSrc="/images/biden.png"
          title="Joe Biden"
          sumVote={vote[2]} // Display individual vote for this card
          onVote={() => handleVote(3)}
        />
        <Card
          imageSrc="/images/putin2.png"
          title="Vladimir Putin"
          sumVote={vote[3]} // Display individual vote for this card
          onVote={() => handleVote(4)}
        />
      </div>
    </div>
  );
}
