import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URL = [];

function isLocalhost() {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log('hostname   ' + hostname);
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
}

isLocalhost();

const baseUrl = URL[0]

const PoAmt = () => {
    const [amt, setAmt] = useState([]);

    useEffect(() => {
        const getData = async() => {
            try {
                const res = await axios.get(`${baseUrl}/api/trackOrder/poAmnt`);

                console.log(res.data);
                const blank = res.data[0].PO_count
                console.log(blank)
                setAmt(blank)
            } catch (error) {
                console.log(error)
            }
        }

        getData()
    }, [])

    return(
        <div>{amt}</div>
    )
}

export default PoAmt;