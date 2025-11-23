import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

type User = { userid: number; firstname: string; lastname: string; email: string };
type Item = { itemid: number; title: string; location: string; description?: string; decisiontype?: string };

const Home: React.FC = () => (
  <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8f9fa" }}>
    <h1 style={{ fontSize: "48px", fontWeight: "600", marginBottom: "40px", color: "#1f2937" }}>Lost and Found</h1>
    <div style={{ display: "flex", gap: "16px" }}>
      <Link to="/register" style={{ padding: "12px 24px", background: "#1f2937", color: "white", textDecoration: "none", borderRadius: "6px", fontSize: "16px" }}>Register</Link>
      <Link to="/login" style={{ padding: "12px 24px", background: "white", color: "#1f2937", textDecoration: "none", borderRadius: "6px", fontSize: "16px", border: "2px solid #1f2937" }}>Login</Link>
    </div>
  </div>
);

const Register: React.FC = () => {
  const [form, setForm] = useState({ firstname: "", lastname: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/register", form);
      setMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#f8f9fa" }}>
      <div style={{ background: "white", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "24px", fontSize: "28px", textAlign: "center" }}>Register</h2>
        <form onSubmit={handleSubmit}>
          {["firstname", "lastname", "email"].map(field => (
            <div key={field} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>{field === "firstname" ? "First Name" : field === "lastname" ? "Last Name" : "Email"}</label>
              <input type={field === "email" ? "email" : "text"} value={form[field as keyof typeof form]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
            </div>
          ))}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#1f2937", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer", marginBottom: "16px" }}>Register</button>
          {msg && <p style={{ marginBottom: "16px", fontSize: "14px", color: msg.includes("failed") ? "#dc2626" : "#666", textAlign: "center" }}>{msg}</p>}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#666", marginTop: "16px" }}>Already have an account? <Link to="/login" style={{ color: "#1f2937", textDecoration: "underline", fontWeight: "500" }}>Login</Link></p>
        </form>
      </div>
    </div>
  );
};

const Login: React.FC<{ setUser: (u: User) => void }> = ({ setUser }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post<User>("/login", form);
      setUser(res.data);
      navigate("/dashboard");
    } catch (err: any) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "#f8f9fa" }}>
      <div style={{ background: "white", borderRadius: "8px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "24px", fontSize: "28px", textAlign: "center" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
          </div>
          <button type="submit" style={{ width: "100%", padding: "12px", background: "#1f2937", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer", marginBottom: "16px" }}>Login</button>
          {msg && <p style={{ marginBottom: "16px", fontSize: "14px", color: "#dc2626", textAlign: "center" }}>{msg}</p>}
          <p style={{ textAlign: "center", fontSize: "14px", color: "#666", marginTop: "16px" }}>Don't have an account? <Link to="/register" style={{ color: "#1f2937", textDecoration: "underline", fontWeight: "500" }}>Register</Link></p>
        </form>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ user: User; setUser: (u: User | null) => void }> = ({ user, setUser }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [showClaim, setShowClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({ itemID: "", claimDescription: "" });

  useEffect(() => {
    API.get<Item[]>("/item").then(res => setItems(res.data)).catch(() => setItems([]));
  }, []);

  const handleClaim = async () => {
    if (!claimForm.itemID) return;
    await API.post("/claim", { ...claimForm, itemID: parseInt(claimForm.itemID), userID: user.userid });
    setClaimForm({ itemID: "", claimDescription: "" });
    setShowClaim(false);
    API.get<Item[]>("/item").then(res => setItems(res.data));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setShowClaim(true)} style={{ padding: "12px 24px", background: "#1f2937", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer", fontWeight: "500" }}>Make a new claim</button>
        <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#1f2937", fontSize: "16px", padding: "8px 16px", borderRadius: "8px", background: "#f3f4f6" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1f2937", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600" }}>{user.firstname[0]}{user.lastname[0]}</div>
          <span style={{ fontWeight: "500" }}>{user.firstname} {user.lastname}</span>
        </Link>
      </div>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>No items found</p>
            <p style={{ fontSize: "14px" }}>Items will appear here once they are added to the system.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {items.map(i => (
              <div key={i.itemid} style={{ background: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px", color: "#1f2937" }}>{i.title}</h3>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>{i.location}</p>
                {i.description && <p style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>{i.description}</p>}
                <span style={{ display: "inline-block", padding: "4px 12px", fontSize: "12px", borderRadius: "12px", background: i.decisiontype === "found" ? "#dbeafe" : "#fee2e2", color: i.decisiontype === "found" ? "#1e40af" : "#991b1b", fontWeight: "500" }}>{i.decisiontype || "lost"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {showClaim && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "24px", width: "90%", maxWidth: "400px" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>Make a New Claim</h3>
            <select value={claimForm.itemID} onChange={(e) => setClaimForm({ ...claimForm, itemID: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", marginBottom: "16px" }}>
              <option value="">Select Item</option>
              {items.map(i => <option key={i.itemid} value={i.itemid}>{i.title}</option>)}
            </select>
            <input type="text" placeholder="Claim description" value={claimForm.claimDescription} onChange={(e) => setClaimForm({ ...claimForm, claimDescription: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleClaim} style={{ flex: 1, padding: "10px", background: "#1f2937", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>Submit</button>
              <button onClick={() => setShowClaim(false)} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#1f2937", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile: React.FC<{ user: User; setUser: (u: User | null) => void }> = ({ user, setUser }) => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", padding: "40px", background: "#f8f9fa" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", background: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "24px", fontSize: "28px" }}>Profile</h2>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Name</p>
          <p style={{ fontSize: "18px" }}>{user.firstname} {user.lastname}</p>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Email</p>
          <p style={{ fontSize: "18px" }}>{user.email}</p>
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", background: "#1f2937", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>Back to Dashboard</button>
          <button onClick={() => { setUser(null); navigate("/"); }} style={{ padding: "10px 20px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>Logout</button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/items" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Home />} />
        <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Home />} />
      </Routes>
    </Router>
  );
};

export default App;
