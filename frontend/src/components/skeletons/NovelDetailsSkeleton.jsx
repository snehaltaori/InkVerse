import Skeleton from "./Skeleton";

export default function NovelDetailsSkeleton() {
    return (
        <div className="pt-28 px-6 min-h-screen text-white">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 bg-white/5 p-6 rounded-xl mb-8">
                {/* Cover */}
                <Skeleton width="200px" height="300px" radius="10px" />

                {/* Info */}
                <div className="flex-1 space-y-3">
                    <Skeleton width="60%" height="28px" />
                    <Skeleton width="30%" height="14px" />
                    <Skeleton width="100%" height="14px" />
                    <Skeleton width="95%" height="14px" />
                    <Skeleton width="90%" height="14px" />

                    <div className="flex gap-2 mt-4">
                        <Skeleton width="70px" height="26px" radius="999px" />
                        <Skeleton width="70px" height="26px" radius="999px" />
                        <Skeleton width="70px" height="26px" radius="999px" />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Skeleton width="120px" height="40px" />
                        <Skeleton width="140px" height="40px" />
                    </div>
                </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-white/5 p-6 rounded-xl space-y-3">
                <Skeleton width="40%" height="20px" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} width="100%" height="14px" />
                ))}
            </div>
        </div>
    );
}
