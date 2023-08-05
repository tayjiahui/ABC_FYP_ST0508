import React from "react";
import axios from "axios";
import Image from "next/image";
import moment from "moment/moment";

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

// Each Transaction Row
function TransactionRow(props) {
    const [Token, setToken] = useState();

    const [PONO, setPONO] = useState();
    const [PurchaseStatus, setPurchaseStatus] = useState();

    const [showDetails, setShowDetails] = useState(false);
    const [RequestDate, setRequestDate] = useState();
    const [Branch, setBranch] = useState();
    const [Supplier, setSupplier] = useState();
    const [PaymentMode, setPaymentMode] = useState();

    const transaction = props.TransactionData;
    console.log(transaction);

    useEffect(() => {
        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        const poID = transaction.prID.toString().padStart(5, '0');
        const reqDate = moment(transaction.requestDate).format('YYMMDD');

        const BranchPrefix = [];
        if (transaction.branchPrefix !== null) {
            if (transaction.branchPrefix.match(",") !== null) {
                BranchPrefix.push(transaction.branchPrefix.substring(0, transaction.branchPrefix.indexOf(',')));
            } else {
                BranchPrefix.push(transaction.branchPrefix);
            };
        };

        if (transaction.purchaseTypeID === 2) {
            setPurchaseStatus('N/A');
            setPONO(`${reqDate}${poID}`);
            setBranch('N/A');
            setSupplier('N/A');
            setPaymentMode('Cash');
        } else {
            setPurchaseStatus(transaction.purchaseStatus);
            setPONO(`${BranchPrefix}${reqDate}${poID}`);
            setBranch(transaction.branchName);
            setSupplier(transaction.supplierName);
            setPaymentMode(transaction.paymentMode);
        };

        // Additional Details
        setRequestDate(moment(transaction.requestDate).format('D MMM YYYY'));
    }, []);

    const handleMoreClick = () => {
        if (showDetails === false) {
            setShowDetails(true);
        } else {
            setShowDetails(false);
        };
    };

    return (
        <div>
            <div className={styles.prButton}>
                <div className={styles.prRow}>
                    <div className="py-2 row text-start px-4">
                        <div className="col-sm-2">
                            #{PONO}
                        </div>
                        <div className="col-sm-2">
                            {transaction.purchaseType}
                        </div>
                        <div className="col-sm-2">
                            {PurchaseStatus}
                        </div>
                        <div className="col-sm-2">
                            {transaction.paymentStatus}
                        </div>
                        <div className="col-sm-2">
                            ${transaction.totalPrice}
                        </div>
                        <div className="col-sm-2">
                            <a onClick={handleMoreClick} className={styles.seeMoreLink}>
                                {
                                    showDetails ? (
                                        <div>See Less</div>
                                    ) : (
                                        <div>See More</div>
                                    )
                                }
                            </a>
                        </div>
                    </div>
                </div>

                {
                    showDetails &&
                    <div className="pb-1 pt-0">
                        <div className={styles.plRow}>
                            <h5 className="ps-5 pt-3 text-start">
                                <u>Details</u>
                            </h5>

                            <div className="py-3 px-5 text-start">
                                <div>
                                    <div className="d-flex">
                                        <div className="col-sm-2">
                                            <h6>Date:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{RequestDate}</p>
                                        </div>
                                        <div className="col-sm-2">
                                            <h6>Supplier:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{Supplier}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="col-sm-2">
                                            <h6>Name:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{transaction.name}</p>
                                        </div>
                                        <div className="col-sm-2">
                                            <h6>Branch:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{Branch}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="col-sm-2">
                                            <h6>Payment Mode:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{PaymentMode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default function Transactions() {

    const [Token, setToken] = useState();

    // Transaction Report Pop Up
    const [ReportPopUp, setReportPopUp] = useState(false);

    // Generate Transaction Report
    const [CustomForm, setCustomForm] = useState(false);
    const [StartDate, setStartDate] = useState();
    const [EndDate, setEndDate] = useState();
    const [ExcelFile, setExcelFile] = useState(true);
    const [CSVFile, setCSVFile] = useState(false);

    const [TransactionsList, setTransactionsList] = useState([<div>Loading...</div>]);

    useEffect(() => {
        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        axios.get(`${baseUrl}/api/auditTrail/Transactions`,
            {
                headers: {
                    authorization: 'Bearer ' + token
                }
            }
        )
            .then((response) => {
                console.log(response.data);
                const transactionsResults = response.data;
                const resultList = [];

                transactionsResults.forEach((item, index) => {
                    resultList.push(
                        <div key={index}>
                            <TransactionRow
                                TransactionData={item}
                            />
                        </div>
                    );
                })

                setTransactionsList(resultList);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);

    // check if date inputs are filled
    useEffect(() => {
        if (StartDate && EndDate) {
            setCustomForm(true);
        } else {
            setCustomForm(false);
        };
    }, [StartDate, EndDate]);

    const handleReportForm = () => {
        setReportPopUp(true);
    };

    const handleReportPopUpClose = () => {
        setReportPopUp(false);
    };

    const handlFileType = async (e) => {
        if (e.target.value === 'Excel') {
            setExcelFile(true);
            setCSVFile(false);
        } else {
            setExcelFile(false);
            setCSVFile(true);
        };
    };

    return (
        <div>
            <div className="px-5">
                <h1>Transactions</h1>
            </div>

            <div className="px-5 pt-3">
                <button onClick={handleReportForm} className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
                    <div className="px-2">Get Report</div>
                </button>
            </div>

            <div>
                <div className="pt-1">
                    <hr />
                </div>
                <ul className="list-group list-group-horizontal">
                    <li className="list-group-item col-sm-2 border-0">PO No.</li>
                    <li className="list-group-item col-sm-2 border-0">Type</li>
                    <li className="list-group-item col-sm-2 border-0">Purchase Status</li>
                    <li className="list-group-item col-sm-2 border-0">Payment Status</li>
                    <li className="list-group-item col-sm-2 border-0">Total Price</li>
                    <li className="list-group-item col-sm-2 border-0">Details</li>
                </ul>
                <hr />
            </div>

            <div className="overflow-scroll w-100 h-75 position-absolute">
                {TransactionsList}
            </div>

            {
                ReportPopUp &&
                <div className={styles.newStatusBox}>
                    <div className={styles.newStatus}>
                        <div className="row pt-1">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <h2 className={styles.newStatusText}>Custom Report</h2>
                            </div>

                            <div className="col-sm-1">
                                <button onClick={handleReportPopUpClose} className="btn">
                                    <Image src={xIcon} width={35} height={35} alt="Cancel" />
                                </button>
                            </div>
                        </div>
                        <form className="ps-4 py-3">
                            <div className="py-3">
                                <label className="pe-2">Start Date:</label>
                                <input type="date" onChange={e => setStartDate(e.target.value)} className="px-1 rounded border-1" required />
                            </div>

                            <div className="py-3">
                                <label className="pe-2">End Date:</label>
                                <input type="date" onChange={e => setEndDate(e.target.value)} className="px-1 rounded border-1" required />
                            </div>

                            <div className="py-3">
                                <label className="pe-2">File Type:</label>
                                <select onChange={handlFileType} className="px-5 rounded" required >
                                    <option selected="selected">Excel</option>
                                    <option>CSV</option>
                                </select>
                            </div>

                            <div className="pb-2 pt-4">
                                {
                                    CustomForm ? (
                                        <>
                                            {
                                                ExcelFile && (
                                                    <a href={baseUrl + `/api/xlsx/excel/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
                                                        <button type="button" className="btn btn-dark">
                                                            Generate Report
                                                        </button>
                                                    </a>
                                                )}
                                            {
                                                CSVFile &&
                                                <a href={baseUrl + `/api/xlsx/csv/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
                                                    <button type="button" className="btn btn-dark">
                                                        Generate Report
                                                    </button>
                                                </a>
                                            }
                                        </>
                                    ) : (
                                        <button type="submit" className="btn btn-dark">
                                            Generate Report
                                        </button>
                                    )
                                }
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
};