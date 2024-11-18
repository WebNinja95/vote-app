import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Card from "./CardVote.jsx";
import Notification from "./Notification.jsx";

export default function Home() {
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const [vote, setVote] = useState([0, 0, 0, 0]);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null); // New state for notification
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const fetchedRole = userDoc.data().role;
          setRole(fetchedRole);
          localStorage.setItem("userRole", fetchedRole);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };
    if (!role) fetchUserRole();
    else setLoading(false);
  }, [role]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const votesRef = doc(db, "votes", "cardVotes");
        const votesDoc = await getDoc(votesRef);
        if (votesDoc.exists()) {
          setVote(votesDoc.data().counts);
        } else {
          await setDoc(votesRef, { counts: [0, 0, 0, 0] });
          setVote([0, 0, 0, 0]);
        }
        const user = auth.currentUser;
        if (user) {
          const userVoteRef = doc(db, "userVotes", user.uid);
          const userVoteDoc = await getDoc(userVoteRef);
          if (userVoteDoc.exists()) {
            setUserVote(userVoteDoc.data().vote);
          }
        }
      } catch (error) {
        console.error("Error fetching votes:", error);
      }
    };
    fetchVotes();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userRole");
    await signOut(auth);
    navigate("/");
  };

  const handleVote = async (cardNum) => {
    try {
      const user = auth.currentUser;
      const userVoteRef = doc(db, "userVotes", user.uid);
      const votesRef = doc(db, "votes", "cardVotes");

      const userVoteDoc = await getDoc(userVoteRef);
      const votesDoc = await getDoc(votesRef);
      const currentCounts = votesDoc.exists()
        ? votesDoc.data().counts
        : [0, 0, 0, 0];

      if (userVoteDoc.exists()) {
        const previousVote = userVoteDoc.data().vote;
        if (previousVote === cardNum) {
          setNotification("You have already voted for this option.");
          return;
        }
        currentCounts[previousVote - 1] -= 1;
      }

      currentCounts[cardNum - 1] += 1;
      await updateDoc(votesRef, { counts: currentCounts });
      await setDoc(userVoteRef, { vote: cardNum });

      setVote(currentCounts);
      setUserVote(cardNum);
      setNotification("Your vote has been updated successfully!");
    } catch (error) {
      console.error("Error updating vote:", error);
      setNotification(
        "An error occurred while updating your vote. Please try again."
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
          disabled={false}
        />
        <Card
          imageSrc="/images/trump.png"
          title="Donald Trump"
          sumVote={vote[1]}
          onVote={() => handleVote(2)}
          disabled={false}
        />
        <Card
          imageSrc="/images/biden.png"
          title="Joe Biden"
          sumVote={vote[2]}
          onVote={() => handleVote(3)}
          disabled={false}
        />
        <Card
          imageSrc="/images/putin2.png"
          title="Vladimir Putin"
          sumVote={vote[3]}
          onVote={() => handleVote(4)}
          disabled={false}
        />
      </div>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
