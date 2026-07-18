"use client";

import { useEffect, useState } from "react";

interface Item {
  id: string;
  name: string;
}

export default function ItemsComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function apiFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(path, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers as any },
      ...options,
    });
    return res.json();
  }

  async function fetchItems() {
    const data = await apiFetch("/api/items");
    setItems(Array.isArray(data) ? data : []);
  }

  async function addItem() {
    if (!newItem.trim()) return;

    const created = await apiFetch("/api/items", {
      method: "POST",
      body: JSON.stringify({ name: newItem }),
    });

    setItems([...items, created]);
    setNewItem("");
  }

  async function deleteItem(id: string) {
    await apiFetch(`/api/items/${id}`, { method: "DELETE" });
    setItems(items.filter((i) => i.id !== id));
  }

  async function updateItem(id: string, newName: string) {
    if (!newName.trim()) return;

    await apiFetch(`/api/items/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name: newName }),
    });

    setItems(items.map((i) => (i.id === id ? { ...i, name: newName } : i)));
    setEditId(null);
    setEditName("");
  }

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <div className="add-item-box">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item name"
        />
        <button className="add-item-btn" onClick={addItem}>
          Add
        </button>
      </div>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id} className="item">
            {editId === item.id ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Edit item name"
                autoFocus
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  marginRight: "0.5rem",
                  border: "1px solid #007aff",
                  borderRadius: "4px",
                }}
              />
            ) : (
              item.name
            )}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {editId === item.id ? (
                <>
                  <button
                    className="delete-btn"
                    onClick={() => updateItem(item.id, editName)}
                    style={{ background: "#34c759" }}
                  >
                    Save
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setEditId(item.id);
                      setEditName(item.name);
                    }}
                    style={{ background: "#007aff" }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
