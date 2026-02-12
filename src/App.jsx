import { useState } from "react";
import Header from "./components/Header.jsx";
import ReferralForm from "./components/ReferralForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <>
      <Header />
      <div className="app-container">
        <ReferralForm onSuccess={() => setRefreshToken((t) => t + 1)} />
      </div>
      <Dashboard reloadSignal={refreshToken} />
    </>
  );
}

export default App;
