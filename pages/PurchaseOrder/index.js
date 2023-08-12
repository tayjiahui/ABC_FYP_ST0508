import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link'
import styles from "../../styles/trackPayment.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment-timezone';
import Image from 'next/image';
import searchBtn from '../../public/searchIcon.svg';
import filterIcon from "../../public/filterIcon.svg";

//component
import WIP from "../../components/WIP";

// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // console.log('hostname   ' + hostname);
    if (hostname == "localhost") {
      URL.push("http://localhost:3000", "http://localhost:5000");
      console.log(URL);
    } else if (hostname == "abc-cooking-studio.azurewebsites.net") {
      URL.push(
        "https://abc-cooking-studio-backend.azurewebsites.net",
        "https://abc-cooking-studio.azurewebsites.net"
      );
      console.log(URL);
    }

    return URL;
  }
}

isLocalhost();

const baseUrl = URL[0];
const baseURL = URL[1];

export default function TrackPayment({ purchaseOrder }) {
  const [searchInput, setSearchInput] = useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState(purchaseOrder);

  const [wip, setWip] = useState(false);

  //wip 
  const wipOpen = async (e) => {
    e.preventDefault()
    setWip(true);
    timer()
  }

  function timer() {
    setTimeout(closeWIP, 2000);
  }

  function closeWIP() {
    setWip(false);
  }


  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    filterPurchaseOrders(event.target.value);
  };

  const filterPurchaseOrders = (searchValue) => {
    const filteredPOs = purchaseOrder.filter(
      (po) =>
        po.supplierName.toLowerCase().includes(searchValue.toLowerCase()) ||
        po.Status.toLowerCase().includes(searchValue.toLowerCase()) ||
        po.prID.toString().includes(searchValue)
    );
    setFilteredPurchaseOrders(filteredPOs);
  };

  return (
    <div>
      <h1>Payment Tracking</h1>

      <div className="pb-5">
        <div className={styles.rightFloater}>
          <div className="d-inline-flex">
            <input
              type="text"
              placeholder="  Search..."
              className={styles.searchText}
              value={searchInput}
              onChange={handleSearchInputChange}
            />
            <button type="submit" className={styles.searchButton}>
              <Image src={searchBtn} width={25} />
            </button>

            <button type="button" className={styles.searchButton}>
              <Image src={filterIcon} width={25} onClick={wipOpen} />
            </button>


          </div>
        </div>
      </div>


      {wip && <WIP Show={wip} />}



      <div className="row px-3 py-3">
        <hr className="mb-4"></hr>
        <div className="col">PO No.</div>
        <div className="col">Created</div>
        <div className="col">Price</div>
        <div className="col">Mode of Payment</div>
        <div className="col">Supplier</div>
        <div className="col">Status</div>
        <hr className="mt-4"></hr>
      </div>




      <div className="overflow-scroll px-2 w-100 h-75 position-absolute">
        {filteredPurchaseOrders.map((po, index) => (
          <div key={index} className="pt-1">
            <div className={styles.poListsMain}>
              <Link href={`/PurchaseOrder/${po.prID}`}>
                <button className={styles.prButton}>
                  <div className={`row px-1 py-3 text-start ${styles['hover-box-shadow']}`} style={{ backgroundColor: '#C0D8F7', borderRadius: '10px', width: '100%', height: 'auto' }}>
                    <div className="col">#{po.prID}</div>
                    <div className="col">{moment(po.requestDate).format('D MMM YYYY')}</div>
                    <div className="col">${Number(po.Price).toFixed(2)}</div>
                    <div className="col">{po.paymentMode}</div>
                    <div className="col">{po.supplierName}</div>
                    <div className="col">{po.Status}</div>
                  </div>
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const host = context.req.headers.host;
  // console.log(host);

  const backBaseURL = [];

  if (host == "localhost:5000") {
    backBaseURL.push("http://localhost:3000");
  } else {
    backBaseURL.push("https://abc-cooking-studio-backend.azurewebsites.net");
  }

  try {
    const response = await axios.get(`${backBaseURL}/api/purchaseOrder/`);
    const purchaseOrder = await response.data;
    return {
      props: {
        purchaseOrder,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        purchaseOrder: [],
      },
    };
  }
}