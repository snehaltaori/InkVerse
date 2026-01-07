export default function BookCover({
    title,
    coverTitle,
    coverImage,
    size = "md", 
}) {
    const text =
        coverTitle?.trim()
            ? coverTitle
            : title.length > 20
                ? title.slice(0, 20) + "…"
                : title;

    const sizes = {
        sm: "w-[70px] h-[105px] text-[10px]",
        md: "w-[120px] h-[180px] text-sm",
        lg: "w-[160px] h-[240px] text-base",
    };

    if (coverImage) {
        return (
            <img
                src={coverImage}
                alt={title}
                loading="lazy"
                className="opacity-0 transition-opacity duration-300"
                onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
            />

        );
    }

    return (
        <div
            className={`
                ${sizes[size]}
                relative rounded-md shadow
                bg-[#1b1b16]
                border border-[#3a3a32]
                flex items-center justify-center
                text-center px-3
                font-serif
                text-[#d6d0bc]
                tracking-wide
            `}
        >
            {/* vignette */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/50 rounded-md" />

            {/* ornament */}
            <div className="absolute top-2 text-xs opacity-40">✦</div>

            {/* title */}
            <span className="relative z-10 leading-snug">
                {text}
            </span>
        </div>
    );
}
