import { useEffect, useState } from "react";
import "./style.css";

interface ItemsProps {
  accessToken: string;
}

interface Item {
  _id?: string;
  name: string;
}

function ItemsComponent({ accessToken }: ItemsProps) {
  
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(API_URL.trim());
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, []);

  const API_URL = `${
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
  }/api/items`;

  const fetchItems = async () => {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: newItem }),
    });
    setNewItem("");
    fetchItems();
  };

  const deleteItem = async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setItems(items.filter((i) => i._id !== id));
  };

  useEffect(() => {
    fetchItems();
  }, [accessToken]);

  return (
    <div className="app-wrapper">
      <div className="add-item-box">
        <input
          type="text"
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
            <button
              className="delete-btn"
              onClick={() => item._id && deleteItem(item._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ItemsComponent;
