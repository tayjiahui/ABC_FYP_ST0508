import React from "react";
import axios from "axios";
import Image from "next/image";
import moment from 'moment-timezone';

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// Style Sheet
import styles from "../../styles/auditLog.module.css";

// components
import AlertBox from "../../components/alert";

// Images 
import xIcon from "../../public/xIcon.svg";
import DownloadIcon from "../../public/downloadWhite.svg";

const timezone = 'Asia/Singapore';

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

function getDates(PresetTime) {
  const startDate = moment.tz(timezone).startOf(PresetTime).format(`YYYY-MM-DD HH:mm:ss`);
  const endDate = moment.tz(timezone).endOf(PresetTime).format(`YYYY-MM-DD HH:mm:ss`);

  return { Start: startDate, End: endDate };
};

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
  const [Form, setForm] = useState(false);
  const [CustomForm, setCustomForm] = useState(false);
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const [PresetStartDate, setPresetStartDate] = useState();
  const [PresetEndDate, setPresetEndDate] = useState();
  const [ExcelFile, setExcelFile] = useState(true);
  const [CSVFile, setCSVFile] = useState(false);

  // Preset Dates
  const [ThisWeek, setWeek] = useState();
  const [ThisMonth, setMonth] = useState();
  const [ThisYear, setYear] = useState();

  const [TransactionsList, setTransactionsList] = useState([<div>Loading...</div>]);

  // Alert Box
  const [TRDownloadAlert, setTRDownloadAlert] = useState(false);

  useEffect(() => {
    // set user token
    const token = localStorage.getItem("token");
    setToken(token);

    const Week = getDates('Week');

    setWeek(getDates('Week'));
    setMonth(getDates('Month'));
    setYear(getDates('Year'));

    setPresetStartDate(Week.Start);
    setPresetEndDate(Week.End);

    axios.get(`${baseUrl}/api/auditTrail/Transactions`,
      {
        headers: {
          authorization: 'Bearer ' + token
        }
      }
    )
      .then((response) => {
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
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.clear();
          signOut({ callbackUrl: '/Unauthorised' });
        }
        else {
          console.log(err);
        };
      });

  }, []);

  // check if date inputs are filled
  useEffect(() => {
    if (StartDate && EndDate) {
      setForm(true);
    } else {
      setForm(false);
    };
  }, [StartDate, EndDate]);

  const handleReportForm = () => {
    setReportPopUp(true);
  };

  const handleReportPopUpClose = () => {
    setReportPopUp(false);
  };

  const handleCustom = () => {
    if (CustomForm === false) {
      setCustomForm(true);
    } else {
      setCustomForm(false);
    };
  };

  const handlePresetDates = async (e) => {
    const selected = e.target.value;

    if (selected === 'This Week') {
      setPresetStartDate(ThisWeek.Start);
      setPresetEndDate(ThisWeek.End);
    } else if (selected === 'This Month') {
      setPresetStartDate(ThisMonth.Start);
      setPresetEndDate(ThisMonth.End);
    } else if (selected === 'This Year') {
      setPresetStartDate(ThisYear.Start);
      setPresetEndDate(ThisYear.End);
    };
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

  const handleTRDownloadAlert = () => {
    const TRDownloadAlert = () => {
      setTRDownloadAlert(true);
      alertTimer();
    };

    setTimeout(TRDownloadAlert, 1000);
  };

  // alert box timer
  function alertTimer() {
    // changes all alert useStates to false after 3s
    setTimeout(alertFunc, 3000);
  };

  function alertFunc() {
    // list of alerts useStates in your page
    setTRDownloadAlert(false);
  };

  return (
    <div>
      <div className="px-2">
        <h1>Transactions</h1>
      </div>

      <div className="d-flex">
        <div className="ps-2 pt-3">
          <button onClick={handleReportForm} className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
            <div className="px-2">Get Report</div>
          </button>
        </div>
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
                <button onClick={handleReportPopUpClose} className="btn px-2">
                  <Image src={xIcon} width={35} height={35} alt="Cancel" />
                </button>
              </div>
            </div>
            <form className="ps-4 py-3">
              {
                CustomForm ? (
                  <>
                    <div className="pt-3">
                      <label className="pe-2">Start Date:</label>
                      <input type="date" onChange={e => setStartDate(e.target.value)} className="px-1 rounded border-1" required />
                    </div>

                    <div className="pt-3">
                      <label className="pe-2">End Date:</label>
                      <input type="date" onChange={e => setEndDate(e.target.value)} className="px-1 rounded border-1" required />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pt-3">
                      <label className="pe-2">Date Range:</label>
                      <select className="px-4 rounded" onChange={handlePresetDates} required>
                        <option selected>This Week</option>
                        <option>This Month</option>
                        <option>This Year</option>
                      </select>
                    </div>
                  </>
                )
              }

              <div className="py-3">
                <label className="pe-2">File Type:</label>
                <select onChange={handlFileType} className="px-5 rounded" required>
                  <option selected>Excel</option>
                  <option>CSV</option>
                </select>

                <div className="pt-3 px-5 mx-2">
                  {
                    CustomForm ? (
                      <a className={styles.seeMoreLink}>
                        <button type="button" onClick={handleCustom} className="btn px-0">
                          <u>Back to Preset</u>
                        </button>
                      </a>
                    ) : (
                      <a className={styles.seeMoreLink}>
                        <button type="button" onClick={handleCustom} className="btn px-0">
                          <u>Custom Dates</u>
                        </button>
                      </a>
                    )
                  }
                </div>
              </div>

              <div className="pb-2 pt-1">
                {
                  CustomForm ? (
                    <>
                      {
                        Form ? (
                          <>
                            <>
                              {
                                ExcelFile && (
                                  <a href={baseUrl + `/api/xlsx/excel/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
                                    <button type="button" onClick={handleTRDownloadAlert} className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
                                      <div className="d-flex px-3 py-1">
                                        <div className="pe-2">Generate Report</div>
                                        <Image src={DownloadIcon} width={25} height={25} alt="download icon" />
                                      </div>
                                    </button>
                                  </a>
                                )}
                              {
                                CSVFile &&
                                <a href={baseUrl + `/api/xlsx/csv/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
                                  <button type="button" onClick={handleTRDownloadAlert} className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
                                    <div className="d-flex px-3 py-1">
                                      <div className="pe-2">Generate Report</div>
                                      <Image src={DownloadIcon} width={25} height={25} alt="download icon" />
                                    </div>
                                  </button>
                                </a>
                              }
                            </>
                          </>
                        ) : (
                          <button type="submit" className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
                            <div className="d-flex px-3 py-1">
                              <div className="pe-2">Generate Report</div>
                              <Image src={DownloadIcon} width={25} height={25} alt="download icon" />
                            </div>
                          </button>
                        )
                      }
                    </>
                  ) : (
                    <>
                      {
                        ExcelFile && (
                          <a href={baseUrl + `/api/xlsx/excel/Date?startDate=` + PresetStartDate + `&endDate=` + PresetEndDate}>
                            <button type="button" onClick={handleTRDownloadAlert} className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
                              <div className="d-flex px-3 py-1">
                                <div className="pe-2">Generate Report</div>
                                <Image src={DownloadIcon} width={25} height={25} alt="download icon" />
                              </div>
                            </button>
                          </a>
                        )}
                      {
                        CSVFile &&
                        <a href={baseUrl + `/api/xlsx/csv/Date?startDate=` + PresetStartDate + `&endDate=` + PresetEndDate}>
                          <button type="button" onClick={handleTRDownloadAlert} className="btn btn-secondary" style={{ backgroundColor: '#486284' }}>
                            <div className="d-flex px-3 py-1">
                              <div className="pe-2">Generate Report</div>
                              <Image src={DownloadIcon} width={25} height={25} alt="download icon" />
                            </div>
                          </button>
                        </a>
                      }
                    </>
                  )
                }
              </div>
            </form>
          </div>
        </div>
      }

      {
        TRDownloadAlert &&
        <AlertBox
          Show={TRDownloadAlert}
          Message={`Report Downloaded!`}
          Type={'success'}
          Redirect={``} />
      }
    </div>
  );
};