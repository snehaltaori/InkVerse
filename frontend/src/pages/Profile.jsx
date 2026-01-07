import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { FaEnvelope } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import API from "../utils/api";
import BookCover from "../components/BookCover";

import PageShell from "../components/PageShell";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

const Profile = () => {
    const { user: authUser } = useUser();
    const { userId } = useParams();

    const [profile, setProfile] = useState(null);
    const [showList, setShowList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(true);


    const isOwnProfile = !userId || userId === authUser?._id;

    const fetchProfile = async () => {
        setLoading(true);
        setShowSkeleton(true);

        const start = Date.now();

        try {
            const res = isOwnProfile
                ? await API.get("/users/me")
                : await API.get(`/users/${userId}`);

            setProfile(res.data);
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setProfile(null);
        } finally {
            const elapsed = Date.now() - start;
            const MIN_DURATION = 350; // ms

            const remaining = Math.max(0, MIN_DURATION - elapsed);

            setTimeout(() => {
                setLoading(false);
                setShowSkeleton(false);
            }, remaining);
        }
    };


    useEffect(() => {
        fetchProfile();
        setShowList(null);
    }, [userId]);

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

    const isFollowing = authUser?.following?.some(
        (u) => u === profile?._id || u?._id === profile?._id
    );

    return (
        <PageShell loading={showSkeleton} skeleton={<ProfileSkeleton />}>

            {!profile ? (
                <div className="pt-28 px-6 text-white">
                    Profile not found.
                </div>
            ) : (
                <div className="pt-28 px-6 min-h-screen text-white">
                    {/* Profile Header */}
                    <div className="bg-white/5 p-6 rounded-xl flex items-center gap-6 mb-10">
                        <img
                            src={profile.profilePic || "/assets/Default_profilepic.jpg"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">
                                {profile.username}
                            </h2>

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

                        {!isOwnProfile && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() =>
                                        handleFollowToggle(
                                            profile.username,
                                            isFollowing
                                        )
                                    }
                                    className="px-4 py-2 bg-mutedGreen rounded text-sm"
                                >
                                    {isFollowing ? "Unfollow" : "Follow"}
                                </button>

                                <button
                                    onClick={() => handleEmail(profile.username)}
                                    className="text-blue-300 text-xl"
                                >
                                    <FaEnvelope />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Library */}
                    <div className="bg-white/5 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold mb-6">
                            📚 {isOwnProfile ? "My Library" : "Library"}
                        </h3>

                        {profile.library?.length === 0 ? (
                            <p className="text-sm text-gray-400">
                                No novels added yet.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profile.library.map((book) => (
                                    <Link
                                        key={book._id}
                                        to={`/novel/${book._id}`}
                                        className="
                      flex gap-4 bg-white/10 p-4 rounded-lg
                      transition-all duration-200 ease-out
                      hover:bg-white/15
                      hover:-translate-y-[2px]
                      hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]
                    "
                                    >
                                        <BookCover
                                            title={book.title}
                                            coverTitle={book.coverTitle}
                                            coverImage={book.coverImage}
                                            size="sm"
                                        />

                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-serif font-semibold text-lg">
                                                {book.title}
                                            </h4>
                                        </div>
                                    </Link>
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
                                        const following = authUser?.following?.some(
                                            (f) =>
                                                f === person._id ||
                                                f?._id === person._id
                                        );

                                        return (
                                            <div
                                                key={person._id}
                                                className="flex items-center justify-between bg-white/10 p-3 rounded"
                                            >
                                                <Link
                                                    to={`/profile/${person._id}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <img
                                                        src={person.profilePic}
                                                        alt={person.username}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <p>{person.username}</p>
                                                </Link>

                                                {!isOwnProfile && (
                                                    <button
                                                        onClick={() =>
                                                            handleFollowToggle(
                                                                person.username,
                                                                following
                                                            )
                                                        }
                                                        className="px-3 py-1 text-sm bg-mutedGreen rounded"
                                                    >
                                                        {following ? "Unfollow" : "Follow"}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </PageShell>
    );
};

export default Profile;


