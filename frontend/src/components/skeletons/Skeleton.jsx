export default function Skeleton({ width = "100%", height = "16px", radius = "6px" }) {
    return (
        <div
            className="skeleton"
            style={{
                width,
                height,
                borderRadius: radius,
            }}
        />
    );
}
