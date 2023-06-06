// Profile Page
import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();

    const logOut = () => {
        localStorage.clear();
        router.push('/');
    }

    return (
        <div>
            <h1 className='PageHeader'>Hello this is the Profile Page</h1>
            <p>Check back here for more in Phase 2!</p>
            <div>
                <button onClick={logOut}>
                    Logout
                </button>
            </div>
        </div>
    );
};