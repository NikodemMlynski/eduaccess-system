import {useAccessLogs} from "@/hooks/access_logs.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {IAccessLog} from "@/types/AccessLog.ts";
import {PaginationControls} from "@/components/utils/PaginationControls.tsx";
import {useState} from "react";
import {PaginatedAccessLogsResonse} from "@/hooks/access_logs.ts";
import AccessLogsList from "@/components/features/AccessLogs/AccessLogsList.tsx";
import {Loader2} from "lucide-react";

export default function AccessLogsPage() {
    const {user, token} = useAuth();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const {
        data,
        isLoading,
        isError,
        error
    } = useAccessLogs<IAccessLog>(
        `school/${user?.school_id}/access-logs`,
        token || "",
        {
            start_date: "2025-06-10",
            end_date: "2025-06-17",
            paginated: true,
            limit: limit,
            page: page,
        }
    )

    if (isLoading) {
        return <Loader2 className="w-10 h-10 animate-spin"/>
    }

    if (isError) {
        return <p>{error.message}</p>
    }
    console.log(data);
    return (
        <div>
            <div key={`${page}`}>
                <AccessLogsList accessLogs={data?.access_logs || []} />
            </div>
            <PaginationControls<IAccessLog, PaginatedAccessLogsResonse<IAccessLog>>
                page={page} setPage={setPage} data={data}
            />
        </div>
    )
}