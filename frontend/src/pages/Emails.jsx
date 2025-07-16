import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";

const Emails = () => {
  const [searchParams] = useSearchParams();
  const [showCompose, setShowCompose] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);

  useEffect(() => {
    const fetchEmails = async () => {
  try {
    const [inboxRes, sentRes] = await Promise.all([
      fetch("/api/emails/inbox", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch("/api/emails/sent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      const inboxData = await inboxRes.json();
      const sentData = await sentRes.json();

      console.log("Inbox response:", inboxData);
      console.log("Sent response:", sentData);

      // If either is not an array (error), fallback to []
      setInbox(Array.isArray(inboxData) ? inboxData : []);
      setSent(Array.isArray(sentData) ? sentData : []);
      } catch (err) {
         console.error("Email fetch error:", err);
      }
    };

    fetchEmails();
  }, []);

  useEffect(() => {
    const to = searchParams.get("to");
    if (to) {
        setRecipient(to);
        setShowCompose(true);
      }
    }, [searchParams]);

    const handleSend = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch("/api/emails/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ toUsername: recipient, subject, message }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Failed to send");
          return;
        }

        alert("Email sent!");
        setShowCompose(false);
        setSubject("");
        setMessage("");
        setRecipient("");

        // Refresh sent box
        const sentRes = await fetch("/api/emails/sent", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSent(await sentRes.json());
      } catch (err) {
        console.error("Send error:", err);
        alert("Failed to send email");
    }
  };

  const handleView = async (email) => {
    try {
      const res = await fetch(`/api/emails/${email._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setSelectedEmail(data);
    } catch {
      alert("Failed to load email");
    }
  };

  const closeModal = () => setSelectedEmail(null);

  return (
    <div className="pt-28 px-6 min-h-screen text-white relative">
      <h2 className="text-2xl font-bold mb-6">📨 My Emails</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["inbox", "sent"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-mutedGreen text-white"
                : "bg-white/10 text-mutedGreen"
            }`}
          >
            {tab === "inbox" ? "📥 Received" : "📤 Sent"}
          </button>
        ))}
      </div>

      {/* Email List */}
      <div className="space-y-4 mb-24">
        {Array.isArray(activeTab === "inbox" ? inbox : sent) &&
          (activeTab === "inbox" ? inbox : sent).map((mail) => (
          <div
            key={mail._id}
            onClick={() => handleView(mail)}
            className="bg-white/5 p-4 rounded-lg shadow hover:bg-white/10 transition cursor-pointer"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{mail.subject}</h3>
              <span className="text-sm text-mutedGreen">
                {new Date(mail.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-blue-300">
              {activeTab === "inbox" ? `From: ${mail.from}` : `To: ${mail.to}`}
            </p>
            <p className="text-sm line-clamp-2">{mail.message}</p>
          </div>
        ))}
      </div>

      {/* 📩 Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white hover:text-red-400"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-2">
              {selectedEmail.subject}
            </h3>
            <p className="text-sm text-mutedGreen mb-2">
              From: {selectedEmail.from}
              <br />
              To: {selectedEmail.to}
            </p>
            <p className="text-sm">{selectedEmail.message}</p>
            <p className="text-right mt-4 text-xs text-mutedGreen">
              {new Date(selectedEmail.date).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Compose Button */}
      <button
        onClick={() => {
          setRecipient("");
          setShowCompose(true);
        }}
        className="fixed bottom-8 right-8 bg-mutedGreen text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition z-50"
      >
        <FaPlus />
      </button>

      {/* ✍️ Compose Drawer */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white/10 p-6 rounded-lg w-full max-w-lg relative backdrop-blur-md">
            <button
              onClick={() => setShowCompose(false)}
              className="absolute top-2 right-2 text-white hover:text-red-400"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4">✉️ Compose Email</h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">To (username)</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient username"
                  className="w-full px-4 py-2 bg-white/20 text-white rounded outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 text-white rounded outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-white/20 text-white rounded outline-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-mutedGreen rounded hover:bg-green-700 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emails;

