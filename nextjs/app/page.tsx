"use client";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { authClient } from "@/lib/auth-client";
import { Auth } from "./components/Auth/Auth";
import ItemsComponent from "./components/Items/Items";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const auth = useContext(AuthContext);

  if (isPending) {
    return <div className="loading">Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="app-wrapper">
      <div className="app-header">
        <h1>MERN Starter CRUD (Authenticated)</h1>

        <button className="logout-btn" onClick={() => auth?.logout()}>
          Logout
        </button>
      </div>

      <ItemsComponent />
    </div>
  );
}
