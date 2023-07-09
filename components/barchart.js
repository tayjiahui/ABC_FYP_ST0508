import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

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


const BarChart = () => {
    const [barData, setBarData] = useState({ datasets: [], });

    useEffect(() => {
        let status = [];
        let number = [];

        axios.get(`${baseUrl}/api/trackOrder/purchaseStatuses`)
            .then(res => {
                console.log(res.data)
                for (const dataObj of res.data) {
                    // console.log(dataObj)
                    number.push(parseInt(dataObj.order_count))
                    // console.log(number)
                    let statusName = dataObj.purchaseStatus
                    status.push(statusName);
                    console.log(status)
                }
                setBarData ({
                    labels: status,
                    datasets: [
                        {
                            label: 'Amount per status',
                            data: number,
                            backgroundColor: ['#7EB2DD', '#445E93'],
                            // borderColor: 'rgba(75,192,192,1)',
                            // borderWidth: 1,
                        },
                    ],
                });

            })
    })



    return <Bar data={barData} />;
};

export default BarChart;