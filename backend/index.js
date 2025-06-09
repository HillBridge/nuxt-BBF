import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cookieParser());

// const saltRounds = 2;
// const hashedPassword = await bcrypt.hash("123456", saltRounds);
// console.log("hashedPassword", hashedPassword);

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: "admin",
    // 密码是 "123456" 的bcrypt哈希
    password: "$2b$04$MkYCZFewKYYVxWp7Ivi0FOVRY76N67mRlj8zAUZEpoW87/CWD1.hu",
  },
];

// 登录接口
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // 1. 查找用户
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.json({
      code: 500,
      msg: "用户名不存在",
    });
  }

  // 2. 验证密码
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({
      code: 500,
      msg: "密码错误",
    });
  }

  // 3. 生成JWT
  const token = jwt.sign({ userId: user.id }, "1234567890", {
    expiresIn: "1h",
  });

  console.log("生成的token", token);

  // 4. 设置安全Cookie
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: true, // https
    sameSite: "strict",
    //domain: "localhost",
    path: "/",
    maxAge: 3600000, // 1小时
  });

  // 5. 返回成功响应（不含敏感信息）
  res.json({
    code: 200,
    msg: "登陆成功",
    data: { id: user.id, username: user.username },
  });
});

// 受保护的路由示例
app.get("/api/profile", (req, res) => {
  // 从Cookie获取token
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: "未授权访问" });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      user: { id: decoded.userId },
      message: "这是受保护的数据",
    });
  } catch (err) {
    res.status(401).json({ error: "无效的token" });
  }
});

// 登出接口
app.post("/api/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ success: true });
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`服务运行在 http://localhost:${PORT}`);
});
