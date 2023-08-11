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

function StatusPageView() {

    const [paymentStatuses, setPaymentStatuses] = useState([]);
    const [paymentStatusID, setPaymentStatusID] = useState([]);

    const fetchPaymentStatuses = () => {
        axios.get(`${baseUrl}/api/paymentTrack/`)
            .then(response => {
                setPaymentStatuses(response.data);
            })
            .catch(error => {
                console.error("Error fetching payment statuses:", error);
            });
    };

    useEffect(() => {
        fetchPaymentStatuses();
    }, []);

    const handleDelete = (status) => {
        axios.get(`${baseUrl}/api/paymentTrack/status/${status}`)
            .then(response => {
                const statusID = response.data[0].PaymentStatusID
                setPaymentStatusID(statusID);

                axios.delete(`${baseUrl}/api/paymentTrack/${statusID}`)
                    .then(response => {
                        console.log('status deleted!')
                        fetchPaymentStatuses();
                    })
                    .catch(err => {
                        console.log('status could not be deleted', err)
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }


    return (
        <>
            <div className="p-4">
                <h2>Payment Status</h2>
            </div>

            <div className="px-4">
                <div className="d-flex">
                    <label><b>Manage Statuses</b></label>
                </div>

                <div className="pb-3 mt-3">
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {paymentStatuses.map((status, index) => (
                            <li key={index} className="d-flex align-items-center">
                                <span>{status.paymentStatus}</span>
                                {['Pending', 'Payment Sent', 'Payment Received'].includes(status.paymentStatus) ? null : (
                                    <button className="btn btn-link btn-sm" onClick={() => handleDelete(status.paymentStatus)} style={{ textDecoration: 'none', color: 'black', lineHeight: '1' }}>
                                        <span aria-label="Delete" style={{ fontSize: '20px', verticalAlign: 'middle' }}>&times;</span>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

function PurchaseStatusPageView() {

    const [purchaseStatuses, setPurchaseStatuses] = useState([]);
    const [purchaseStatusID, setPurchaseStatusID] = useState([]);

    const fetchPurchaseStatuses = () => {
        axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`)
            .then(response => {
                const purchaseStatusesData = response.data.map(item => item.purchaseStatus);
                setPurchaseStatuses(purchaseStatusesData);
                console.log(purchaseStatusesData)
            })
            .catch(error => {
                console.error("Error fetching purchase statuses:", error);
            });
    };

    useEffect(() => {
        fetchPurchaseStatuses();
    }, []);


    const handleDelete = (status) => {
        alert(`${status}`)
        axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/id/${status}`)
        .then(response => {
            const statusID = response.data[0].purchaseStatusID
            setPurchaseStatusID(statusID);

            console.log(response)

            // axios.delete(`${baseUrl}/api/trackOrder/purchaseStatus/${statusID}`)
            // .then(response => {
            //     console.log('status deleted!')
            //     fetchPurchaseStatuses();
            // })
            // .catch(err => {
            //     console.log('status could not be deleted', err)
            // })
        })
        .catch(err => {
            console.log(err);
        })

    }


    return (
        <>
            <div className="p-4">
                <h2>Purchase Status</h2>
            </div>

            <div className="px-4">
                <div className="d-flex">
                    <label><b>Manage Statuses</b></label>
                </div>

                <div className="pb-3 mt-3">
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {purchaseStatuses.map((status, index) => (
                            <li key={index} className="d-flex align-items-center">
                                <span>{status}</span>
                                {['Accept Order', 'Preparing Order', 'Preparing Delivery', 'Shipping Item', 'Item Delivered'].includes(status) ? null : (
                                    <button className="btn btn-link btn-sm" onClick={() => handleDelete(status)} style={{ textDecoration: 'none', color: 'black', lineHeight: '1' }}>
                                        <span aria-label="Delete" style={{ fontSize: '20px', verticalAlign: 'middle' }}>&times;</span>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
};

export default function Configurations() {

    const [Token, setToken] = useState();

    const [PageView, setPageView] = useState();
    const [GSTPage, setGSTPage] = useState(<GSTPageView />);
    const [PaymentModePage, setPaymentModePage] = useState(<PaymentModePageView />);
    const [StatusView, setStatusView] = useState(<StatusPageView />)
    const [PurchaseStatusView, setPurchaseStatusView] = useState(<PurchaseStatusPageView />)


    useEffect(() => {

        // default view is GST page
        setPageView(GSTPage);
    }, []);

    const PageDirectory = (e) => {
        const clicked = e.target.id;

        if (clicked === 'GST') {
            setPageView(GSTPage);
        } else if (clicked === 'PaymentMode') {
            setPageView(PaymentModePage);
        } else if (clicked === 'Statuses') {
            setPageView(StatusView)
        } else if (clicked === 'PurchaseStatus') {
            setPageView(PurchaseStatusView)
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
                    <div className="row border-bottom">
                        <button onClick={PageDirectory} className="btn text-start">
                            <h5 id="Statuses" className="py-2 px-5">Payment Status</h5>
                        </button>
                    </div>
                    <div className="row border-bottom">
                        <button onClick={PageDirectory} className="btn text-start">
                            <h5 id="PurchaseStatus" className="py-2 px-5">Purchase Status</h5>
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