import React from "react";
import axios from "axios";
import Image from "next/image";
import moment from 'moment-timezone';

import { useEffect, useState } from "react";

// Style Sheet
import styles from "../../../styles/auditLog.module.css";

// components
import AlertBox from "../../../components/alert";

// Images 
import xIcon from "../../../public/xIcon.svg";

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
        };

        return URL;
    };
};

isLocalhost();

const baseUrl = URL[0];

export default function Configurations() {

    const [Token, setToken] = useState();

    return (
        <div>
            <div className="px-5">
                <h1>Configurations</h1>
            </div>
        </div>
    );
};