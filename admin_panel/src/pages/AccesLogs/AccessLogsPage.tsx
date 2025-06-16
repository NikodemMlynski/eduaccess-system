import {useAccessLogs} from "@/hooks/access_logs.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {IAccessLog} from "@/types/AccessLog.ts";
import {PaginationControls} from "@/components/utils/PaginationControls.tsx";
import {useState} from "react";
import {PaginatedAccessLogsResonse} from "@/hooks/access_logs.ts";
import AccessLogsList from "@/components/features/AccessLogs/AccessLogsList.tsx";
import {Loader2} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import AccessLogSearchBar from "@/components/features/AccessLogs/AccessLogSearchBar.tsx";
import {useRooms} from "@/hooks/rooms.ts";
import {IRoom} from "@/types/rooms.ts";
import {SelectItem} from "@/components/ui/select.tsx";

export interface ISearchOptions {
    startDate: Date | null;
    endDate: Date | null;
    page: number;
    limit: number;
    roomId: string | null;
}
const limitOptions = [5, 10, 20];
const foramtDateYYYYMMDD = (date: Date | null) => {
    if (!date) return null;
    return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`

}


export default function AccessLogsPage() {
    const {user, token} = useAuth();
    const [searchOptions, setSearchOptions] = useState<ISearchOptions>({
        startDate: null,
        endDate: null,
        page: 1,
        limit: 10,
        roomId: null,
    })

    const handleSearchOptionsChange = (key: keyof ISearchOptions, value: Date | number) => {
        setSearchOptions(prev => ({...prev, [key]: value}));
    }

    const {data: rooms, isLoading: isRoomsLoading, isError: isRoomsError} = useRooms<IRoom>(
        `school/${user?.school_id}/rooms`,
        token || "",
        {
            paginated: true,
            limit: 100,
        }
    )

    const {
        data,
        isLoading,
        isError,
        error
    } = useAccessLogs<IAccessLog>(
        `school/${user?.school_id}/access-logs`,
        token || "",
        {
            start_date: foramtDateYYYYMMDD(searchOptions.startDate),
            end_date: foramtDateYYYYMMDD(searchOptions.endDate),
            paginated: true,
            limit: searchOptions.limit,
            page: searchOptions.page,
            room_id: searchOptions.roomId
        }
    )
    let content = <div className="h-[600px] w-[80%] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin"/></div>;
    if (isLoading || isRoomsLoading) content =   <div className="h-[600px] w-[80%] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin"/></div>

    if (isError) content =  <p>{error.message}</p>
    if(!isLoading && !isRoomsLoading && !isError) {
        content = (
            <ScrollArea className="h-[600px] w-[80%] rounded-md border p-4" key={`${searchOptions.page}`}>
                    <AccessLogsList accessLogs={data?.access_logs || []} />
            </ScrollArea>
        )
    }
    if(data && data.access_logs.length == 0) content = <div className="h-[600px] w-[80%] flex items-center justify-center"><p>There is no access logs for specified params</p></div>
    return (
        <div>
            <div className="flex flex-row gap-2 w-full justify-between">

            <AccessLogSearchBar
                searchOptions={searchOptions}
                setSearchOptions={handleSearchOptionsChange}
                limitOptions={limitOptions}
                setStartDate={(date) => handleSearchOptionsChange("startDate", date)}
                setEndDate={(date) => handleSearchOptionsChange("endDate", date)}
                isLoading={isLoading}
                isError={isError}
                content={
                <>
                    {rooms && rooms.rooms.map((room) => (
                            <SelectItem key={`${room.id}`} value={`${room.id}`}>{room.room_name}</SelectItem>
                        )
                    )}
                </>
                }
            />
                {
                    content
                }
            </div>
            <PaginationControls<IAccessLog, PaginatedAccessLogsResonse<IAccessLog>>
                page={searchOptions.page} setPage={(page) => handleSearchOptionsChange("page", +page)} data={data}
            />
        </div>
    )
}