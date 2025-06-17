import {Card, CardContent} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IAccessLog} from "@/types/AccessLog.ts";
import AccessLogsApprovalItem from "@/components/features/AccessLogs/AccessLogsApprovalItem.tsx";

interface AccessLogsApprovalProps {
    deniedAccessLogs: IAccessLog[];
    userId: number | null;
    teacherid: number | null;
}
const AccessLogsApproval = ({
    deniedAccessLogs,
    userId,
    teacherId
}: AccessLogsApprovalProps) => {
    return (
        <div className="mt-4 space-y-4">
        {deniedAccessLogs.map((accessLog) => (
          <AccessLogsApprovalItem
              key={accessLog.id}
              accessLog={accessLog}
              userId={userId}
              teacherId={teacherId}
          />
        ))}
      </div>
    )
}
export default AccessLogsApproval;