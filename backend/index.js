import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     allowMethods: ["GET", "POST"],
//     allowHeaders: ["Content-Type", "Accept", "Authorization"],
//     credentials: true,
//   })
// );

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

const JWT_SECRET = "1234567890";

// 登录接口
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("login--->", username, password);

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
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // 4. 设置安全Cookie
  // res.cookie("auth_token", token, {
  //   httpOnly: true,
  //   secure: false, // https
  //   sameSite: "none",
  //   domain: "localhost",
  //   path: "/",
  //   maxAge: 3600000, // 1小时
  // });

  // 5. 返回成功响应（不含敏感信息）
  res.json({
    code: 200,
    msg: "登陆成功",
    data: { id: user.id, username: user.username, token: token },
  });
});

// 受保护的路由示例
app.get("/api/profile", (req, res) => {
  // 从Cookie获取token
  const token = req.cookies.auth_token;

  console.log("token", token);

  if (!token) {
    return res.json({
      code: 401,
      msg: "未授权访问",
    });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded?.userId;
    const user = users.find((u) => u.id === userId);
    if (user) {
      res.json({
        code: 200,
        msg: "success",
        data: {
          username: user?.username,
        },
      });
    } else {
      return res.json({
        code: 500,
        msg: "no data",
      });
    }
  } catch (err) {
    console.log("token无效", err);
  }
});

// 登出接口
// app.post("/api/logout", (req, res) => {
//   res.json({
//     code: 200,
//     msg: "登出成功",
//     success: true,
//   });
// });

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  console.log("product-id", id);
  if (id === "1") {
    res.json({
      code: 200,
      msg: "success",
      data: {
        available: true,
        category: "电子产品",
      },
    });
  } else {
    res.json({
      code: 500,
      msg: "no data",
    });
  }
});

// 验证token接口
app.get("/api/authcheck", (req, res) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.json({
      code: 401,
      msg: "未授权访问",
      authenticated: false,
    });
  }

  try {
    // 验证token
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      code: 200,
      msg: "success",
      authenticated: true,
    });
  } catch (err) {
    res.json({
      code: 401,
      msg: "token无效",
      authenticated: false,
    });
  }
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`服务运行在 http://localhost:${PORT}`);
});
