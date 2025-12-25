const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

/**
 * SIGNUP
 */
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful",
    });

  } catch (err) {
    console.error("Signup error:", err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
