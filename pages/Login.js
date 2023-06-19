// login page
import { useSession, signIn, signOut } from "next-auth/react";
import { getToken } from "next-auth/jwt"
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

import styles from '../styles/login.module.css';

import axios from "axios";

const baseUrl = "http://localhost:3000";

const logIn = async() => {
    alert(`stop`);
    // await signIn(null, { callbackUrl:"/Home" });
    signIn(null, {callbackUrl: "/testLogout"});

    await auth2(session?.accessToken);
    alert(`stop`);
}

const auth2 = async (accessToken) => {

    console.log("acesss auth2 print" + accessToken);
    alert(`stop`)

    await axios.post(`http://sso.abc-cooking.studio/auth/realms/test-pos/broker/oidc/token`,
        {
            Headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
    )
    .then((response) => {
        console.log("auth 2");
        console.log("auth 2 responseee ++++++++++++++" + response);
        // console.log(response.access_token);
        // alert(response.access_token)
    })
    .catch((err) => {
        console.log(err);
        alert(err);
    })

    console.log("done")
}

const jwtTest = async(req,res) => {
    console.log(req.headers)
    const token = await getToken({req});
    console.log(getToken());
    console.log("JSON WEB TOKEN", token);
    res.end();
}

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
        
        axios.post(`${baseUrl}/api/user/login`, 
            {
                email: loginEmail
            }
        )
        .then((res) => {
            alert(`Login Successful!`);
            // console.log(res.data);
            // console.log(res.data[0]);

            const data = res.data[0];

            // add user data to local storage
            localStorage.setItem("ID", data.userID);
            localStorage.setItem("roleID", data.roleID);
            localStorage.setItem("Name", data.name);
            // localStorage.setItem("Email", data.email);

            signIn(null, { callbackUrl:"/Home" });
            // signIn('keycloak', { callbackUrl:"/Home" });

            // auth2(session?.accessToken);
            // alert(`stop`)
            console.log({ session, status, update });

            // logIn();
            
            console.log("this session ========= " + session?.accessToken);


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
        })
    }

    return (
        <div className={styles.page}>
            <div class="container p-5 my-5 border rounded w-50" id={styles.card}>
                <div class="p-3">
                    <h1 className='PageHeader'>Login</h1>
                </div>
            
                <form onSubmit={handleLogin}>
                    <div class="form-group p-4">
                        <label for="loginEmail" class="form-label">Email</label> <br/>
                        <input type="email" id="loginEmail" className={styles.emailInput} onChange={handleEmailInput} required/>
                    </div>

                    <div class="p-4">
                        {/* <a href="/api/auth/signin"> */}
                            <button type='submit' className={styles.loginButton}>Login</button>
                        {/* </a> */}
                        
                    </div>
                    
                </form>
            </div>
        </div>
    );
};