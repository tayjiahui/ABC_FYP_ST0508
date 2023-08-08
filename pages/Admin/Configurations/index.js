import React from "react";
import axios from "axios";
import Image from "next/image";
import moment from 'moment-timezone';

import { useEffect, useState } from "react";

// Style Sheet
import styles from "../../../styles/adminConfiguration.module.css";

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

function GSTPageView() {

    return (
        <>
            <div className="p-4">
                <h2>GST%</h2>
            </div>

            <div className="px-4">
                <div className="d-flex">
                    <label><b>Current GST(%):</b></label>
                    <p className="ps-3">8%</p>
                </div>

                <div className="pb-3">
                    <a className={styles.seeMoreLink}>
                        <button type="button" className="btn px-0">
                            <u>View GST% History</u>
                        </button>
                    </a>
                </div>

                <div className="pt-3">
                    <button className="btn btn-secondary rounded" style={{ backgroundColor: '#486284' }}>
                        Update GST
                    </button>
                </div>
            </div>
        </>
    )
};

function PaymentModePageView() {

    return (
        <>
            <div className="p-4">
                <h2>Payment Mode</h2>
            </div>

            {/* <div className="px-4">
                <div className="d-flex">
                    <label><b>Current GST(%):</b></label>
                    <p className="ps-3">8%</p>
                </div>

                <div className="pb-3">
                    <a className={styles.seeMoreLink}>
                        <button type="button" className="btn px-0">
                            <u>View GST% History</u>
                        </button>
                    </a>
                </div>

                <div className="pt-3">
                    <button className="btn btn-secondary rounded" style={{ backgroundColor: '#486284' }}>
                        Update GST
                    </button>
                </div>
            </div> */}
        </>
    )
};

export default function Configurations() {

    const [Token, setToken] = useState();

    const [PageView, setPageView] = useState();
    const [GSTPage, setGSTPage] = useState(<GSTPageView/>);
    const [PaymentModePage, setPaymentModePage] = useState(<PaymentModePageView/>);


    useEffect(() => {

        // default view is GST page
        setPageView(GSTPage);
    }, []);

    const PageDirectory = (e) => {
        const clicked = e.target.id;

        if(clicked === 'GST'){
            setPageView(GSTPage);
        } else if (clicked === 'PaymentMode'){
            setPageView(PaymentModePage);
        }
        
    };

    return (
        <div>
            <div className="px-2">
                <h1>Configurations</h1>
            </div>

            <div className="row pt-5 h-100">

                <div className="col-sm-3 border border-bottom-0" style={{ backgroundColor: '#f4f8fd' }}>
                    <div className="row border-bottom">
                        <button onClick={PageDirectory} className="btn text-start">
                            <h5 id="GST" className="py-2 px-5">GST</h5>
                        </button>
                    </div>
                    <div className="row border-bottom">
                        <button onClick={PageDirectory} className="btn text-start">
                            <h5 id="PaymentMode" className="py-2 px-5">Payment Mode</h5>
                        </button>
                    </div>
                </div>
                <div className="col-sm border" style={{ maxHeight: '100%', minHeight: '400px' }}>
                    {PageView}
                </div>
            </div>
        </div>
    );
};