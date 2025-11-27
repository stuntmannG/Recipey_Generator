// src/pages/Recipe.jsx
import React, { useEffect, useState } from "react"; // ADDED: useEffect
import { useAuth } from "../context/AuthContext";
import { generateRecipe } from "../lib/ai";
import { saveRecipe } from "../lib/db";
// ADDED: Firestore imports for the inline listener + delete
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Recipe() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);      // ✅ already here
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const chef = "\u{1F468}\u{200D}\u{1F373}";

  const [items, setItems] = useState([]);      
  const [listError, setListError] = useState(""); 

  if (!user) return <p style={{ padding: 16 }}>Please log in to use the recipe generator.</p>;

   useEffect(() => {
  if (!user?.uid) return;

  const col = collection(db, "recipes");
  const qy = query(
    col,
    where("ownerId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const unsub = onSnapshot(
    qy,
    (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setListError("");
    },
    (e) => {
      console.error("recipes listener error:", e);
      setListError(e.message || "Failed to load recipes");
    }
  );

  return () => unsub();
}, [user?.uid]);

 // ADDED

  async function onGenerate(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    setOutput("");
    try {
      setLoading(true);
      const text = await generateRecipe(prompt);
      setOutput(text);
      setSaving(true);
      const id = await saveRecipe({
        uid: user.uid,           // keep passing uid; saveRecipe should write ownerId
        email: user.email,
        prompt,
        recipeText: text
      });
      setStatus(`Saved to Firebase (id: ${id.slice(0,6)}…)`);
    } catch (err) {
      setError(err?.message || "Generation failed");
    } finally {
      setLoading(false);
      setSaving(false);
    }
  }

  async function onSaveManual() {
    if (!output) return;
    try {
      setSaving(true);
      const id = await saveRecipe({
        uid: user.uid,           // keep passing uid; saveRecipe should write ownerId
        email: user.email,
        prompt,
        recipeText: output
      });
      setStatus(`Saved to Firebase (id: ${id.slice(0,6)}…)`);
    } catch (err) {
      setError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // ADDED: delete handler for items in the list
  async function onDelete(id) {
    try {
      await deleteDoc(doc(db, "recipes", id));
    } catch (e) {
      console.error("delete failed:", e);
      setListError(e?.message || "Delete failed");
    }
  } // ADDED

  return (
    <div className="container" style={{ position: "relative" }}>
      <img
        src={process.env.PUBLIC_URL + "/assets/cart.gif"}
        alt="Grocery cart"
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          width: 140,
          height: "auto",
          opacity: 0.9,
          pointerEvents: "none",
          borderRadius: 12
        }}
      />
      <div className="card">
        <h2>{chef}Recipey_Helper </h2>
        <form onSubmit={onGenerate}>
          <textarea
            placeholder="List ingredients, e.g., chicken, spinach, rice"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" disabled={loading || !prompt.trim()}>
              {loading ? "Thinking…" : "Generate & Save"}
            </button>
            <button type="button" onClick={onSaveManual} disabled={saving || !output}>
              {saving ? "Saving…" : "Save Again"}
            </button>
          </div>
        </form>
        {status && <p style={{ color: "#0a7" }}>{status}</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {output && (
          <>
            <hr />
            <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>
          </>
        )}
      </div>

      {/* ADDED: Saved Recipes list card */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3>Saved Recipes</h3>
        {listError && <div style={{ color: "crimson", marginBottom: 8 }}>{listError}</div>}
        {items.length === 0 ? (
          <div>No recipes yet.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
            {items.map((r) => {
              let when = "";
              try {
                if (r.createdAt?.toDate) when = r.createdAt.toDate().toLocaleString();
              } catch {}
              const subtitle = r.prompt || r.title || "";
              const body = r.recipeText || "";
              return (
                <li key={r.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <strong>{subtitle || "(untitled recipe)"}</strong>
                      {when && (
                        <span style={{ marginLeft: 8, fontSize: ".85rem", color: "#666" }}>
                          {when}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => onDelete(r.id)}
                      style={{ background: "transparent", border: "1px solid #ddd", padding: "6px 10px", borderRadius: 10 }}
                    >
                      Delete
                    </button>
                  </div>
                  {body && <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{body}</pre>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {/* END ADDED */}
    </div>
  );
}
