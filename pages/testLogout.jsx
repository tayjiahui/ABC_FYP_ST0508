import { signOut } from "next-auth/react";


export default function TESTLOGOUT() {
    
    const logOut = async(e) => {
        e.preventDefault();

        localStorage.clear();
        // router.push('/');
        await signOut({ callbackUrl: '/' });
    }

    return (
        <div>
            <a href="/api/auth/signout">
                <button onClick={logOut}>
                    Logout
                </button>
            </a>
        </div>
    );
};