import {IAccessLog} from "@/types/AccessLog.ts";
import AccessLogsListItem from "@/components/features/AccessLogs/AccessLogsListItem.tsx";

interface AccessLogsListProps {
    accessLogs: IAccessLog[];
}

const AccessLogsList = ({
    accessLogs
}: AccessLogsListProps) => {
    console.log(accessLogs);
     return (
        <div className="mt-4 space-y-4">
        {accessLogs.map((accessLog) => (
            <AccessLogsListItem accessLog={accessLog} key={accessLog.id}/>
        ))}
      </div>
    )
}
export default AccessLogsList;