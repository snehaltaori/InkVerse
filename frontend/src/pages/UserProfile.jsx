import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const { user: currentUser } = useUser();
    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState(null);
    const [showList, setShowList] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${username}`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            const data = await res.json();
            setProfile(data);
        } catch {
            alert("Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [username]);

    const handleFollowToggle = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        setFollowLoading(true);

        try {
            const route = profile.isFollowing
                ? `/api/users/unfollow/${username}`
                : `/api/users/follow/${username}`;

            await fetch(route, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            fetchProfile();
        } catch {
            alert("Follow/unfollow failed");
        } finally {
            setFollowLoading(false);
        }
    };

    const handleEmail = () => {
        navigate(`/emails?to=${profile.username}`);
    };

    if (loading || !profile) {
        return (
            <div className="text-center pt-24 text-mutedGreen">
                Loading profile...
            </div>
        );
    }

    const isMe =
        currentUser && currentUser.username === profile.username;

    return (
        <div className="pt-28 px-6 min-h-screen text-white">
            {/* Profile Header */}
            <div className="bg-white/5 p-6 rounded-xl flex items-center gap-6 mb-8">
                <img
                    src={profile.profilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                />

                <div>
                    <h2 className="text-2xl font-bold">{profile.username}</h2>

                    <p className="text-sm text-mutedGreen mt-1">
                        <span
                            onClick={() => setShowList("followers")}
                            className="cursor-pointer hover:underline"
                        >
                            {profile.followers.length} Followers
                        </span>{" "}
                        ·{" "}
                        <span
                            onClick={() => setShowList("following")}
                            className="cursor-pointer hover:underline"
                        >
                            {profile.following.length} Following
                        </span>
                    </p>

                    {!isMe && (
                        <div className="flex gap-4 mt-3">
                            <button
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                                className="bg-mutedGreen px-4 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                                {profile.isFollowing ? "Unfollow" : "Follow"}
                            </button>

                            <button
                                onClick={handleEmail}
                                className="text-blue-300 hover:text-blue-400"
                                title="Send Email"
                            >
                                <FaEnvelope size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Library */}
            <div className="bg-white/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">
                    📚 {isMe ? "My" : "Their"} Library
                </h3>

                {profile.library.length === 0 ? (
                    <p className="text-sm text-mutedGreen">
                        No books added yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.library.map((book) => (
                            <div
                                key={book._id}
                                className="flex bg-white/10 rounded-lg overflow-hidden"
                            >
                                <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-20 object-cover"
                                />
                                <div className="p-3">
                                    <h4 className="font-semibold">{book.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Followers / Following Modal */}
            {showList && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white/10 p-6 rounded-xl max-w-md w-full relative">
                        <button
                            onClick={() => setShowList(null)}
                            className="absolute top-2 right-4 text-red-400"
                        >
                            ✖
                        </button>

                        <h3 className="text-xl font-semibold mb-4 capitalize">
                            {showList}
                        </h3>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                            {(showList === "followers"
                                ? profile.followers
                                : profile.following
                            ).map((person) => (
                                <div
                                    key={person._id}
                                    className="flex items-center justify-between bg-white/10 p-3 rounded"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={person.profilePic}
                                            alt={person.username}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <p>{person.username}</p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            navigate(`/emails?to=${person.username}`)
                                        }
                                        className="text-blue-300 hover:text-blue-400"
                                    >
                                        <FaEnvelope />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
