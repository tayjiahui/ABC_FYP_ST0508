// login page
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

import styles from '../styles/login.module.css';

import axios from "axios";

// Base urls
const URL = [];

function isLocalhost() 
{
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // console.log('hostname   ' + hostname);
        if(hostname == 'localhost'){
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
            
        }
        else if(hostname == 'abc-cooking-studio.azurewebsites.net'){
            URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
            console.log(URL);
        }

        return URL;
    }
};

isLocalhost();

const baseUrl = URL[0];

export default function Login() {
    const { data: session, status, update} = useSession();
    // const { session, loading } = useSession();
    const router = useRouter();
    
    console.log({ session, status, update });

    // from session
    // {
    //     user: {
    //       name: string,
    //       email: string,
    //       image: uri
    //     },
    //     accessToken: string,
    //     expires: "YYYY-MM-DDTHH:mm:ss.SSSZ"
    //   }

    // console.log("this is session ========= " + session.accessToken);

    const [loginEmail, setEmail] = useState();

    // get input value
    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    };

    // take input value to post
    const handleLogin = async(e) => {
        e.preventDefault();
        
        await axios.post(`${baseUrl}/api/user/login`, 
            {
                email: loginEmail
            }
        )
        .then((res) => {
            // alert(`Login Successful!`);
            // console.log(res.data);
            // console.log(res.data[0]);

            const data = res.data[0];

            // add user data to local storage
            localStorage.setItem("ID", data.userID);
            localStorage.setItem("roleID", data.roleID);
            localStorage.setItem("Name", data.name);
            // localStorage.setItem("Email", data.email);

            // signIn();
            signIn(null, { callbackUrl:"/Home" });

            // auth2(session?.accessToken);
            console.log({ session, status, update });
            
            console.log("this is session ========= " + session?.accessToken);

            // redirect to home page
            // router.push('/Home');

            console.log("success")

            // react sign in
            // signIn();
            // signIn({ callbackUrl: '/Home' });

        })
        .catch((err) => {
            console.log(err);
            if(err.code === "ERR_NETWORK"){
                alert(err);
            }
            else if(err.response.status == 404){
                alert(err.response.data);
            }
            // else{
            //     alert(err);
            // }
            if(err.code === "ERR_NETWORK"){
                alert(err);
            }
            else if(err.response.status == 404){
                alert(err.response.data);
            }
            // else{
            //     alert(err);
            // }
        })
    }

    return (
        <div className={styles.page}>
            <div className="container p-5 my-5 border rounded w-50" id={styles.card}>
                <div className="p-3">
                    <h1 className='PageHeader'>Login</h1>
                </div>
            
                <form onSubmit={handleLogin}>
                    <div className="form-group p-4">
                        <label for="loginEmail" className="form-label">Email</label> <br/>
                        <input type="email" id="loginEmail" className={styles.emailInput} onChange={handleEmailInput} required/>
                    </div>

                    <div className="p-4">
                        {/* <a href="/api/auth/signin"> */}
                            <button type='submit' className={styles.loginButton}>Login</button>
                        {/* </a> */}
                        
                    </div>
                    
                </form>
            </div>
        </div>
    );
};