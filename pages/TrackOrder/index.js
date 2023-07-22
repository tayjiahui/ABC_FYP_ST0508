import React from 'react';
import axios from 'axios';
import moment from 'moment';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Style Sheet
import styles from '../../styles/trackOrder.module.css';

// Images
import searchIcon from '../../public/searchIcon.svg';
import filterIcon from '../../public/filterIcon.svg';
import eyeCon from "../../public/eyeCon.svg";
import closeEyeCon from "../../public/closeEyeCon.svg";

import WIP from '../../components/WIP'

// Base urls
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
    };

    return URL;
  };
};

isLocalhost();

const baseUrl = URL[0];
const baseURL = URL[1];

// each PO row
function OrderRow(props) {

  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [newStatusPop, setNewStatusPop] = useState(false);
  const [statusInput, setStatusInput] = useState([]);

  const [changedStatusPop, setChangedStatusPop] = useState(false);

  const handleCloseStatusPop = () => {
    setNewStatusPop(false);
    setChangedStatusPop(false);
  }

  const handleInputChange = (event) => {
    setStatusInput(event.target.value);
  }

  const handleSubmit = (event) => {

    console.log("submitting status");
    // event.preventDefault();
    alert(`Sucessfully created new status: ${statusInput}`);

    axios.post(`${baseUrl}/api/trackOrder/purchaseStatus`, {
      purchaseStatus: statusInput
    })
      .then(res => {
        alert(`sucessfully created new status ${statusInput}`)
        setNewStat(false)
        console.log(res.data);
        setStatus((prevStatus) => [...prevStatus, res.data]);
        onSubmit(statusInput)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // console.log(statusInput)

  useEffect(() => {
    axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`)
      .then(res => {
        // console.log(res.data)
        setStatus(res.data);
        setSelectedStatus(res.data[0]); //initial selected status
      })
      .catch(err => console.log(err));
  }, []);

  // PO ID FROM DATABASE
  const poID = props.poID;

  // PR ID FROM DATABASE BUT AS PO ID FOR FRONTEND
  const poId = props.prID;

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    const selectedValue = event.target.value;
    console.log(event.target)
    console.log("value", selectedValue)

    if (selectedValue === "+ Create New Status") {
      setNewStatusPop(true);
    }
    // else if (selectedValue === "Preparing Order") {
    //   setChangedStatusPop(true);
    // }
    else {
      console.log('other options')
      axios.put(`${baseUrl}/api/trackOrder/purchaseOrderStatus/${poID}`, {
        purchaseStatusID: selectedValue,
      })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
      setChangedStatusPop(true);

    }
  };

  return (
    <div>
      <div className="row w-4 h-4 py-4 rounded-4 mb-3 m-2" style={{ backgroundColor: '#C0D8F7' }}>
        <div className="row d-flex">
          <a href={baseURL + '/TrackOrder/' + poId} className="col text-decoration-none text-black ps-3">
            {/* <button className="border-0" style={{ backgroundColor: 'transparent' }}> */}
            <div className=" col d-flex">
              <div className="col-sm-2 ms-5">
                <p>#{poId}</p>
              </div>
              <div className="col-sm-3 ms-5">
                <p>{props.date}</p>
              </div>
              <div className="col-sm-2 ms-1">
                <p>{props.Name}</p>
              </div>
              <div className="col-sm-5 ms-5">
                <p>{props.Supplier}</p>
              </div>
            </div>
          </a>

          <div className="col-sm-2 me-5">
            <select className="rounded text-center w-76 h-100" value={selectedStatus} onChange={handleStatusChange}>
              <option key={1} value={props.PurchaseStatusID} selected="selected">{props.PurchaseStatus}</option>
              {
                status.map((status, index) => {
                  if (status.purchaseStatusID !== props.PurchaseStatusID) {
                    return <option key={index + 2} value={status.purchaseStatusID}>{status.purchaseStatus}</option>
                  }
                })
              }
              <option key={status.length + 2}> + Create New Status</option>
            </select>
          </div>
        </div>

      </div>


      {newStatusPop && (
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <h2 className="mb-4"> Create New Status </h2>
            <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="statusInput">Enter status name : </label> <br />
              <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
              <button type="submit" className={styles.createStatusBtn}> Create Status</button>
            </form>

          </div>
        </div>
      )}

      {changedStatusPop && (
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
            <h5 className='mt-5'> Status has been changed successfully </h5>

          </div>
        </div>
      )}
    </div>

  )
};

// Each Ad Hoc Row
function AdHocRow(props) {
  const statusID = props.StatusID;
  const status = props.Status;

  const [showDescript, setShowDescript] = useState(false);

  const [adhocStatus, setAdHocStatus] = useState();

  function circleTest(statusID) {
    if (statusID == 1) {
      return "/yellowPendingCircle.svg";
    } else if (statusID == 2) {
      return "/greenApprovedCircle.svg";
    } else if (statusID == 3) {
      return "/redRejectedCircle.svg";
    } else {
      return "/yellowPendingCircle.svg";
    };
  };

  const circle = circleTest(statusID);

  const viewDescription = async (e) => {
    e.preventDefault();
    setShowDescript(true);
  };

  const closeViewDescription = async (e) => {
    e.preventDefault();
    setShowDescript(false);
  };

  return (
    <div>
      <div className="py-1">
        <a href={baseURL + "/TrackOrder/AdHoc/" + props.prID}>
          <button className={styles.prButton}>
            <div className={styles.prRow}>
              <div className="pt-2 row text-start">
                <div className={styles.prTextRow}>
                  <div className="col-sm px-3">
                    {showDescript === false && (
                      <button
                        onClick={viewDescription}
                        type="button"
                        className={styles.viewIconButton}
                      >
                        <p>#{props.prID}</p>
                      </button>
                    )}
                    {showDescript === true && (
                      <button
                        onClick={closeViewDescription}
                        type="button"
                        className={styles.viewIconButton}
                      >
                        <p>#{props.prID}</p>
                      </button>
                    )}
                  </div>

                  <div className="col-sm">
                    <p>{props.ReqDate}</p>
                  </div>

                  <div className="col-sm">
                    <p>{props.Name}</p>
                  </div>

                  {/* <div className="col-sm">
                    <p>{props.TargetDate}</p>
                  </div> */}

                  <div className="col-sm">
                    <div className="row">
                      <div className="col-sm-1">
                        <p className={styles.prTextStatus}>{status}</p>
                      </div>
                      <div className="ps-5 ms-4 col-sm-2">
                        <Icon item={circle} />
                      </div>
                    </div>
                  </div>

                  <div className="col-sm">
                    {showDescript === false && (
                      <button
                        onClick={viewDescription}
                        type="button"
                        className={styles.viewIconButton}
                      >
                        <Image
                          src={eyeCon}
                          width={30}
                          height={30}
                          alt="Eye Icon"
                        />
                      </button>
                    )}
                    {showDescript === true && (
                      <button
                        onClick={closeViewDescription}
                        type="button"
                        className={styles.viewIconButton}
                      >
                        <Image
                          src={closeEyeCon}
                          width={30}
                          height={30}
                          alt="Eye Icon"
                        />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {showDescript && (
                <div className={styles.plRow}>
                  <h5 className="ps-5 pt-3 text-start">
                    <u>Description</u>
                  </h5>

                  <div className="py-2 ps-5 text-start">
                    <p>{props.Description}</p>
                  </div>
                </div>
              )}
            </div>
          </button>
        </a>
      </div>
    </div>
  );
};

// Status icon for each PR row
function Icon(props) {
  return (
    <Image
      src={baseURL + props.item}
      width={25}
      height={25}
      id={styles.statusCircle}
      alt="status indicator"
    />
  );
};

export default function TrackOrder() {

  const [TrackOrderResults, orderList] = useState([(<div>Loading...</div>)]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // adhoc view
  const [showAdHoc, setShowAdHoc] = useState(false);
  const [AdHocResults, setAdHocResults] = useState([<div>Loading...</div>]);

  // wip modal
  const [showInProg, setInProg] = useState(false);

  // show all Track Order
  useEffect(() => {
    axios.all([
      axios.get(`${baseUrl}/api/trackOrder`, {})
    ])
      .then(axios.spread((response1) => {
        // console.log(response1.data);

        // get track order results
        const orderResult = response1.data;
        const trackOrderList = [];

        console.log(orderResult);
        console.log(orderResult[0].purchaseStatus)

        orderResult.forEach((item, index) => {
          // Time stamp formatting
          const reqDate = moment(orderResult[index].requestDate).format('DD/MM/YYYY');

          trackOrderList.push(
            <div key={index}>
              <OrderRow
                poID={item.poID}
                prID={item.prID}
                date={reqDate}
                Name={item.name}
                Supplier={item.supplierName}
                PurchaseStatus={item.purchaseStatus}
                PurchaseStatusID={item.purchaseStatusID}
              />
            </div>
          )
        });

        orderList(trackOrderList);

      }))
      .catch((err) => {
        console.log(err);
        if (err.response === 404) {
          alert(err.response.data);
        }
        else {
          alert(err.code);
        };
      });
  }, []);

  // show all adhoc purchases
  useEffect(() => {
    axios.get(`${baseUrl}/api/purchaseReq/adhoc/purchases`, {
      headers: {
        // 'user': userID
        // 'authorization': 'Bearer ' + token
      }
    })
      .then((response) => {
        // console.log(response);
        // console.log(response.data);

        const adHocResult = response.data;

        // Show List of Ad-hoc Purchases
        const adHocList = [];

        adHocResult.forEach((item, index) => {
          // Time stamp formatting
          const reqDate = moment(adHocResult[index].requestDate).format(
            "D MMM YYYY"
          );
          const targetDeliveryDate = moment(
            adHocResult[index].targetDeliveryDate
          ).format("D MMM YYYY");

          adHocList.push(
            <div key={index}>
              <AdHocRow
                prID={item.prID}
                ReqDate={reqDate}
                Name={item.name}
                TargetDate={targetDeliveryDate}
                Status={item.prStatus}
                StatusID={item.prStatusID}
                Description={item.remarks}
              />
            </div>
          );
        });

        setAdHocResults(adHocList);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    await axios.post(`${baseUrl}/api/trackOrder/POsearch`,
      {
        "searchValue": searchValue
      }
    )
      .then((response) => {
        console.log(response.data)
        setSearchResults(response.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "ERR_NETWORK") {
          alert(err.message);
        }
        else if (err.response.status === 404) {
          setlist1(<div className="p-5">No Results Found!</div>)
        }
        else {
          alert(err.response.data);
        };
      });
  };

  // adhoc toggle
  const adHocView = async (e) => {
    setShowAdHoc(e.target.checked);
  };

  // wip modal
  function timeFunc() {
    // 2 seconds
    setTimeout(closeWIPModal, 2000);
  };

  const handleOpenWip = () => {
    setInProg(true);
    timeFunc();
  };

  // close WIP Modal
  function closeWIPModal() {
    setInProg(false);
  };

  return (
    <>
      <h1 className="w-75">Order Tracking</h1>

      <div className="pb-5">
        <div className={styles.rightFloater}>
          <div className="px-3 pb-4">
            <div className={styles.toggle}>
              <div className="px-3 pt-1">
                <h5>Ad-Hoc</h5>
              </div>

              <label className={styles.switch}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    adHocView(e);
                  }}
                  checked={showAdHoc}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>

          <div className={styles.searchContainer}>
            {/* <form onSubmit={handleSearch}> */}
            <form>
              <input type="text" placeholder="  Search.." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} name="search" className={styles.searchBox} />
              <button onClick={handleOpenWip} type="submit" className={styles.searchButton}><Image src={searchIcon} width={25} alt='Search' /></button>
              <button onClick={handleOpenWip} type="button" className={styles.searchButton}><Image src={filterIcon} width={25} alt='Filter' /></button>
            </form>
            <ul>
              {searchResults.map((result) => (
                <li key={result.id}>{result.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <hr />
        {
          showAdHoc === false &&
          <ul className="col-sm-9 list-group list-group-horizontal text-center">
            {/* <li className="list-group-item col-sm-1 border-0">PO No.</li> */}
            <li className="list-group-item col-sm-2 border-0 ms-1">PO No.</li>
            <li className="list-group-item col-sm-3 border-0 ms-2">Created</li>
            <li className="list-group-item col-sm-3 border-0">Name</li>
            <li className="list-group-item col-sm-2 border-0 ms-3">Supplier</li>
            <li className="list-group-item col-sm-5 border-0 ms-5">Status</li>
          </ul>
        }

        {
          showAdHoc === true &&
          <ul className="list-group list-group-horizontal px-3">
            <li className="list-group-item col-sm border-0">PR No.</li>
            <li className="list-group-item col-sm border-0">Date</li>
            <li className="list-group-item col-sm border-0">Name</li>
            {/* <li className="list-group-item col-sm border-0">Target Date</li> */}
            <li className="list-group-item col-sm border-0">Status</li>
            <li className="list-group-item col-sm border-0"></li>
          </ul>
        }

        <hr />
      </div>

      <div className="col-sm-12">
        {
          showAdHoc === false &&
          <div>{TrackOrderResults}</div>
        }

        {
          showAdHoc === true &&
          <div>{AdHocResults}</div>
        }

      </div>

      {showInProg && <WIP Show={showInProg} />}

    </>
  )
};