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
    const { data: session} = useSession();
    const router = useRouter();

    return (
        <div className="p-3">
            <h1>HI SIGN UP HERE</h1>
            <div>
                <a href="/Login">
                    <button className="btn btn-secondary">
                        Go Back to Login
                    </button>
                </a>
                
            </div>
        </div>
    );
};