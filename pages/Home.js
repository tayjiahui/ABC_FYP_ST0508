// this is the homepage

// import Link from 'next/link'
// import { useEffect, useState } from "react";
import BarChart from '../components/barchart';
import PrAmt from '../components/prAmt';
import PoAmt from '../components/poAmt';


//----------------------function name has to be uppercase
export default function Home() {

    return (
        <div>
            <h1 className="ms-5 mb-5">Dashboard</h1>
            <div className="d-flex">

                <div className="col-sm square rounded p-3 text-center ms-5 pt-4" style={{ backgroundColor: '#C0D8F7' }}>
                    <h5>Number of Purchase Request as of date:</h5>
                    <h1 className="fw-bolder pt-2"><PrAmt/></h1>
                </div>
                <div className="col-sm ms-2 square rounded p-3 text-center me-5 pt-4" style={{ backgroundColor: '#C0D8F7' }}>
                    <h5>Number of Purchase Orders as of date:</h5>
                    <h1 className="fw-bolder pt-2"><PoAmt/></h1>
                    
                </div>
            </div>

            <div className="col-sm rectangle rounded p-5 text-center mt-3 justify-content-center ms-5 me-5 border border-4" style={{ backgroundColor: 'white' }}>
                <h5>Current Purchase Orders in Respective Statuses:</h5>
                <BarChart/>
            </div>

            <div className="d-flex">

                <div className="col-sm rounded-4 mt-3 mb-4 w-25 h-25 p-4 ms-5 text-white shadow text-center" style={{ backgroundColor: '#486284' }}>View Calendar</div>
                <div className="col-sm rounded-4 mt-3 mb-4 w-25 h-25 p-4 ms-5 me-5 text-white shadow text-center" style={{ backgroundColor: '#486284' }}>Create Adhoc purchase</div>
            </div>


        </div>


    );
};