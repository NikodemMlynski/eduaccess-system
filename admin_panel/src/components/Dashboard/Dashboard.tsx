import { useAuth } from '@/context/AuthProvider';

export default function Dashboard () {
    const {user} = useAuth();
    return (
        <h1>Tu będzie dashboard {user?.first_name}</h1>
    )
}