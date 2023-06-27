import React from 'react';
import axios from 'axios';

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
    }

    return URL;
  }
}

isLocalhost();

const baseUrl = URL[0];
const baseURL = URL[1];

console.log(baseUrl);
console.log(baseURL);

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

  const poID = props.poID;

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
      <div className={styles.box}>
        <a href={baseURL + '/TrackOrder/' + props.poID}>
          <button className={styles.orderBtn}>
            <div className={styles.orderRow}>
              <div className={styles.orderTextRow}>
                <div>
                  <p className={styles.orderTextNo} >{props.poID}</p>
                </div>
                <div>
                  <p className={styles.orderTextNo2} >{props.prID}</p>
                </div>
                <div>
                  <p className={styles.orderTextDate} >{props.date}</p>
                </div>
                <div>
                  <p className={styles.orderTextName} >{props.Name}</p>
                </div>
                <div>
                  <p className={styles.orderTextSupplier} >{props.Supplier}</p>
                </div>
              </div>
            </div>
          </button>
        </a>
        {/* <div className={styles.container2}>
        <select name="status" className={styles.dropdownStatus}>
          <option value="acceptO">Accept Order</option>
          <option value="preparingO">Preparing Order</option>
          <option value="preparingD">Preparing Delivery</option>
          <option value="shipping">Shipping Item</option>
          <option value="delivered">Item Delivered</option>
        </select>
      </div> */}
        {/* <div className={styles.container2}>
          <select className={styles.dropdownStatus} value={selectedStatus} onChange={handleStatusChange}>
            {status.map((status, index) => (
              <option key={index} value={status.purchaseStatus}>{status.purchaseStatus}</option>
            ))}
            <option value="+ Create New Status"> + Create New Status</option>
          </select>
        </div> */}

        <div className={styles.container2}>
          <select className={styles.dropdownStatus} value={selectedStatus} onChange={handleStatusChange}>
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

      {newStatusPop && (
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <h2 className={styles.newStatusText}> Create New Status </h2>
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
            <h5 className={styles.changedStatusText}> Status has been changed successfully </h5>

          </div>
        </div>
      )}
    </div>

  )
};

export default function TrackOrder() {

  const [TrackOrderResults, orderList] = useState([(<div>Loading...</div>)]);

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
          trackOrderList.push(
            <div key={index}>
              <OrderRow
                poID={item.poID}
                prID={item.prID}
                date={item.requestDate}
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
        }
      })
  }, []);

  return (
    <>
      <div className={styles.headerRow}>
        <h1 className={styles.header}>Order Tracking</h1>
        <div>
          <div className={styles.searchContainer}>
            <form>
              <input type="text" placeholder="Search.." name="search" className={styles.searchBox} />
              <button type="submit" className={styles.searchButton}><Image src={searchIcon} /></button>
              <button type="submit" className={styles.searchButton}><Image src={filterIcon} width={20} /></button>
            </form>
          </div>
        </div>
      </div>

      <div>
        <hr />
        <ul className={styles.tableLabel}>
          <li className={styles.tableNo}>PO No.</li>
          <li className={styles.tableNo2}>PR No.</li>
          <li className={styles.tableCreated}>Created</li>
          <li className={styles.tableName}>Name</li>
          <li className={styles.tableSupplier}>Supplier</li>
          <li className={styles.tableStatus}>Status</li>
        </ul>
        <hr />
      </div>

      <div className={styles.prData}>
        {TrackOrderResults}
      </div>

    </>
  )
}