// Card.js
import React from "react";

export default function Card({ imageSrc, title, onVote }) {
  return (
    <div className="card">
      <img src={imageSrc} alt={title} className="card-image" />
      <h3 className="card-title">{title}</h3>
      <button className="vote-button" onClick={onVote}>
        Vote
      </button>
    </div>
  );
}
