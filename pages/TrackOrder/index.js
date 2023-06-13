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

  return (
    <div>
      <a href={baseURL + '/TrackOrder/' + props.prID}>
        <button className={styles.orderBtn}>
          <div className={styles.orderRow}>
            <div className={styles.orderTextRow}>
              <div>
                <p className={styles.orderTextNo}>{props.prID}</p>
              </div>
              <div>
                <p className={styles.orderTextName}>{props.Name}</p>
              </div>
              <div>
                <p className={styles.orderTextSupplier}>{props.Supplier}</p>
              </div>
            </div>
          </div>
        </button>
      </a>
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
        // console.log(response1);

        const orderResult = response1.data;

        const trackOrderList = [];

        orderResult.forEach((item, index) => {
          trackOrderList.push(
            <div key={index}>
              <OrderRow
                prID={item.prID}
                Name={item.name}
                Supplier={item.supplierName} />
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
          <li className={styles.tableNo}>No.</li>
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