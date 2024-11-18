import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Card from "./CardVote.jsx";

export default function Home() {
  const [role, setRole] = useState("");
  const [vote, setVote] = useState([0, 0, 0, 0]);
  const [userVote, setUserVote] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("User is not authenticated.");
        return;
      }
      console.log("Authenticated user:", user.uid);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      const votesRef = doc(db, "votes", "cardVotes");
      const votesDoc = await getDoc(votesRef);
      if (votesDoc.exists()) {
        setVote(votesDoc.data().counts); // Set state with the fetched counts
      } else {
        // If the document doesn't exist, initialize it
        await setDoc(votesRef, { counts: [0, 0, 0, 0] });
        setVote([0, 0, 0, 0]); // Initialize local state
      }

      // Check if the user has already voted
      const user = auth.currentUser;
      if (user) {
        const userVoteRef = doc(db, "userVotes", user.uid);
        const userVoteDoc = await getDoc(userVoteRef);
        if (userVoteDoc.exists()) {
          setUserVote(userVoteDoc.data().vote); // Set the user's vote
        }
      }
    };
    fetchVotes();
  }, []);
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleVote = async (cardNum) => {
    try {
      const user = auth.currentUser;

      // Check if the user has already voted
      const userVoteRef = doc(db, "userVotes", user.uid);
      const userVoteDoc = await getDoc(userVoteRef);

      if (userVoteDoc.exists()) {
        // If the user has already voted, show an alert or message
        alert("You have already voted!");
        return;
      }

      const votesRef = doc(db, "votes", "cardVotes");
      const votesDoc = await getDoc(votesRef);

      const currentCounts = votesDoc.exists()
        ? votesDoc.data().counts
        : [0, 0, 0, 0];
      currentCounts[cardNum - 1] += 1;

      // Update vote counts in Firestore
      await updateDoc(votesRef, { counts: currentCounts });
      setVote(currentCounts); // Update the local vote state

      // Record the user's vote
      await setDoc(userVoteRef, { vote: cardNum });

      setUserVote(cardNum); // Set the local user vote state
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
          sumVote={vote[0]}
          onVote={() => handleVote(1)}
          disabled={userVote !== null}
        />
        <Card
          imageSrc="/images/trump.png"
          title="Donald Trump"
          sumVote={vote[1]}
          onVote={() => handleVote(2)}
          disabled={userVote !== null}
        />
        <Card
          imageSrc="/images/biden.png"
          title="Joe Biden"
          sumVote={vote[2]} // Display individual vote for this card
          onVote={() => handleVote(3)}
          disabled={userVote !== null}
        />
        <Card
          imageSrc="/images/putin2.png"
          title="Vladimir Putin"
          sumVote={vote[3]} // Display individual vote for this card
          onVote={() => handleVote(4)}
          disabled={userVote !== null}
        />
      </div>
    </div>
  );
}
