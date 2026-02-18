// ============================================================
// Loading Skeleton Components
// ============================================================

export function BookCardSkeleton() {
    return (
        <div className="glass-card overflow-hidden">
            <div className="skeleton aspect-[2/3]" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-3 w-1/3 rounded" />
                <div className="flex justify-between items-center">
                    <div className="skeleton h-6 w-16 rounded" />
                    <div className="skeleton h-8 w-24 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function BookGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <BookCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function BookDetailSkeleton() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="skeleton aspect-[2/3] rounded-2xl" />
                <div className="space-y-6">
                    <div className="skeleton h-8 w-3/4 rounded" />
                    <div className="skeleton h-5 w-1/2 rounded" />
                    <div className="skeleton h-4 w-1/4 rounded" />
                    <div className="space-y-2">
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-full rounded" />
                        <div className="skeleton h-4 w-3/4 rounded" />
                    </div>
                    <div className="skeleton h-12 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="skeleton h-14 w-full rounded-lg" />
            ))}
        </div>
    );
}
