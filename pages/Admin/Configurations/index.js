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
import arrowIcon from "../../../public/arrowIcon.svg";

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

function GSTPageView() {

  const [Token, setToken] = useState();
  const [CurrentGST, setCurrentGST] = useState();
  const [NewGST, setNewGST] = useState();
  const [GSTList, setGSTList] = useState();
  const [showAllGST, setShowAllGST] = useState(false);
  const [showGSTChangeConfirm, setShowGSTChangeConfirm] = useState(false);

  // Alert Box
  const [GSTUpdateAlert, setGSTUpdateAlert] = useState(false);

  useEffect(() => {
    // set user token
    const token = localStorage.getItem("token");
    setToken(token);

    axios.all([
      axios.get(`${baseUrl}/api/purchaseReq/gst/latest/details`,
        {
          headers: {
            authorization: 'Bearer ' + token
          }
        }
      ),
      axios.get(`${baseUrl}/api/purchaseReq/gst/all/details`,
        {
          headers: {
            authorization: 'Bearer ' + token
          }
        }
      )
    ])
      .then(axios.spread((response1, response2) => {
        setCurrentGST(response1.data[0].gst);
        setGSTList(response2.data);
      }))
      .catch((err) => {
        console.log(err);
      });
  }, [GSTUpdateAlert]);

  const ViewAllGST = async () => {
    console.log("hekem")
    if (showAllGST === false) {
      setShowAllGST(true);
    } else {
      setShowAllGST(false);
    };
  };

  const AreYouSureGST = async () => {
    if (showGSTChangeConfirm === false) {
      setShowGSTChangeConfirm(true);
    } else {
      setShowGSTChangeConfirm(false);
    };
  };

  const handleGSTInput = async (e) => {
    const inputValue = e.target.value;
    setNewGST(inputValue.replace(/[^0-9.]/g, ''));
  };

  const UpdateGST = async (e) => {
    e.preventDefault();

    const dateYesterday = moment().tz(timezone).subtract(1, 'day').format();

    axios.put(`${baseUrl}/api/purchaseReq/gst/EndDate`,
      {
        endDate: dateYesterday
      },
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      }
    )
      .then(async (response) => {
        await axios.post(`${baseUrl}/api/purchaseReq/gst`,
          {
            GST: NewGST
          },
          {
            headers: {
              authorization: 'Bearer ' + Token
            }
          }
        )
          .then((response) => {
            setGSTUpdateAlert(true);
            alertTimer();

            // close pop up
            setShowGSTChangeConfirm(false);
            // reset value
            setNewGST();
          })
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // alert box timer
  function alertTimer() {
    // changes all alert useStates to false after 3s
    setTimeout(alertFunc, 3000);
  };

  function alertFunc() {
    // list of alerts useStates in your page
    setGSTUpdateAlert(false);
  };

  return (
    <>
      <div className="p-4">
        <h2>GST%</h2>
      </div>

      <div className="px-4">
        <div className="d-flex">
          <div className="d-flex pt-2">
            <label><b>Current GST(%):</b></label>
            <p className="ps-3">{CurrentGST}%</p>
          </div>

          <div className="px-5">
            <button onClick={AreYouSureGST} className="btn btn-secondary rounded" style={{ backgroundColor: '#486284' }}>
              Update GST
            </button>
          </div>
        </div>

        <div className=" py-2 d-inline-flex">
          <div className="pe-3">
            <h5>GST History</h5>
          </div>

          <button onClick={ViewAllGST} type="button" className="btn pt-0 px-0">
            <Image src={arrowIcon} width={30} height={30} className={styles.downArrow} />
          </button>
        </div>

        <div>
          {
            showAllGST &&
            <>
              <div>
                <hr />
                <ul className="list-group list-group-horizontal">
                  <li className="list-group-item col-sm-2 border-0">GST%</li>
                  <li className="list-group-item col-sm-2 border-0">Start Date</li>
                  <li className="list-group-item col-sm-1 border-0"></li>
                  <li className="list-group-item col-sm-2 border-0">End Date</li>
                </ul>
                <hr />
              </div>

              <div>
                {
                  GSTList.map((item, index) => {
                    return <ul key={index} className="list-group list-group-horizontal" style={{ listStyleType: 'none', padding: 0 }}>
                      <li className="list-group-item col-sm-2 border-0 ps-4">
                        <span>{item.gst}%</span>
                      </li>
                      <li className="list-group-item col-sm-2 border-0">
                        <span>{moment(item.startDate).format(`D MMM YYYY`)}</span>
                      </li>
                      <li className="list-group-item col-sm-1 border-0">to</li>
                      <li className="list-group-item col-sm-2 border-0">
                        <span>
                          {item.endDate ? (
                            <div>{moment(item.endDate).format(`D MMM YYYY`)}</div>
                          ) : (
                            <div>Present</div>
                          )}
                        </span>
                      </li>
                    </ul>
                  })
                }
              </div>
            </>
          }
        </div>

        {
          showGSTChangeConfirm &&
          <div className={styles.newStatusBox}>
            <div className={styles.newStatus}>
              <div className="row pt-1">
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                  <h2 className={styles.newStatusText}>Update GST</h2>
                </div>

                <div className="col-sm-1">
                  <button onClick={AreYouSureGST} className="btn px-2">
                    <Image src={xIcon} width={35} height={35} alt="Cancel" />
                  </button>
                </div>
              </div>
              <form className="ps-4 py-3" onSubmit={UpdateGST}>
                <div className="pt-3">
                  <label className="pe-2">Current GST:</label>
                  <input type="text" value={CurrentGST + `%`} className="rounded border-1 py-0 text-center" disabled />
                </div>
                <div className="pt-3">
                  <label className="pe-2">New GST:</label>
                  <input type="text" value={NewGST} onChange={(e) => handleGSTInput(e)} className="rounded border-1 py-0 text-center" required />%
                </div>

                <div className="p-5">
                  <button type="submit" className="btn btn-secondary rounded" style={{ backgroundColor: '#486284' }}>
                    Update GST
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </div>

      {
        GSTUpdateAlert &&
        <AlertBox
          Show={GSTUpdateAlert}
          Message={`GST Updated!`}
          Type={'success'}
          Redirect={``} />
      }
    </>
  )
};

function PaymentModePageView() {
  const [Token, setToken] = useState();

  const [NewPM, setNewPM] = useState();
  const [PaymentModes, setPaymentModes] = useState([]);
  const [PaymentModesID, setPaymentModesID] = useState([]);

  const [showCreatePM, setShowCreatePM] = useState(false);

  // Alert Box
  const [CreatePMAlert, setCreatePMAlert] = useState(false);
  const [DeletePMAlert, setDeletePMAlert] = useState(false);

  useEffect(() => {
    // set user token
    const token = localStorage.getItem("token");
    setToken(token);

    axios.get(`${baseUrl}/api/purchaseReq/paymentMode/all`)
      .then((response) => {
        setPaymentModes(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [CreatePMAlert, DeletePMAlert]);

  const handleCreatePMPop = async () => {
    if (showCreatePM === false) {
      setShowCreatePM(true);
    } else {
      setShowCreatePM(false);
    };
  };

  const CreatePaymentMode = async (e) => {
    e.preventDefault();
    console.log(NewPM);

    axios.post(`${baseUrl}/api/purchaseReq/paymentMode`,
      {
        paymentMode: NewPM
      },
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      }
    )
      .then((response) => {
        console.log(response.data);

        setCreatePMAlert(true);
        alertTimer();

        // close pop up
        setShowCreatePM(false);
        // reset value
        setNewPM();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePM = async (e) => {
    const pmID = e.target.id;

    axios.delete(`${baseUrl}/api/purchaseReq/paymentMode/${pmID}`,
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      }
    )
      .then((response) => {
        setDeletePMAlert(true);
        alertTimer();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // alert box timer
  function alertTimer() {
    // changes all alert useStates to false after 3s
    setTimeout(alertFunc, 3000);
  };

  function alertFunc() {
    // list of alerts useStates in your page
    setCreatePMAlert(false);
    setDeletePMAlert(false);
  };

  return (
    <>
      <div className="p-4">
        <h2>Payment Mode</h2>
      </div>

      <div className="px-4">
        <button onClick={handleCreatePMPop} className="btn btn-secondary rounded" style={{ backgroundColor: '#486284' }}>
          Add Payment Mode
        </button>

        <div className="d-flex pt-4">
          <label><b>Manage Payment Modes</b></label>
        </div>

        <div className="pb-3 mt-4">
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {PaymentModes.map((item, index) => (
              <li key={index} className="d-flex align-items-center">
                <span>{item.paymentMode}</span>
                {['Bank Transfer'].includes(item.paymentMode) ? null : (
                  <button className="btn btn-link btn-sm" onClick={deletePM} style={{ textDecoration: 'none', color: 'black', lineHeight: '1' }}>
                    <span aria-label="Delete" id={item.paymentModeID} style={{ fontSize: '20px', verticalAlign: 'middle' }}>&times;</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {
        showCreatePM &&
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <div className="row pt-1">
              <div className="col-sm-10 text-center pt-2">
                <h3 className={styles.newStatusText}>Create Payment Mode</h3>
              </div>

              <div className="col-sm-1">
                <button onClick={handleCreatePMPop} className="btn px-2">
                  <Image src={xIcon} width={35} height={35} alt="Cancel" />
                </button>
              </div>
            </div>
            <form className="ps-4 py-3" onSubmit={CreatePaymentMode}>
              <div className="pt-3">
                <label className="pe-2">New Payment Mode:</label> <br />
                <input type="text" onChange={(e) => setNewPM(e.target.value)} className="rounded border-1 py-0" required />
              </div>

              <div className="p-5">
                <button type="submit" className="btn btn-secondary rounded" style={{ backgroundColor: '#486284' }}>
                  Create Payment Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      {
        CreatePMAlert &&
        <AlertBox
          Show={CreatePMAlert}
          Message={`Payment Mode Created!`}
          Type={'success'}
          Redirect={``} />
      }

      {
        DeletePMAlert &&
        <AlertBox
          Show={DeletePMAlert}
          Message={`Payment Mode Deleted!`}
          Type={'success'}
          Redirect={``} />
      }
    </>
  )
};

function StatusPageView() {
  const [Token, setToken] = useState();

  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [paymentStatusID, setPaymentStatusID] = useState([]);

  const fetchPaymentStatuses = () => {
    axios.get(`${baseUrl}/api/paymentTrack/`,
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      })
      .then(response => {
        setPaymentStatuses(response.data);
      })
      .catch(error => {
        console.error("Error fetching payment statuses:", error);
      });
  };

  useEffect(() => {
    // set user token
    const token = localStorage.getItem("token");
    setToken(token);
    
    fetchPaymentStatuses();
  }, []);

  const handleDelete = (status) => {
    axios.get(`${baseUrl}/api/paymentTrack/status/${status}`,
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      })
      .then(response => {
        const statusID = response.data[0].PaymentStatusID
        setPaymentStatusID(statusID);

        axios.delete(`${baseUrl}/api/paymentTrack/${statusID}`,
          {
            headers: {
              authorization: 'Bearer ' + Token
            }
          })
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
  const [Token, setToken] = useState();

  const [purchaseStatuses, setPurchaseStatuses] = useState([]);
  const [purchaseStatusID, setPurchaseStatusID] = useState([]);

  const fetchPurchaseStatuses = () => {
    axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`,
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      }
    )
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
    // set user token
    const token = localStorage.getItem("token");
    setToken(token);

    fetchPurchaseStatuses();
  }, []);

  const handleDelete = (status) => {
    alert(`${status}`)
    axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/id/${status}`,
      {
        headers: {
          authorization: 'Bearer ' + Token
        }
      }
    )
      .then(response => {
        const statusID = response.data[0].purchaseStatusID
        setPurchaseStatusID(statusID);

        console.log(response);

        axios.delete(`${baseUrl}/api/trackOrder/purchaseStatus/${statusID}`,
          {
            headers: {
              authorization: 'Bearer ' + Token
            }
          }
        )
          .then(response => {
            console.log('status deleted!');
            fetchPurchaseStatuses();
          })
          .catch(err => {
            console.log('status could not be deleted', err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };


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
    };

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