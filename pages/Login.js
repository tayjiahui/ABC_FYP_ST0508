// login page
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

import styles from '../styles/login.module.css';

import axios from "axios";

const baseUrl = "http://localhost:3000";

export default function Login() {
    const router = useRouter();

    const [loginEmail, setEmail] = useState();

    // get input value
    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    };

    // take input value to post
    const handleLogin = (e) => {
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

            // redirect to home page
            router.push('/Home');
        })
        .catch((err) => {
            console.log(err);
            alert(err.response.data);
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
                        <input type="email" id="loginEmail" className={styles.emailInput} onChange={handleEmailInput}/>
                    </div>

                    <div class="p-4">
                        <button type='submit' className={styles.loginButton}>Login</button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
};