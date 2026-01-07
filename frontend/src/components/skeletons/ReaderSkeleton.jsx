import Skeleton from "./Skeleton";

export default function ReaderSkeleton() {
    return (
        <div className="pt-24 px-6 pb-16 max-w-3xl mx-auto space-y-6">
            {/* Back link */}
            <Skeleton width="30%" height="16px" />

            {/* Chapter title */}
            <Skeleton width="60%" height="28px" />

            {/* Content block */}
            <div className="bg-white/5 p-6 rounded-lg space-y-3">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} width="100%" height="14px" />
                ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-10">
                <Skeleton width="120px" height="40px" />
                <Skeleton width="120px" height="40px" />
            </div>
        </div>
    );
}
