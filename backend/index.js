// file: mock-backend.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors()); // 允许跨域

const users = {
  user1: {
    id: "user1",
    email: "test@example.com",
    name: "Alice",
    password: "password123",
  },
};

// 登录接口
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(users).find((u) => u.email === email);

  if (user && user.password === password) {
    console.log("[Mock Backend] Login successful for:", email);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    console.log("[Mock Backend] Login failed for:", email);
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// 获取用户信息接口 (需要认证)
app.get("/api/me", (req, res) => {
  // 真实后端会验证 JWT 或其他 token，这里我们简化，用一个 header 来模拟
  const userId = req.headers["x-user-id"];
  if (userId && users[userId]) {
    console.log("[Mock Backend] Get user info for:", userId);
    res.json({
      id: users[userId].id,
      name: users[userId].name,
      email: users[userId].email,
    });
  } else {
    console.log("[Mock Backend] Get user info failed, unauthorized.");
    res.status(401).json({ message: "Unauthorized--服务端" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`[Mock Backend] Running on http://localhost:${PORT}`);
});
