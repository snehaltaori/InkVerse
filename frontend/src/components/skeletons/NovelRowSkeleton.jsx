import Skeleton from "./Skeleton";

export default function NovelRowSkeleton() {
    return (
        <div className="flex gap-4 bg-white/5 p-4 rounded-lg">
            {/* Book cover */}
            <Skeleton width="110px" height="160px" radius="8px" />

            {/* Text */}
            <div className="flex-1 space-y-2">
                <Skeleton width="70%" height="18px" />
                <Skeleton width="40%" height="14px" />
                <Skeleton width="100%" height="12px" />
                <Skeleton width="90%" height="12px" />
                <Skeleton width="30%" height="12px" />
            </div>
        </div>
    );
}
