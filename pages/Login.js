// login page
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/router';

import styles from '../styles/login.module.css';

export default function Login() {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    console.log({ session, status, update });

    useEffect(() => {
        if(!session){
            router.push('/Login');
        }
        else if(session.userDetails.role === 5){
            router.push('/Admin/Home');
        } else {
            router.push('/Home');
        };
    }, [session])

    const login = () => {
        // signIn("keycloak", { callbackUrl: "/Home" })
        signIn("keycloak");
    };

    return (
        <div className={styles.page}>
            <div className="container p-5 my-5 border rounded w-50" id={styles.card}>
                <div className="p-3">
                    <h1 className='PageHeader'>Welcome back!</h1>
                </div>

                <div className="px-3 pt-4">
                    <p><b>Just one click away from signing in!</b></p>
                    <button onClick={login} className="btn btn-dark">
                        Company SSO Sign In
                    </button>
                </div>

                <div className="p-3 pt-5 mt-3">
                    <p>Developing this App?</p>
                    <a href="/fakeLogin">
                        <button className="btn btn-secondary">
                            Development Login
                        </button>
                    </a>
                    <p>Click here ^</p>
                </div>
            </div>
        </div>
    );
};