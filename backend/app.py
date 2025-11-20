from flask import Flask, request, jsonify
from db import get_connection

app = Flask(__name__)

@app.post("/register")
def register():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO users(firstname, lastname, email, password)
        VALUES (%s, %s, %s, %s)
        RETURNING userid, firstname, lastname, email
                """, (data["firstname"] or data.get("firstName"), data["lastname"], data["email"], data["password"]))
    
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify(user)


@app.post("/login")
def login():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT * FROM users WHERE email=%s AND password=%s", (data["email"], data["password"]))
    user = cur.fetchone()
    cur.close()
    conn.close()
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    return jsonify(user)

@app.get("/campus")
def get_campus():
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT * FROM campus")
    rows = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return jsonify(rows)


@app.post("/item")
def create_item():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO item(location, date, title, description, decisionType, campusID, userID)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING *
    """, (
        data["location"],
        data.get("date"),
        data["title"],
        data.get("description"),
        data["decisionType"],
        data["campusID"],
        data["userID"]
    ))
    
    item = cur.fetchone()
    conn.commit()
    
    cur.close()
    conn.close()
    return jsonify(item)


@app.get("/item")
def get_items():
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT * FROM item")
    items = cur.fetchall()
    
    cur.close()
    conn.close()
    
    return jsonify(items)

@app.get("/claim")
def get_claims():
    conn = get_conn(); cur = conn.cursor()
    cur.execute("SELECT * FROM claim ORDER BY claimid DESC"); claims = cur.fetchall()
    cur.close(); conn.close()
    return jsonify(claims)

@app.post("/claim")
def add_claim():
    d = request.json
    conn = get_conn(); cur = conn.cursor()
    cur.execute("""
        INSERT INTO claim(claimdate, status, claimdescription, itemid, userid)
        VALUES (%s,%s,%s,%s,%s) RETURNING *""",
        (d.get("claimDate"), d.get("status"), d.get("claimDescription"),
         d.get("itemID"), d.get("userID")))
    claim = cur.fetchone(); conn.commit()
    cur.close(); conn.close()
    return jsonify(claim)
    
@app.get("/")
def home():
    return "hello"


if __name__ == "__main__":
    app.run(debug=True)
