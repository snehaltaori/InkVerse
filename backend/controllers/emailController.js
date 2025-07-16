const Email = require("../models/Email");
const User = require("../models/User");

// Send an email
exports.sendEmail = async (req, res) => {
  const { toUsername, subject, message } = req.body;
  const fromUser = await User.findById(req.user.id);
  const toUser = await User.findOne({ username: toUsername });

  if (!toUser) return res.status(404).json({ error: "Recipient not found" });

  const email = new Email({
    from: fromUser._id,
    to: toUser._id,
    subject,
    message
  });

  await email.save();
  res.status(201).json({ message: "Email sent" });
};

// Get received emails
exports.getReceivedEmails = async (req, res) => {
  try {
    const emails = await Email.find({ to: req.user.id })
      .populate("from", "username")
      .sort({ createdAt: -1 });

    res.json(emails.map(email => ({
      _id: email._id,
      subject: email.subject,
      message: email.message,
      from: `${email.from.username}@InkVerse.com`,
      date: email.createdAt
    })));
  } catch {
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
};

// Get sent emails
exports.getSentEmails = async (req, res) => {
  try {
    const emails = await Email.find({ from: req.user.id })
      .populate("to", "username")
      .sort({ createdAt: -1 });

    res.json(emails.map(email => ({
      _id: email._id,
      subject: email.subject,
      message: email.message,
      to: `${email.to.username}@InkVerse.com`,
      date: email.createdAt
    })));
  } catch {
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
};

// Get full email by ID
exports.getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id)
      .populate("from", "username")
      .populate("to", "username");

    if (
      email.to._id.toString() !== req.user.id &&
      email.from._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      subject: email.subject,
      message: email.message,
      from: `${email.from.username}@InkVerse.com`,
      to: `${email.to.username}@InkVerse.com`,
      date: email.createdAt
    });
  } catch {
    res.status(500).json({ error: "Email not found or error occurred" });
  }
};
