// Profile Page
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        console.log("hostname   " + hostname);
        if (hostname == "localhost") {
            URL.push("http://localhost:3000", "http://localhost:5000");
            console.log(URL);
        } else if (hostname == "abc-cooking-studio.azurewebsites.net") {
            URL.push(
                "https://abc-cooking-studio-backend.azurewebsites.net",
                "https://abc-cooking-studio.azurewebsites.net"
            );
            console.log(URL);
        }

        return URL;
    }
};

isLocalhost();

const baseUrl = URL[0];

export default function Profile() {
    const { data: session } = useSession();
    const router = useRouter();

    const [id, setUserID] = useState();
    const [role, setRoleID] = useState();

    const [Username, setUsername] = useState();
    const [Email, setEmail] = useState();

    useEffect(() => {
        // set user id taken from localstorage
        const userID = parseInt(localStorage.getItem("ID"), 10);
        // const userID = session?.userDetails.userID;
        setUserID(userID);

        // set user role
        // const roleID = parseInt(localStorage.getItem("roleID"), 10);
        // setRoleID(roleID);

        // set user token
        const token = localStorage.getItem("token");

        axios.get(`${baseUrl}/api/user/${userID}`,
            {
                headers: {
                    authorization: 'Bearer ' + token
                }
            }
        )
            .then((response) => {
                // console.log(response.data);

                const userData = response.data[0];
                // console.log("USER DATA", userData);

                setUsername(userData.name);
                setEmail(userData.email);
                setRoleID(userData.role);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
                    localStorage.clear();
                    signOut({ callbackUrl: '/Unauthorised' });
                }
                else {
                    console.log(err);
                };
            });
    }, []);

    const logOut = async (e) => {
        e.preventDefault();

        localStorage.clear();
        signOut({ callbackUrl: '/' });
    };

    return (
        <div className="p-3">
            <div>
                <h1 className='PageHeader'>User Profile</h1>
            </div>

            <div className="pt-4 px-4">
                <div className="d-flex">
                    <div className="col-sm-2">
                        <h5>Role:</h5>
                    </div>
                    <div className="col-sm">
                        <p>{role}</p>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="col-sm-2">
                        <h5>Name:</h5>
                    </div>
                    <div className="col-sm">
                        <p>{Username}</p>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="col-sm-2">
                        <h5>Email:</h5>
                    </div>
                    <div className="col-sm">
                        <p>{Email}</p>
                    </div>
                </div>
            </div>

            <div className="py-4 px-4">
                <a href="/api/auth/signout">
                    <button onClick={logOut} className="btn btn-secondary">
                        Logout
                    </button>
                </a>

            </div>
        </div>
    );
};