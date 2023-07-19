// this is the homepage
// import Link from 'next/link';
import { useSession } from "next-auth/react";

import BarChart from '../components/barchart';
import PrAmt from '../components/prAmt';
import PoAmt from '../components/poAmt';
import { useEffect } from "react";

// Base urls
const URL = [];

function isLocalhost (){
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
        };

        return URL;
    };
};

isLocalhost();

const baseUrl = URL[0];

//----------------------function name has to be uppercase
export default function Home() {
    const { data: session} = useSession();

    useEffect(() => {
        // add user data to local storage
        localStorage.setItem("ID", session?.userDetails.userID);
        localStorage.setItem("roleID", session?.userDetails.role);
        localStorage.setItem("Name", session?.userDetails.name);
    },[])


    return (
        <div>
            <h1 className="ms-5 mb-5">Dashboard</h1>
            <div className="d-flex">

                <div className="col-sm square rounded p-3 text-center ms-5 pt-4" style={{ backgroundColor: '#C0D8F7' }}>
                    <h5>Number of Purchase Request as of date:</h5>
                    <h1 className="fw-bolder pt-2"><PrAmt /></h1>
                </div>
                <div className="col-sm ms-2 square rounded p-3 text-center me-5 pt-4" style={{ backgroundColor: '#C0D8F7' }}>
                    <h5>Number of Purchase Orders as of date:</h5>
                    <h1 className="fw-bolder pt-2"><PoAmt /></h1>

                </div>
            </div>

            <div className="col-sm rectangle rounded p-5 text-center mt-3 justify-content-center ms-5 me-5 border border-4" style={{ backgroundColor: 'white' }}>
                <h5>Current Purchase Orders in Respective Statuses:</h5>
                <BarChart />
            </div>

            <div className="d-flex">
                <div className="col-sm rounded-4 mt-3 mb-4 w-25 h-25 p-4 ms-5 text-white shadow text-center" style={{ backgroundColor: '#486284' }}>
                    <a href='/PurchasePlanning/Calendar'>
                        <button className='bg-transparent text-white text-center border-0 w-100 h-100'>
                        View Calendar
                        </button>
                    </a>
                </div>
                <div className="col-sm rounded-4 mt-3 mb-4 w-25 h-25 p-4 ms-5 me-5 shadow text-center" style={{ backgroundColor: '#486284' }}>
                    <a href='/PurchaseRequest/CreatePR'>
                        <button className='bg-transparent text-white text-center border-0 w-100 h-100'>
                            Create Adhoc purchase
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};