interface AccessLogsProps {
    accessLogs: []
}

export default function AccessLogs ({accessLogs}: AccessLogsProps) {
    console.log(accessLogs);
    return (
        <h1>Tu będzie podstrona logów dostępu do sal</h1>
    )
}