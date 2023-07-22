// login page
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useState } from "react";

import styles from '../styles/login.module.css';

import axios from "axios";

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // console.log('hostname   ' + hostname);
        if (hostname == 'localhost') {
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
        }
        else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
            URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
            console.log(URL);
        }

        return URL;
    }
};

isLocalhost();

const baseUrl = URL[0];

export default function Login() {
    const { data: session, status, update } = useSession();
    const router = useRouter();

    const [loginEmail, setEmail] = useState();
    const [Secret, showSecret] = useState(false);

    const ShowSecret = (e) => {
        showSecret(true);
    };

    const HideSecret = (e) => {
        showSecret(false);
    };

    // get input value
    const handleEmailInput = (e) => {
        setEmail(e.target.value);
    };

    // take input value to post
    const handleLogin = async (e) => {
        e.preventDefault();

        await axios.post(`${baseUrl}/api/user/login`,
            {
                email: loginEmail
            }
        )
            .then((res) => {
                console.log(res.data[0])

                const data = res.data[0];
                // add user data to local storage
                localStorage.setItem("ID", data.userID);
                localStorage.setItem("roleID", data.roleID);
                localStorage.setItem("FName", data.name);
                // localStorage.setItem("Email", data.email);

                console.log(loginEmail);

                // redirect to home page
                router.push('/Home');
            })
            .catch((err) => {
                console.log(err);
                if (err.code === "ERR_NETWORK") {
                    alert(err);
                }
                else if (err.response.status === 404) {
                    // TODO if acc 404 state to create account/redirect to create acc 
                    // ! Take note: Catching users here may lead to users creating random email accounts
                    alert(err.response.data);
                }
                // else{
                //     alert(err);
                // }
            })
    };

    return (
        <div className={styles.page}>
            <div className="container p-5 my-5 border rounded w-50" id={styles.card}>
                <div className="p-3">
                    <h1 className='PageHeader'>Developer Login</h1>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group p-4">
                        <label for="loginEmail" className="form-label">Email</label> <br />
                        <input type="email" id="loginEmail" className={styles.emailInput} onChange={handleEmailInput} required />
                        {
                            Secret === false &&
                            <button onClick={ShowSecret} className="btn btn-link px-0 float-end">View Secret</button>
                        }
                        {
                            Secret === true &&
                            <button onClick={HideSecret} className="btn btn-link px-0 float-end">Hide Secret</button>
                        }

                    </div>

                    <div>
                        {
                            Secret &&
                            <div className="ps-4 pt-4">
                                <p><b className="pe-3">Purchaser's Account:</b>johnWatt@purchaser.com</p>
                                <p><b className="pe-4">Approver's Account:</b>jannyTan@approver.com</p>
                            </div>
                        }
                    </div>

                    <div className="p-4 pt-5 container">
                        <div className="row">
                            <div className="col-md-4">
                                <button type='submit' className="btn btn-dark">
                                    <div className="px-3">Login</div>
                                </button>
                            </div>

                            <div className="col-md-4 offset-md-4 pe-0">
                                <a href="/Login">
                                    <button type='button' className="btn btn-secondary">
                                        <div className="px-3">Back</div>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};