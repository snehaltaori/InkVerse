import Skeleton from "./Skeleton";

export default function SidebarListSkeleton({ count = 6 }) {
    return (
        <ul className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i}>
                    <Skeleton width="80%" height="14px" />
                </li>
            ))}
        </ul>
    );
}
