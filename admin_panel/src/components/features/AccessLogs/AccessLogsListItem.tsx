import {Card, CardContent} from "@/components/ui/card.tsx";
import {IAccessLog} from "@/types/AccessLog.ts";
interface AccessLogsListItemProps {
    accessLog: IAccessLog;
}
const AccessLogsListItem = ({
    accessLog
}: AccessLogsListItemProps) => (
         <Card key={accessLog.id} className="flex flex-row justify-between items-center p-4 px-2">
            <CardContent className="space-y-1 flex flex-row justify-between items-center w-full">
                <div className="flex flex-col justify-between w-[33%]">

                    <p className="text-lg font-semibold">
                        {accessLog.user.first_name} {accessLog.user.last_name}
                    </p>
                    <p className="text-md text-gray-600">
                        Room: <span className="font-medium">{accessLog.room.room_name}</span>
                    </p>
                </div>
                <div className="flex flex-col w-[33%]">
                    <p className="text-md text-gray-600">
                        Entered at: {" "}
                        <span className="font-medium">
                            {new Date(accessLog.access_start_time).toLocaleString()}
                        </span>
                    </p>
                    <p className="text-md text-gray-600">
                        Left at: {" "}
                        <span className="font-medium">
                          {accessLog.access_end_time ? (new Date(accessLog.access_end_time).toLocaleString()) : "-"}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-[33%]">

                    <p className={`uppercase text-lg ${accessLog.access_status === "granted" ? "text-green-600" : "text-red-600"}`}>
                        {accessLog.access_status}
                    </p>
                    <p className="text-shadow-sm text-xs font-mono text-gray-600">
                        {" "}
                        <span className="italic text-gray-800">{accessLog.reason}</span>
                    </p>
                </div>
            </CardContent>

          </Card>
)
export default AccessLogsListItem;