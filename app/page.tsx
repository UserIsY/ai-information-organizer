"use client";

import { useEffect, useState } from "react";

const MAX_NOTES = 10;
const MAX_NOTE_LENGTH = 500;
const MAX_ANALYSES = 10;

type Note = {
  id: number;
  text: string;
};

type Task = {
  id: number;
  title: string;
  nextAction: string;
  priority: "High Priority" | "Important" | "Later";
  completed: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  const [result, setResult] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [analysesUsed, setAnalysesUsed] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedNotes = localStorage.getItem("savedNotes");
    const savedTasks = localStorage.getItem("todayTasks");
    const savedAnalyses = localStorage.getItem("analysesUsed");
    const savedDate = localStorage.getItem("analysisDate");

    const today = new Date().toDateString();

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

if (savedTasks) {
  const parsedTasks = JSON.parse(savedTasks);

  setTasks(
    parsedTasks.map((task: any) => ({
      id: task.id,
      title: task.title || task.text || "",
      nextAction: task.nextAction || "",
      priority: task.priority || "Later",
      completed: task.completed || false,
    }))
  );
}

    // Reset analysis count when the day changes
    if (savedDate === today && savedAnalyses) {
      setAnalysesUsed(Number(savedAnalyses));
    } else {
      localStorage.setItem("analysisDate", today);
      localStorage.setItem("analysesUsed", "0");
      setAnalysesUsed(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedNotes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("todayTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("analysesUsed", analysesUsed.toString());
  }, [analysesUsed]);

  function addNote() {
    const trimmedNote = newNote.trim();

    if (!trimmedNote) {
      return;
    }

    if (notes.length >= MAX_NOTES) {
      alert("You can save up to 10 notes.");
      return;
    }

    if (trimmedNote.length > MAX_NOTE_LENGTH) {
      alert(`Each note can contain up to ${MAX_NOTE_LENGTH} characters.`);
      return;
    }

    const note: Note = {
      id: Date.now(),
      text: trimmedNote,
    };

    setNotes((prev) => [...prev, note]);
    setNewNote("");
  }

  function deleteNote(id: number) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  function getTextForAnalysis() {
    return notes.map((note) => note.text).join("\n");
  }

  async function analyzeNotes() {
    if (analysesUsed >= MAX_ANALYSES) {
      setResult(
        "You've reached today's analysis limit. Please come back tomorrow."
      );
      return;
    }

    const textToAnalyze = getTextForAnalysis();

    if (!textToAnalyze.trim()) {
      setResult("Please save at least one note before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setResult("Analyzing...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToAnalyze,
        }),
      });

      const data = await response.json();

       console.log("API RESPONSE:", data);
       if (data.result) {
         setAnalysesUsed((prev) => prev + 1);
         setResult(data.result);
       } else {
          setResult(data.error || "Something went wrong.");
        }
    } catch (error) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

function adoptPlan() {
  if (!result || result === "Analyzing...") {
    return;
  }

  const lines = result.split("\n");

  let currentPriority:
    | "High Priority"
    | "Important"
    | "Later" = "Later";

  const newTasks: Task[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "### High Priority") {
      currentPriority = "High Priority";
      continue;
    }

    if (line === "### Important") {
      currentPriority = "Important";
      continue;
    }

    if (line === "### Later") {
      currentPriority = "Later";
      continue;
    }


    if (line.startsWith("- ")) {

      const title = line.replace("- ", "").trim();

      const nextLine = lines[i + 1]?.trim() || "";

      const nextAction = nextLine.startsWith("Next action:")
         ? nextLine.replace("Next action:", "").trim()
         : "Start this task.";


      newTasks.push({
        id: Date.now() + Math.random(),
        title,
        nextAction,
        priority: currentPriority,
        completed: false,
      });
    }
  }

      setTasks((prev) => [
        ...prev,
        ...newTasks,
      ]);
}

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 40,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      > 

      <div
        style={{
         display: "flex",
         justifyContent: "space-between",
         alignItems: "center",
        }}
>
       <h1 style={{ fontSize: 32, fontWeight: "bold", margin: 0 }}>
          ClearDayline
       </h1>

       <a
          href="https://github.com/UserIsY/ClearDayline/issues"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "8px 16px",
            border: "1px solid #ccc",
            borderRadius: 8,
            textDecoration: "none",
            color: "black",
            background: "white",
            fontSize: 14,
          }}
        >
         Send Feedback
       </a>
      </div>

        <p style={{ marginTop: 10, color: "#666" }}>
          A clean and focused tool to turn messy information into actionable daily tasks.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 24,
            marginTop: 30,
            alignItems: "start",
          }}
        >
          {/* LEFT: Saved Notes */}
          <section
            style={{
              background: "white",
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold" }}>
                Saved Notes
              </h2>

              <span style={{ fontSize: 13, color: "#666" }}>
                {notes.length} / {MAX_NOTES}
              </span>
            </div>

            <textarea
              placeholder="Add a note..."
              value={newNote}
              maxLength={MAX_NOTE_LENGTH}
              onChange={(e) => setNewNote(e.target.value)}
              style={{
                width: "100%",
                height: 100,
                marginTop: 15,
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 8,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 12, color: "#888" }}>
                {newNote.length} / {MAX_NOTE_LENGTH}
              </span>

              <button
                onClick={addNote}
                disabled={
                  notes.length >= MAX_NOTES || !newNote.trim()
                }
                style={{
                   padding: "8px 14px",
                   background:
                     notes.length >= MAX_NOTES || !newNote.trim()
                       ? "#e5e5e5"
                       : "black",
                   color:
                     notes.length >= MAX_NOTES || !newNote.trim()
                       ? "#999"
                       : "white",
                   border: "none",
                   borderRadius: 8,
                   cursor:
                      notes.length >= MAX_NOTES || !newNote.trim()
                         ? "not-allowed"
                         : "pointer",
                }}
              >
                Add Note
              </button>
            </div>

            <div style={{ marginTop: 20 }}>
              {notes.length === 0 ? (
               <>
                 <p style={{ color: "#999", fontSize: 14 }}>
                   Your saved notes will appear here.
                 </p>
                 <small style={{ color: "#999" }}>
                   Saved locally in your browser.
                 </small>
               </>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      padding: 12,
                      border: "1px solid #eee",
                      borderRadius: 8,
                      marginBottom: 10,
                      background: "#fafafa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {note.text}
                      </div>

                      <button
                        onClick={() => deleteNote(note.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#888",
                          cursor: "pointer",
                          height: 24,
                        }}
                        aria-label="Delete note"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* CENTER: Task Preview */}
          <section
            style={{
              background: "white",
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: "bold" }}>
                Task Preview
              </h2>
            </div>

            <div style={{ marginTop: 30 }}>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  marginTop: 12,
                  padding: 15,
                  minHeight: 180,
                  border: "1px solid #eee",
                  borderRadius: 8,
                  background: "#fafafa",
                  lineHeight: 1.6,
                }}
              >
                {result || "Today's tasks generated from your notes will appear here."}
              </div>

            </div>

            <div
              style={{
                display:"flex",
                alignItems:"center",
                gap:12,
                marginTop:20,
               }}
            >
              <button
                 onClick={analyzeNotes}
                 disabled={isAnalyzing || analysesUsed >= MAX_ANALYSES}
                 style={{
                   padding:"12px 20px",
                   background:
                      isAnalyzing || analysesUsed >= MAX_ANALYSES
                        ? "#ccc"
                        : "black",
                   color:"white",
                   border:"none",
                   borderRadius:8,
                   cursor:
                     isAnalyzing || analysesUsed >= MAX_ANALYSES
                     ? "not-allowed"
                     : "pointer",
                  }}
              >
                {isAnalyzing ? "Analyzing..." : "AI Analyze"}
              </button>

              <span
                style={{
                 fontSize:13,
                 color:"#666",
                }}
              >
                {MAX_ANALYSES - analysesUsed} / {MAX_ANALYSES} left today
              </span>
            </div>

          </section>

          {/* RIGHT: Today's Tasks */}
          <section
            style={{
              background: "white",
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 12,
            }}
          >
            <h2 style={{ fontSize: 20, fontWeight: "bold" }}>
              Today's Tasks
            </h2>

            <button
             onClick={adoptPlan}
             disabled={
               !result ||
               result === "Analyzing..." ||
               result.includes("limit")
              }
             style={{
                marginTop: 15,
                padding: "11px 20px",
                background:
                  !result ||
                  result === "Analyzing..." ||
                  result.includes("limit")
                    ? "#e5e5e5"
                    : "black",
                color:
                 !result ||
                 result === "Analyzing..." ||
                 result.includes("limit")
                    ? "#999"
                   : "white",
                border: "none",
                borderRadius: 8,
                cursor:
                  !result ||
                  result === "Analyzing..." ||
                  result.includes("limit")
                     ? "not-allowed"
                     : "pointer",
              }}
            >
               Adopt Here
            </button>

            <div style={{ marginTop: 20 }}>

  {tasks.length === 0 ? (

    <p style={{ color: "#999", fontSize: 14 }}>
      Adopt the tasks you prefer and add them here.
    </p>

  ) : (

    ["High Priority", "Important", "Later"].map((priority) => (

      <div
        key={priority}
        style={{
          marginBottom: 20,
        }}
      >

        <h3
          style={{
            fontSize: 15,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {priority}
        </h3>


        {tasks
          .filter((task) => task.priority === priority)
          .map((task) => (

            <label
              key={task.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "10px 0",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                style={{
                  marginTop: 4,
                }}
              />


              <div>

                <div
                  style={{
                    lineHeight: 1.5,
                    color: task.completed
                      ? "#999"
                      : "#111",
                    textDecoration: task.completed
                      ? "line-through"
                      : "none",
                  }}
                >
                  {task.title}
                </div>


                <div
                  style={{
                    fontSize: 13,
                    color: "#777",
                    marginTop: 4,
                  }}
                >
                  Next action: {task.nextAction}
                </div>


              </div>

            </label>

            ))}

           </div>

           ))

          )}

        </div>
          </section>
        </div>

      </div>
    </main>
  );
}