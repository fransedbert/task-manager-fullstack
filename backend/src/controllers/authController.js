const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

let users = []; // sementara (nanti diganti database)

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    res.json({
        message: "Register berhasil",
        user: {
            id: user.id,
            email: user.email,
        },
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return res.status(400).json({ message: "User tidak ditemukan" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ message: "Password salah" });
    }

    const token = jwt.sign({ id: user.id }, "secretkey", {
        expiresIn: "1d",
    });

    res.json({ token });
};