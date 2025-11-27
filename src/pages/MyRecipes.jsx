import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeUserRecipes, deleteRecipe } from "../lib/db";

export default function MyRecipes() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserRecipes(user.uid, (snap) => {
      const rows = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() }));
      setItems(rows);
    });
    return () => unsub && unsub();
  }, [user]);

  if (!user) return <p style={{ padding: 16 }}>Please log in to view saved recipes.</p>;

  async function onDelete(id) {
    try {
      await deleteRecipe(id);
    } catch (e) {
      setErr(e?.message || "Delete failed");
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Recipes</h2>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {!items.length && <p>No recipes yet. Generate one on the Recipe page.</p>}
        {items.map((r) => (
          <div key={r.id} style={{ background: "#fff", borderRadius: 12, padding: 12, marginBottom: 12, border: "1px solid #cbd5e1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{r.prompt?.slice(0, 60) || "Recipe"}</strong>
              <button onClick={() => onDelete(r.id)} style={{ background: "#ef4444" }}>Delete</button>
            </div>
            <pre style={{ whiteSpace: "pre-wrap" }}>{r.recipeText}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
