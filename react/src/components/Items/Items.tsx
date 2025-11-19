import { useEffect, useState } from "react";
import api from "../../api/api";

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

  async function fetchItems() {
    const data = await api.authGet("/api/items", accessToken);
    setItems(data);
  }

  async function addItem() {
    if (!newItem.trim()) return;

    const res = await fetch("http://localhost:5000/api/items", {
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
    await api.authDelete(`/api/items/${id}`, accessToken);
    setItems(items.filter((i) => i._id !== id));
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
            {item.name}
            <button className="delete-btn" onClick={() => deleteItem(item._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
