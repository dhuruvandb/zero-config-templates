import { useEffect, useState } from "react";
import api from "../../api/api";

interface Item {
  id: string;
  name: string;
}

export default function ItemsComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");

  async function fetchItems() {
    const data = await api.get("/api/items");
    setItems(Array.isArray(data) ? data : []);
  }

  async function addItem() {
    if (!newItem.trim()) return;

    const created = await api.post("/api/items", { name: newItem });
    if (created?.id) {
      setItems([...items, created]);
    }
    setNewItem("");
  }

  async function deleteItem(id: string) {
    await api.del(`/api/items/${id}`);
    setItems(items.filter((i) => i.id !== id));
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
            {item.name}
            <button className="delete-btn" onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
