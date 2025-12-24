import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { FaEnvelope } from "react-icons/fa";
import API from "../utils/api";

const Profile = () => {
    const { user: authUser } = useUser();

    const [profile, setProfile] = useState(null);
    const [showList, setShowList] = useState(null); // followers | following
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/users/me");
            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFollowToggle = async (username, isFollowing) => {
        try {
            const endpoint = isFollowing
                ? `/users/unfollow/${username}`
                : `/users/follow/${username}`;

            await API.post(endpoint);
            fetchProfile();
        } catch (err) {
            console.error("Follow toggle failed", err);
        }
    };

    const handleEmail = (username) => {
        window.location.href = `/emails?to=${username}`;
    };

    if (loading) {
        return <div className="pt-28 px-6 text-white">Loading profile…</div>;
    }

    if (!profile) {
        return <div className="pt-28 px-6 text-white">Profile not found.</div>;
    }

    return (
        <div className="pt-28 px-6 min-h-screen text-white">
            {/* Profile Header */}
            <div className="bg-white/5 p-6 rounded-xl flex items-center gap-6 mb-8">
                <img
                    src={
                        profile.profilePic ||
                        "/assets/Default_profilepic.jpg"
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                />

                <div>
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <p className="text-sm text-mutedGreen mt-1">
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => setShowList("followers")}
                        >
                            {profile.followers?.length || 0} Followers
                        </span>
                        {" · "}
                        <span
                            className="cursor-pointer hover:underline"
                            onClick={() => setShowList("following")}
                        >
                            {profile.following?.length || 0} Following
                        </span>
                    </p>
                </div>
            </div>

            {/* My Library */}
            <div className="bg-white/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">📚 My Library</h3>

                {profile.library?.length === 0 ? (
                    <p className="text-sm text-gray-400">No novels added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profile.library?.map((book) => (
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
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-md relative">
                        <h3 className="text-xl font-semibold mb-4 capitalize">
                            {showList}
                        </h3>

                        <button
                            className="absolute top-2 right-4 text-red-400"
                            onClick={() => setShowList(null)}
                        >
                            ✖
                        </button>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {(showList === "followers"
                                ? profile.followers
                                : profile.following
                            )?.map((person) => {
                                const isFollowing = profile.following.some(
                                    (f) => f._id.toString() === person._id.toString()
                                );


                                return (
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

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    handleFollowToggle(person.username, isFollowing)
                                                }
                                                className="px-3 py-1 text-sm bg-mutedGreen rounded"
                                            >
                                                {isFollowing ? "Unfollow" : "Follow"}
                                            </button>

                                            <button
                                                onClick={() => handleEmail(person.username)}
                                                className="text-blue-300"
                                            >
                                                <FaEnvelope />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;