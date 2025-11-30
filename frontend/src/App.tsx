import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000" });

type User = { userid: number; firstname: string; lastname: string; email: string };
type Item = { itemid: number; title: string; location: string; date?: string; description?: string; decisiontype?: string; campusid?: number; userid?: number };
type Campus = { campusid: number; dropoff: string };
type Claim = { claimid: number; claimdate?: string; status?: string; claimdescription: string; itemid: number; userid: number };

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
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [showClaim, setShowClaim] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [claimForm, setClaimForm] = useState({ itemID: "", claimDescription: "", status: "found", claimDate: new Date().toISOString().split('T')[0] });
  const [itemForm, setItemForm] = useState({ title: "", location: "", date: new Date().toISOString().split('T')[0], description: "", decisionType: "lost", campusID: "" });
  const [showEditItem, setShowEditItem] = useState(false);
  const [editForm, setEditForm] = useState({ itemid: 0, title: "", location: "", date: new Date().toISOString().split("T")[0], description: "", decisionType: "lost", campusID: "" });

  // reload items helper
  const reloadItems = () => {
    API.get<Item[]>("/item").then(res => setItems(res.data)).catch(() => setItems([]));
  };

  useEffect(() => {
    reloadItems();
    API.get<Campus[]>("/campus").then(res => setCampuses(res.data)).catch(() => setCampuses([]));
  }, []);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...itemForm,
        campusID: itemForm.campusID ? parseInt(itemForm.campusID) : null,
        campusid: itemForm.campusID ? parseInt(itemForm.campusID) : null,
        userID: user.userid,
        userid: user.userid,
        decisionType: itemForm.decisionType,
        decisiontype: itemForm.decisionType
      };
      await API.post("/item", payload);
      setItemForm({ title: "", location: "", date: new Date().toISOString().split('T')[0], description: "", decisionType: "lost", campusID: "" });
      setShowCreateItem(false);
      reloadItems();
    } catch (err: any) {
      console.error("Error creating item:", err);
      window.alert("Error creating item: " + (err.response?.data?.error ?? err.message));
    }
  };

  const handleClaim = async () => {
    if (!claimForm.itemID) return;
    try {
      const payload = {
        itemID: parseInt(claimForm.itemID),
        itemid: parseInt(claimForm.itemID),
        userID: user.userid,
        userid: user.userid,
        claimDescription: claimForm.claimDescription,
        claimdescription: claimForm.claimDescription,
        status: claimForm.status,
        claimDate: claimForm.claimDate,
        claimdate: claimForm.claimDate
      };
      await API.post("/claim", payload);
      setClaimForm({ itemID: "", claimDescription: "", status: "found", claimDate: new Date().toISOString().split('T')[0] });
      setShowClaim(false);
      reloadItems();
    } catch (err: any) {
      console.error("Error creating claim:", err);
      window.alert("Error creating claim: " + (err.response?.data?.error ?? err.message));
    }
  };

  // Open edit modal and populate form
  const openEditModal = (i: Item) => {
    setEditForm({
      itemid: i.itemid || 0,
      title: i.title || "",
      location: i.location || "",
      date: i.date ? new Date(i.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      description: i.description || "",
      decisionType: i.decisiontype || "lost",
      campusID: i.campusid ? String(i.campusid) : ""
    });
    setShowEditItem(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const payload = {
      title: editForm.title,
      description: editForm.description,
      location: editForm.location,
      date: editForm.date ? new Date(editForm.date).toISOString().split("T")[0] : null,
      decisionType: editForm.decisionType,
      decisiontype: editForm.decisionType,
      campusID: editForm.campusID ? parseInt(editForm.campusID) : null,
      campusid: editForm.campusID ? parseInt(editForm.campusID) : null,
      userID: user.userid,
      userid: user.userid
    };
  
    console.log("PATCH /item/" + editForm.itemid, payload);
    const res = await API.patch(`/item/${editForm.itemid}`, payload);
    console.log("PATCH response:", res.data);
    setShowEditItem(false);
    reloadItems();
  };
  
  const handleDeleteItem = async (itemid: number) => {
    const confirmed = window.confirm("Delete this item? This action cannot be undone.");
    if (!confirmed) return;
    try {
      await API.delete(`/item/${itemid}`);
      reloadItems();
      window.alert("Item deleted");
    } catch (err: any) {
      console.error("Delete error:", err);
      if (err.response) {
        window.alert("Delete failed: " + (err.response.data?.error ?? JSON.stringify(err.response.data)));
      } else if (err.request) {
        window.alert("Network error deleting item - check backend.");
      } else {
        window.alert("Delete failed: " + err.message);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => setShowCreateItem(true)} style={{ padding: "12px 24px", background: "#059669", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer", fontWeight: "500" }}>Create Lost Item</button>
          <button onClick={() => setShowClaim(true)} style={{ padding: "12px 24px", background: "#1f2937", color: "white", border: "none", borderRadius: "6px", fontSize: "16px", cursor: "pointer", fontWeight: "500" }}>Make a Claim</button>
        </div>
        <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "#1f2937", fontSize: "16px", padding: "8px 16px", borderRadius: "8px", background: "#f3f4f6" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1f2937", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600" }}>{user.firstname[0]}{user.lastname[0]}</div>
          <span style={{ fontWeight: "500" }}>{user.firstname} {user.lastname}</span>
        </Link>
      </div>
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px", color: "#1f2937" }}>All Lost & Found Items</h2>
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
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}><strong>Location:</strong> {i.location}</p>
                {i.date && <p style={{ fontSize: "14px", color: "#666", marginBottom: "8px" }}><strong>Date:</strong> {new Date(i.date).toLocaleDateString()}</p>}
                {i.description && <p style={{ fontSize: "14px", marginBottom: "12px", color: "#374151" }}>{i.description}</p>}
                <span style={{ display: "inline-block", padding: "4px 12px", fontSize: "12px", borderRadius: "12px", background: i.decisiontype === "found" ? "#dbeafe" : i.decisiontype === "resolved" ? "#d1fae5" : "#fee2e2", color: i.decisiontype === "found" ? "#1e40af" : i.decisiontype === "resolved" ? "#065f46" : "#991b1b", fontWeight: "500" }}>{i.decisiontype || "lost"}</span>

                {/* Owner-only Edit/Delete buttons */}
                {i.userid === user.userid && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button onClick={() => openEditModal(i)} style={{ padding: "8px 12px", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDeleteItem(i.itemid || 0)} style={{ padding: "8px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateItem && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "24px", width: "90%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>Create Lost Item</h3>
            <form onSubmit={handleCreateItem}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Title *</label>
                <input type="text" value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Location *</label>
                <input type="text" value={itemForm.location} onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Date</label>
                <input type="date" value={itemForm.date} onChange={(e) => setItemForm({ ...itemForm, date: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Description</label>
                <textarea value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} rows={3} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Type *</label>
                <select value={itemForm.decisionType} onChange={(e) => setItemForm({ ...itemForm, decisionType: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Campus *</label>
                <select value={itemForm.campusID} onChange={(e) => setItemForm({ ...itemForm, campusID: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                  <option value="">Select Campus</option>
                  {campuses.map(c => <option key={c.campusid} value={c.campusid}>{c.dropoff}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: "#059669", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>Create Item</button>
                <button type="button" onClick={() => setShowCreateItem(false)} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#1f2937", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showClaim && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "24px", width: "90%", maxWidth: "400px" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>Make a New Claim</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Select Item *</label>
              <select value={claimForm.itemID} onChange={(e) => setClaimForm({ ...claimForm, itemID: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                <option value="">Select Item</option>
                {items.map(i => <option key={i.itemid} value={i.itemid}>{i.title} - {i.location}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Status *</label>
              <select value={claimForm.status} onChange={(e) => setClaimForm({ ...claimForm, status: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Claim Date *</label>
              <input type="date" value={claimForm.claimDate} onChange={(e) => setClaimForm({ ...claimForm, claimDate: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Claim Description *</label>
              <textarea value={claimForm.claimDescription} onChange={(e) => setClaimForm({ ...claimForm, claimDescription: e.target.value })} required rows={3} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical" }} placeholder="Describe your claim..." />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleClaim} style={{ flex: 1, padding: "10px", background: "#1f2937", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>Submit Claim</button>
              <button onClick={() => setShowClaim(false)} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#1f2937", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItem && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", borderRadius: "8px", padding: "24px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600" }}>Edit Item</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Title *</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Location *</label>
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Date</label>
                <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px", resize: "vertical" }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Type *</label>
                <select value={editForm.decisionType} onChange={(e) => setEditForm({ ...editForm, decisionType: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: "500" }}>Campus *</label>
                <select value={editForm.campusID} onChange={(e) => setEditForm({ ...editForm, campusID: e.target.value })} required style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "14px" }}>
                  <option value="">Select Campus</option>
                  {campuses.map(c => <option key={c.campusid} value={c.campusid}>{c.dropoff}</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: "#b45309", color: "white", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>Save Changes</button>
                <button type="button" onClick={() => setShowEditItem(false)} style={{ flex: 1, padding: "10px", background: "#e5e7eb", color: "#1f2937", border: "none", borderRadius: "4px", fontSize: "14px", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Profile: React.FC<{ user: User; setUser: (u: User | null) => void }> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const updateClaimStatus = async (claimId: number, status: string) => {
    try {
      await API.patch(`/claim/${claimId}/status`, { status });
      const updated = (await API.get<Claim[]>("/claim")).data.filter(c => c.userid === user.userid);
      setClaims(updated);
    } catch (err) {
      console.error("Error updating claim:", err);
    }
  };
  
  const deleteClaim = async (claimId: number) => {
    try {
      await API.delete(`/claim/${claimId}`);
      setClaims(prev => prev.filter(c => c.claimid !== claimId));
    } catch (err) {
      console.error("Error deleting claim:", err);
    }
  };
  

  useEffect(() => {
    API.get<Claim[]>("/claim").then(res => {
      const userClaims = res.data.filter(c => c.userid === user.userid);
      setClaims(userClaims);
    }).catch(() => setClaims([]));
    API.get<Item[]>("/item").then(res => setItems(res.data)).catch(() => setItems([]));
  }, [user.userid]);

  const getItemTitle = (itemId: number) => {
    const item = items.find(i => i.itemid === itemId);
    return item ? item.title : `Item #${itemId}`;
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px", background: "#f8f9fa" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "28px", fontWeight: "600" }}>Profile</h2>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Name</p>
            <p style={{ fontSize: "18px", fontWeight: "500" }}>{user.firstname} {user.lastname}</p>
          </div>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>Email</p>
            <p style={{ fontSize: "18px", fontWeight: "500" }}>{user.email}</p>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
            <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", background: "#1f2937", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>Back to Dashboard</button>
            <button onClick={() => { setUser(null); navigate("/"); }} style={{ padding: "10px 20px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontWeight: "500" }}>Logout</button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "8px", padding: "32px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "600" }}>My Claims</h2>
          {claims.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No claims yet</p>
              <p style={{ fontSize: "14px" }}>Make a claim from the dashboard to see it here.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {claims.map(claim => (
                <div key={claim.claimid} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", background: "#f9fafb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px", color: "#1f2937" }}>{getItemTitle(claim.itemid)}</h3>
                      {claim.claimdate && <p style={{ fontSize: "14px", color: "#666" }}>Claim Date: {new Date(claim.claimdate).toLocaleDateString()}</p>}
                    </div>
                    <span style={{ display: "inline-block", padding: "4px 12px", fontSize: "12px", borderRadius: "12px", background: claim.status === "found" ? "#dbeafe" : claim.status === "resolved" ? "#d1fae5" : "#fee2e2", color: claim.status === "found" ? "#1e40af" : claim.status === "resolved" ? "#065f46" : "#991b1b", fontWeight: "500" }}>
                      {claim.status || "pending"}
                    </span>
                  </div>

                  <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>{claim.claimdescription}</p>

                  <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => updateClaimStatus(claim.claimid, "resolved")}
                      style={{ padding: "8px 12px", background: "#059669", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Mark Resolved
                    </button>

                    <button
                      onClick={() => updateClaimStatus(claim.claimid, "found")}
                      style={{ padding: "8px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Mark Found
                    </button>

                    <button
                      onClick={() => updateClaimStatus(claim.claimid, "lost")}
                      style={{ padding: "8px 12px", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Mark Lost
                    </button>

                    <button
                      onClick={() => deleteClaim(claim.claimid)}
                      style={{ padding: "8px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
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
