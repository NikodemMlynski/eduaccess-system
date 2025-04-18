import { Input } from "../ui/input";

interface SearchAndLimitBarProps {
    searchPlaceholder?: string;
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    limit: number;
    setLimit: (value: number) => void;
    setPage: (value: number) => void;
    limitOptions?: number[];
}

export function SearchAndLimitBar({
    searchPlaceholder = "Search...",
    searchQuery,
    setSearchQuery,
    limit,
    setLimit,
    setPage,
    limitOptions = [5, 10, 20]
}: SearchAndLimitBarProps) {
    return (
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
            <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
            }}
            className="md:w-[300px]"
            />
            <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <select
                value={limit}
                onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                }}
                className="border rounded px-2 py-1"
                >
                    {
                        limitOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}