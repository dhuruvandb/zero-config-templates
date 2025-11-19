import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Auth } from "./components/Auth/Auth";
import ItemsComponent from "./components/Items/Items";

function App() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext missing");

  if (!auth.accessToken) {
    return <Auth />;
  }

  return (
    <div className="app-wrapper">
      <div className="app-header">
        <h1>MERN Starter CRUD (Authenticated)</h1>

        <button className="logout-btn" onClick={() => auth.logout()}>
          Logout
        </button>
      </div>

      <ItemsComponent accessToken={auth.accessToken} />
    </div>
  );
}

export default App;
