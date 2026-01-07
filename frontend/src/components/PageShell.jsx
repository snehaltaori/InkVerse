export default function PageShell({ loading, skeleton, children }) {
    return (
        <div className="min-h-[60vh]">
            {loading ? skeleton : children}
        </div>
    );
}
