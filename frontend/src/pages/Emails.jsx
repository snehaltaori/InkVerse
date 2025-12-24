import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";

const Emails = () => {
    const [searchParams] = useSearchParams();
    const token = localStorage.getItem("token");

    const [showCompose, setShowCompose] = useState(false);
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("inbox");
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [inbox, setInbox] = useState([]);
    const [sent, setSent] = useState([]);

    // 🔹 Fetch inbox + sent
    useEffect(() => {
        if (!token) return;

        const fetchEmails = async () => {
            try {
                const [inboxRes, sentRes] = await Promise.all([
                    fetch("/api/emails/inbox", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("/api/emails/sent", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const inboxData = await inboxRes.json();
                const sentData = await sentRes.json();

                setInbox(Array.isArray(inboxData) ? inboxData : []);
                setSent(Array.isArray(sentData) ? sentData : []);
            } catch (err) {
                console.error("Email fetch error:", err);
            }
        };

        fetchEmails();
    }, [token]);

    // 🔹 Open compose from ?to=username
    useEffect(() => {
        const to = searchParams.get("to");
        if (to) {
            setRecipient(to);
            setShowCompose(true);
        }
    }, [searchParams]);

    // 🔹 Send email
    const handleSend = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/emails/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    toUsername: recipient,
                    subject,
                    message,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to send email");
                return;
            }

            setShowCompose(false);
            setRecipient("");
            setSubject("");
            setMessage("");

            // refresh sent
            const sentRes = await fetch("/api/emails/sent", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSent(await sentRes.json());
        } catch (err) {
            console.error("Send error:", err);
        }
    };

    // 🔹 View email
    const handleView = async (mail) => {
        try {
            const res = await fetch(`/api/emails/${mail._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setSelectedEmail(data);
        } catch {
            alert("Failed to load email");
        }
    };

    const emailsToShow = activeTab === "inbox" ? inbox : sent;

    return (
        <div className="pt-28 px-6 min-h-screen text-white relative">
            <h2 className="text-2xl font-bold mb-6">📨 My Emails</h2>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                {["inbox", "sent"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded ${activeTab === tab
                            ? "bg-mutedGreen text-white"
                            : "bg-white/10 text-mutedGreen"
                            }`}
                    >
                        {tab === "inbox" ? "📥 Received" : "📤 Sent"}
                    </button>
                ))}
            </div>

            {/* Email list */}
            <div className="space-y-4 mb-24">
                {emailsToShow.length === 0 && (
                    <p className="text-center text-mutedGreen">
                        No emails here yet 📭
                    </p>
                )}

                {emailsToShow.map((mail) => (
                    <div
                        key={mail._id}
                        onClick={() => handleView(mail)}
                        className="bg-white/5 p-4 rounded-lg hover:bg-white/10 cursor-pointer"
                    >
                        <div className="flex justify-between">
                            <h3 className="font-semibold">{mail.subject}</h3>
                            <span className="text-xs text-mutedGreen">
                                {new Date(mail.date).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="text-sm text-blue-300">
                            {activeTab === "inbox"
                                ? `From: ${mail.from}`
                                : `To: ${mail.to}`}
                        </p>

                        <p className="text-sm line-clamp-2">{mail.message}</p>
                    </div>
                ))}
            </div>

            {/* Email modal */}
            {selectedEmail && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white/10 p-6 rounded-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setSelectedEmail(null)}
                            className="absolute top-2 right-2 text-white"
                        >
                            <FaTimes />
                        </button>

                        <h3 className="text-xl font-semibold mb-2">
                            {selectedEmail.subject}
                        </h3>

                        <p className="text-sm text-mutedGreen mb-3">
                            From: {selectedEmail.from}
                            <br />
                            To: {selectedEmail.to}
                        </p>

                        <p className="text-sm">{selectedEmail.message}</p>

                        <p className="text-right text-xs text-mutedGreen mt-4">
                            {new Date(selectedEmail.date).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            {/* Compose button */}
            <button
                onClick={() => setShowCompose(true)}
                className="fixed bottom-8 right-8 bg-mutedGreen p-4 rounded-full shadow-lg"
            >
                <FaPlus />
            </button>

            {/* Compose modal */}
            {showCompose && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white/10 p-6 rounded-lg w-full max-w-lg relative">
                        <button
                            onClick={() => setShowCompose(false)}
                            className="absolute top-2 right-2"
                        >
                            <FaTimes />
                        </button>

                        <h3 className="text-xl font-semibold mb-4">✉️ Compose Email</h3>

                        <form onSubmit={handleSend} className="space-y-4">
                            <input
                                placeholder="Recipient username"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 rounded"
                                required
                            />

                            <input
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 rounded"
                                required
                            />

                            <textarea
                                rows="4"
                                placeholder="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 bg-white/20 rounded"
                                required
                            />

                            <button className="w-full py-2 bg-mutedGreen rounded">
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

