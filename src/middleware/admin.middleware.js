const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Action réservée aux admins." });
  }
  next();
};

export default isAdmin;
