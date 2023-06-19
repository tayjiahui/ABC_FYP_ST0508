// Profile Page
import { signOut } from "next-auth/react";
import { useRouter } from 'next/router';

export default function Profile() {
    const router = useRouter();

    const logOut = async(e) => {
        e.preventDefault();

        localStorage.clear();
        // router.push('/');
        await signOut({ callbackUrl: '/' });
    }

    return (
        <div>
            <h1 className='PageHeader'>Hello this is the Profile Page</h1>
            <p>Check back here for more in Phase 2!</p>
            <div>
                <a href="/api/auth/signout">
                    <button onClick={logOut}>
                        Logout
                    </button>
                </a>
                
            </div>
        </div>
    );
};