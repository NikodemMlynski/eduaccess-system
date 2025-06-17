import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {ISearchOptions} from "@/pages/AccesLogs/AccessLogsPage.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {ReactNode} from "react";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";

interface AccessLogSearchBarProps {
    searchOptions: ISearchOptions;
    setSearchOptions: (key: keyof ISearchOptions, value: Date | number) => void;
    limitOptions: number[];
    setStartDate: (date: Date | number) => void;
    setEndDate: (date: Date | number) => void;
    content: ReactNode;
    isLoading: boolean;
    isError: boolean;

}

const AccesLogSearchBar = ({
    searchOptions,
    setSearchOptions,
    limitOptions,
    setStartDate,
    setEndDate,
    isLoading,
    isError,
    content
}: AccessLogSearchBarProps) => {
    return (
        <div className="mb-4 flex flex-col md:flex-row md:items-center gap-0">

            <div className="flex flex-col items-center gap-0">
                <div className="flex flex-row justify-around items-center gap-5">
                    <span>Items per page:</span>
                    <Select
                    onValueChange={(value) => setSearchOptions("limit", +value)}
                    value={searchOptions.limit.toString()}
                    >
                        <SelectTrigger>
                            <SelectValue/>

                        </SelectTrigger>
                        <SelectContent>
                            {limitOptions.map(limitOption => (
                                <SelectItem key={`${limitOption}`} value={`${limitOption}`}>{limitOption}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Calendar
                  mode="single"
                  selected={searchOptions.startDate}
                  onSelect={setStartDate}
                  className="rounded-md border scale-[85%]"
                  />
                <Calendar
                  mode="single"
                  selected={searchOptions.endDate}
                  onSelect={setEndDate}
                  className="rounded-md border scale-[85%]"
                  />
                <LessonTemplateSelect
                    isLoading={isLoading}
                    isError={isError}
                    errorMessage={"Failed to load rooms"}
                    content={content}
                    onValueChange={(value) => setSearchOptions("roomId", +value)}
                    onButtonClick={() => {}}
                    label={"Select room"}
                    isSearch={false}
                    />
            </div>
        </div>
    )
}

export default AccesLogSearchBar;