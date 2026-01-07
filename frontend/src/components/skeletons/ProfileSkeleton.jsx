import Skeleton from "./Skeleton";

export default function ProfileSkeleton() {
    return (
        <div className="pt-28 px-6 min-h-screen text-white space-y-10">
            {/* Profile Header */}
            <div className="bg-white/5 p-6 rounded-xl flex items-center gap-6">
                <Skeleton width="96px" height="96px" radius="50%" />

                <div className="flex-1 space-y-2">
                    <Skeleton width="40%" height="22px" />
                    <Skeleton width="50%" height="14px" />
                </div>

                <div className="flex gap-3">
                    <Skeleton width="80px" height="36px" />
                    <Skeleton width="36px" height="36px" radius="50%" />
                </div>
            </div>

            {/* Library */}
            <div className="bg-white/5 p-6 rounded-xl">
                <Skeleton width="30%" height="20px" className="mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex gap-4 bg-white/10 p-4 rounded-lg"
                        >
                            <Skeleton width="70px" height="100px" radius="6px" />

                            <div className="flex flex-col justify-center space-y-2">
                                <Skeleton width="120px" height="16px" />
                                <Skeleton width="80px" height="14px" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
