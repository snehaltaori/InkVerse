import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useUser } from "../context/UserContext";

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser, token } = useUser();

  const [profile, setProfile] = useState(null);
  const [showList, setShowList] = useState(null); // 'followers' or 'following'
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProfile(data);
      setLoading(false);
    } catch {
      alert("Failed to fetch profile.");
    }
  };

  const handleFollowToggle = async () => {
    const route = profile.isFollowing
      ? `/api/users/unfollow/${username}`
      : `/api/users/follow/${username}`;
    try {
      await fetch(route, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProfile(); // refresh state
    } catch {
      alert("Follow/unfollow failed");
    }
  };

  const handleEmail = () => {
    window.location.href = `/emails?to=${profile.username}`;
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading || !profile) {
    return <div className="text-center pt-24 text-white">Loading...</div>;
  }

  const isMe = currentUser.username === profile.username;

  return (
    <div className="pt-28 px-6 min-h-screen text-white relative">
      {/* Profile Header */}
      <div className="bg-white/5 p-6 rounded-xl shadow-md flex items-center gap-6 mb-8">
        <img
          src={profile.profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover shadow"
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
                className="bg-mutedGreen px-4 py-1 rounded hover:bg-green-700"
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

      {/* User Library */}
      <div className="bg-white/5 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">📚 {isMe ? "My" : "Their"} Library</h3>
        {profile.library.length === 0 ? (
          <p className="text-sm text-mutedGreen">No books added yet.</p>
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
                  className="w-20 h-auto object-cover"
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
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-full max-w-md relative text-white">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {showList}
            </h3>
            <button
              className="absolute top-2 right-4 text-sm text-red-400 hover:text-red-300"
              onClick={() => setShowList(null)}
            >
              ✖ Close
            </button>
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
                      (window.location.href = `/emails?to=${person.username}`)
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
