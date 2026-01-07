export default function ConfirmDialog({
    title = "Are you sure?",
    message,
    confirmText = "Delete",
    onConfirm,
    onCancel,
}) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] border border-red-500/40 rounded-lg p-6 w-[360px]">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-400 mb-4">{message}</p>

                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-3 py-1 border border-gray-500 rounded text-gray-300">
                        Cancel
                    </button>
                    <button onClick={onConfirm}  className="px-3 py-1 border border-red-500 text-red-500  rounded hover:bg-red-500/10">
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
