import Skeleton from "./Skeleton";

export default function NovelCardSkeleton() {
    return (
        <div className="novel-card">
            <Skeleton width="100%" height="220px" radius="10px" />
            <div style={{ marginTop: "12px" }}>
                <Skeleton width="70%" height="18px" />
                <Skeleton width="50%" height="14px" style={{ marginTop: "8px" }} />
            </div>
        </div>
    );
}
