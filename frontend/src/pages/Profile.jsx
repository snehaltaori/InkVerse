import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";


const Profile = () => {
  const { user: authUser } = useUser();
  const [profile, setProfile] = useState(null); // holds the full profile data
  const [showList, setShowList] = useState(null); // 'followers' or 'following' or null
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFollowToggle = async (username, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.post(`/api/users/${username}/unfollow`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post(`/api/users/${username}/follow`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      // Refetch updated profile after change
      fetchProfile();
    } catch (err) {
      console.error("Error toggling follow", err);
    }
  };

  const handleEmail = (username) => {
    window.location.href = `/emails?to=${username}`;
  };

  if (loading) {
    return <div className="pt-28 px-6 text-white">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="pt-28 px-6 text-white">Profile not found.</div>;
  }

  return (
    <div className="pt-28 px-6 min-h-screen text-white relative">
      {/* Profile Header */}
      <div className="bg-white/5 p-6 rounded-xl shadow-md flex items-center gap-6 mb-8">
        <img
          src={profile.profilePic || "/newpero/frontend/public/assets/Default_profilepic.jpg"}
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
        </div>
      </div>

      {/* My Library */}
      <div className="bg-white/5 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">📚 My Library</h3>
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
              {(showList === "followers" ? profile.followers : profile.following).map(
                (person) => (
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
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleFollowToggle(
                            person.username,
                            profile.following.some(
                              (f) => f._id === person._id
                            )
                          )
                        }
                        className="px-3 py-1 text-sm bg-mutedGreen rounded hover:bg-green-700"
                      >
                        {profile.following.some((f) => f._id === person._id)
                          ? "Unfollow"
                          : "Follow"}
                      </button>
                      <button
                        onClick={() => handleEmail(person.username)}
                        title="Send Email"
                        className="text-blue-300 hover:text-blue-400"
                      >
                        <FaEnvelope />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
