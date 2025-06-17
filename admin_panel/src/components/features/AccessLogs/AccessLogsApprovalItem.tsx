import {accessStatus, IAccessLog} from "@/types/AccessLog.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useAccessLogApproval} from "@/hooks/access_logs.ts";
import {toast} from "react-toastify";

interface AccessLogsApprovalItemProps {
    accessLog: IAccessLog;
    userId: number | null;
    teacherId: number | null;
}

const AccessLogsApprovalItem = ({
    accessLog,
    userId,
    teacherId,
}: AccessLogsApprovalItemProps) => {
    const {user, token} = useAuth();
    const approvaAccessLogMutation = useAccessLogApproval(
        `school/${user?.school_id}/access-logs`,
        accessLog.id,
        teacherId,
        token || ""
    )

    const handleApprovalButtonClick = async (status: accessStatus) => {
        const current_time = "2025-06-16T09:20:52.681559";
        approvaAccessLogMutation.mutate({
            status,
            user_id: userId,
            current_time
        },
            {
                onSuccess: () => {
                    toast.success(`Successfully ${status === "denied" ? "denied" : "granted"} request permission.`)
                },
                onError: (error) => {
                    toast.error(error.message || "Something went wrong");
                }
            })
    }

    return (
        <Card key={accessLog.id} className="flex flex-row justify-between items-center p-4">
            <CardContent className="space-y-1">
              <p className="text-lg font-semibold">
                {accessLog.user.first_name} {accessLog.user.last_name}
              </p>
              <p className="text-sm text-gray-600">
                Room: <span className="font-medium">{accessLog.room.room_name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Start:{" "}
                <span className="font-medium">
                  {new Date(accessLog.access_start_time).toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Reason:{" "}
                <span className="italic text-gray-800">{accessLog.reason}</span>
              </p>
            </CardContent>
            <div className="flex flex-col gap-2">
              <Button variant="default" className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprovalButtonClick("granted")}
              >
                Grant
              </Button>
              <Button variant="destructive"
                onClick={() => handleApprovalButtonClick("denied")}
              >Deny</Button>
            </div>
          </Card>
    )
}

export default AccessLogsApprovalItem;