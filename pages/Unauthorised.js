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

export default function Unauthorised() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        localStorage.clear();
    })

    return (
        <div className="p-5">
            <div className="p-5 card w-50 border-0">
                <h1><div>401!</div>Unauthorised Access</h1>
                <div className="pt-4">
                    <h4><div>Access is denied: Invalid Credentials!</div></h4>
                    <div className="pt-4">
                        <a href="/Login">
                            <button className="btn btn-dark">
                                Back to Login
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};