const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");

const cors = require("cors");

const testDB = admin.initializeApp(
  {
    credential: admin.credential.cert({
      type: "service_account",
      project_id: "howincloud-test",
      private_key_id: "5cf5b03c92628748bd427b66d79e5e399c77652e",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3/IfCeCxyD2sN\nZtWWlPFcTkGWt1MjmDE8S7U1HsFg/fAL8RWKE+N6kBHbC6GZURKhoINbB1REhxbh\nUJoYvyMde9LPG9SkAQA4InsFyoWl7Zwp0XCeTc7XcCIdIEIFwRLi2xEGuGvqp3eC\nxfFOR/S02oPpY0fOqKj2axEg7uF22mYpzzSDrWGKJPo19EuTf7aolWptUZtAZviH\nX6nPBjwizYPydI4ysWS6PpOopO1QT3SNSSz9rLCBiVcIX3GVrGGc1f02+Xl+RWtk\n+Gdou5HbMvRyMyeMjDo64EJP1XUNflz3/RfQ3hkN9ek7AuzIB1W3ctpMBovssUiE\n0CZgwTs9AgMBAAECggEAFhDfZ19qVTOsLytKKokqeVuZWi4adoZmQUkDLp/FqZBL\nHeOIJctE2Qo2WgMHGpAyn9fUaTJz1NQu1k8IbDdgSsTy/4vi8Nh94j2ga41igggB\nVrKbwyCp0gTM0plv0ajaTwLfA+NSbg4vsytySWUv4BDlCTSzBAIOYZ9tqnl76PkM\nfKuIGvJ+gqfQNRDHtfUAVoUsuxIliewUo8GjEcsY+v8kPdbCD7aZ0/OYB6XlVjSH\nryy5jgom+vFChrrokQCviFCiN1+Ta792sP9Tz2HzY2bVkalDtKMNkkM2Td8v/KCE\nE7HQ0sc3m/7VZb4t0RNNFZIlMsgE1cohqZrr7b0IAQKBgQDej9KbT80Ot998tn5Q\nvXZbAnyGxGzgRkM0t6tjxjRbQZxazYOoSCRrAPwYqT0zCIuJgQiaBgwfhLF6wcWq\nV/Fq+e5NItllu22O7oSBlikSg1HGC54FKdW5FGpkRAiCI5ZfERhLlGZV0KOrH1Tg\nqXItqX+gS9cllSUuUEXmZyW7vQKBgQDToQVuppF06tGUAfgaql6d2LoR5q7GTyjk\nhFQI86TXbmlWDxYpUhoEtt5LuxNnjJ9g1JwBvtWv9WjQa68JbRyGkCOqFeQOs8Re\nukNG7E9xfVPtHUXhLwg/k5wFWvZRPgz35vZeZBJTvt7E7dXMC8kytYPgmTlxng/2\npbv3hJW1gQKBgQDRWD1FA+ohFwmr2Ei2j5AdiRgy995lkxGyK7WWEyC6WdvFeZyG\nlN1UnUeDtuUu9LGz9GBv6JJMr1b13gCc+z3FXzQs8EPHMmaaVHblIaaemFE51UGd\nH7296pssluXd67WM1JqitQMRY0AgPUdsT1Zr5wx6bfwAiOrBRpaJY6qVjQKBgAzW\n0AWOhXSaamyYUf0MKQFajK9ZV3EgjFKQ1KhWX8HSKQHXmHiZSorOrV3a06qMlX7C\nZ1STx1MNiHZckhn4TKq9Q+ylt1hM/7TfiAVdgNRZziWsiPjIaa+xvN12T0tOgGrp\n0DiZyaLbCZjY9QeUD3jMGlwd76Y8+Kr2ExlJKewBAoGBAMidxF3uA3rtZWaf9MwR\nLLiGcQlM55XFGVxv52fv64dQzJbCWFTokkTbtMfxCkCzPEtHgYW6L5vl4Q6I5xJS\nWOW8oftzMODi8fmHaRour7PrRFJGTvwdIpjMXE8No86zJfjqxcZrbe70uXGMVSEQ\nrgpkcjIfHTOWc1CNYlf48okP\n-----END PRIVATE KEY-----\n",
      client_email:
        "firebase-adminsdk-fbsvc@howincloud-test.iam.gserviceaccount.com",
      client_id: "108238981552193521824",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40howincloud-test.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    }),
    databaseURL: "https://kidgate-6f55c-default-rtdb.firebaseio.com/",
  },
  "testDB"
);

const db = testDB.firestore();
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests (e.g., Postman)
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Parse JSON request bodies
app.use(express.json());

// =====-=-=-=-==--=-=-=-=

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];
  console.log("token", token);
  console.log("key", process.env.JWT_SECRET);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Secret", process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.use((req, res, next) => {
  if (req.path === "/login") return next();
  authMiddleware(req, res, next);
});
app.post("/login", async (req, res) => {
  console.log("gettt");
  try {
    const { number, password } = req.body;
    console.log(req.body);
    if (!number || !password) {
      return res
        .status(400)
        .json({ message: "Number and password are required" });
    }

    // Query Firestore USER collection for exact match
    const snapshot = await db
      .collection("USER")
      .where("NUMBER", "==", number)
      .where("PASSWORD", "==", password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("nottt");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userDoc = snapshot.docs[0].data();

    // Generate JWT
    const token = jwt.sign(
      { id: userDoc.ID, name: userDoc.NAME, number: userDoc.NUMBER },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token,
        expiresIn: "1 hour",
      // expiresIn: "1 minute",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/add-task", authMiddleware, async (req, res) => {
  console.log("gettask");
  try {
    const { task ,amount} = req.body;
    console.log(req.body);
    const docId = Date.now().toString();

    await db.collection("TASK").doc(docId).set({
      TASK: task,
      AMOUNT:amount,
    });

    res.status(201).json({
      message: "Task added successfully",
      taskId: docId,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error adding task",
    });
  }
});

app.put("/update-task", authMiddleware, async (req, res) => {
  try {
    const { task, taskId ,amount} = req.body; // get updated task text

    // Reference to the document
    const taskRef = db.collection("TASK").doc(taskId);

    // Check if the document exists
    const docSnapshot = await taskRef.get();
    if (!docSnapshot.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task
    await taskRef.update({
      TASK: task,
      AMOUNT:amount
    });

    res.status(200).json({
      message: "Task updated successfully",
      taskId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating task",
    });
  }
});

app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const snapshot = await db.collection("TASK").get(); // get all docs
    const tasks = [];

    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() }); // include doc ID
    });

    res.status(200).json({ tasks }); // send as JSON
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.delete("/delete-tasks", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.body;
    console.log("req", req.body);
    const taskRef = db.collection("TASK").doc(taskId);
    const docSnap = await taskRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    await taskRef.delete();

    res.status(200).json({ message: "Task deleted successfully", taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
