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

@app.patch("/item/<int:item_id>")
def update_item(item_id):
    data = request.json
    conn = get_connection()
    cur = conn.cursor()
    
    # check if item exists
    cur.execute("SELECT * FROM item WHERE itemid=%s", (item_id,))
    if not cur.fetchone():
        cur.close()
        conn.close()
        return jsonify({"error": "Item not found"}), 404
    # update item
    cur.execute("""
        UPDATE item
        SET title=%s, description=%s, location=%s, date=%s, decisiontype=%s, campusid=%s
        WHERE itemid=%s
        RETURNING *
    """, (
        data.get("title"), 
        data.get("description"), 
        data.get("location"), 
        data.get("date"),
        data.get("decisionType"),
        data.get("campusID"),
        item_id
    ))
    
    updated_item = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify(updated_item)

@app.delete("/item/<int:item_id>")
def delete_item(item_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM item WHERE itemid = %s RETURNING itemid", (item_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if not deleted:
        return jsonify({"error": "not found"}), 404
    return jsonify({"result": f"deleted item {deleted['itemid']}"})


@app.get("/item_image/<int:item_id>")
def get_item_image(item_id):
    conn = get_connection()
    cur = conn.cursor()
    
    cur.execute("SELECT * FROM item_image WHERE itemid=%s", (item_id,))
    image = cur.fetchone()
    cur.close()
    conn.close()
    
    if not image:
        return jsonify({"error": "No image"}), 404
    return jsonify(image)

@app.get("/claim")
def get_claims():
    conn = get_connection(); 
    cur = conn.cursor()
    cur.execute("SELECT * FROM claim ORDER BY claimid DESC"); 
    claims = cur.fetchall()
    cur.close(); 
    conn.close()
    return jsonify(claims)

@app.post("/claim")
def add_claim():
    d = request.json
    conn = get_connection(); cur = conn.cursor()
    cur.execute("""
        INSERT INTO claim(claimdate, status, claimdescription, itemid, userid)
        VALUES (%s,%s,%s,%s,%s) RETURNING *""",
        (d.get("claimDate"), d.get("status"), d.get("claimDescription"),
         d.get("itemID"), d.get("userID")))
    claim = cur.fetchone(); 
    conn.commit()
    cur.close(); 
    conn.close()
    return jsonify(claim)

@app.patch("/claim/<int:claim_id>/status")
def update_claim_status(claim_id):
    d = request.get_json()
    conn = get_connection(); 
    cur = conn.cursor()
    cur.execute("UPDATE claim SET status=%s WHERE claimid=%s RETURNING *",
                (d.get("status"), claim_id))
    row = cur.fetchone(); 
    conn.commit()
    cur.close(); 
    conn.close()
    return jsonify(row or {"error": "Claim not found"}), (200 if row else 404)

@app.delete("/claim/<int:claim_id>")
def delete_claim(claim_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM claim WHERE claimid = %s RETURNING claimid", (claim_id,))
    deleted = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    if not deleted:
        return jsonify({"error": "not found"}), 404
    return jsonify({"result": f"deleted claim {deleted['claimid']}"})

    
@app.get("/")
def home():
    return "hello"


if __name__ == "__main__":
    app.run(debug=True)
