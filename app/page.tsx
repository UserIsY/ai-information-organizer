"use client";

import { useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");

  async function analyzeNotes() {

  setResult("Analyzing...");

  const response = await fetch("/api/analyze", {

    method: "POST",

    headers:{
      "Content-Type":"application/json",
    },

    body:JSON.stringify({
      text:notes,
    }),

  });


  const data = await response.json();

  if (data.result) {
    setResult(data.result);
  } else {
    setResult(data.error || "Something went wrong.");
  }

}

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, fontWeight: "bold" }}>
        AI Information Organizer
      </h1>

      <p style={{ marginTop: 10, color: "#666" }}>
        Paste messy text. Get today's actionable list.
      </p>

      <textarea
        placeholder="Paste your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{
          width: "100%",
          height: 200,
          marginTop: 20,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      />

      <button
        onClick={analyzeNotes}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: 8,
        }}
      >
        Analyze
      </button>

    <a
       href="https://github.com/UserIsY/ai-information-organizer/issues"
       target="_blank"
       style={{
       display: "inline-block",
       marginTop: 20,
       marginLeft: 10,
       padding: "10px 20px",
       border: "1px solid #ccc",
       borderRadius: 8,
       textDecoration: "none",
       color: "black",
       }}
    >
      Feedback
    </a>

      <div style={{ marginTop: 30 }}>
        <h2>Result</h2>

        <div
          style={{
           whiteSpace: "pre-wrap",
           marginTop: 10,
           }}
        >
          {result || "Waiting for analysis..."}

        </div>
      </div>
    </div>
  );
}