"use client";

import { useEffect, useState } from "react";

interface Item {
  _id: string;
  name: string;
}

export default function ItemsComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  async function fetchItems() {
    const res = await fetch("/api/items", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    setItems(data);
  }

  async function addItem() {
    if (!newItem.trim()) return;

    const res = await fetch("/api/items", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newItem }),
    });

    const created = await res.json();
    setItems([...items, created]);
    setNewItem("");
  }

  async function deleteItem(id: string) {
    await fetch(`/api/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setItems(items.filter((i) => i._id !== id));
  }

  async function updateItem(id: string, newName: string) {
    if (!newName.trim()) return;

    const res = await fetch(`/api/items/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName }),
    });

    if (res.ok) {
      setItems(items.map((i) => (i._id === id ? { ...i, name: newName } : i)));
      setEditId(null);
      setEditName("");
    }
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
          <li key={item._id} className="item">
            {editId === item._id ? (
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
              {editId === item._id ? (
                <>
                  <button
                    className="delete-btn"
                    onClick={() => updateItem(item._id, editName)}
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
                      setEditId(item._id);
                      setEditName(item.name);
                    }}
                    style={{ background: "#007aff" }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item._id)}
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
