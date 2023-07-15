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

console.log(baseUrl);
console.log(baseURL);

export default function TrackOrder() {

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

    console.log(statusInput)

    useEffect(() => {
      axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`)
        .then(res => {
          console.log(res.data)
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
                {/* <div className="row ms-4">
                  <p>{props.poID}</p>
                </div> */}
                <div className="col-sm-2 ms-5">
                  <p>#{props.poID}</p>
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
              {/* </button> */}
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

  const [TrackOrderResults, orderList] = useState([(<div>Loading...</div>)]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
  }

  return (
    <>
      <div className="d-flex">
        <h1 className="w-75">Order Tracking</h1>
        <div>
          <div className={styles.searchContainer}>
            <form onSubmit={handleSearch}>
              <input type="text" placeholder="  Search.." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} name="search" className={styles.searchBox} />
              <button type="submit" className={styles.searchButton}><Image src={searchIcon} width={25} alt='Search' /></button>
              <button type="button" className={styles.searchButton}><Image src={filterIcon} width={25} alt='Filter' /></button>
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
        <ul className="col-sm-9 list-group list-group-horizontal text-center">
          {/* <li className="list-group-item col-sm-1 border-0">PO No.</li> */}
          <li className="list-group-item col-sm-2 border-0 ms-1">PO No.</li>
          <li className="list-group-item col-sm-3 border-0 ms-2">Created</li>
          <li className="list-group-item col-sm-3 border-0">Name</li>
          <li className="list-group-item col-sm-2 border-0 ms-3">Supplier</li>
          <li className="list-group-item col-sm-5 border-0 ms-5">Status</li>
        </ul>
        <hr />
      </div>

      <div className="col-sm-12">
        {TrackOrderResults}
      </div>

    </>
  )
};