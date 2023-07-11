import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link'
import styles from "../../styles/trackPayment.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import Image from 'next/image';
import searchBtn from '../../public/searchIcon.svg';

export default function TrackPayment({ purchaseOrder }) {
  const [searchInput, setSearchInput] = useState([]);
  const [filteredPurchaseOrders, setFilteredPurchaseOrders] = useState(purchaseOrder);

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    filterPurchaseOrders(event.target.value);
  };

  const filterPurchaseOrders = (searchValue) => {
    const filteredPOs = purchaseOrder.filter(
      (po) =>
        po.supplierName.toLowerCase().includes(searchValue.toLowerCase()) ||
        po.Status.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPurchaseOrders(filteredPOs);
  };

  return (
    <div className="container-fluid px-3">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="m-0">Payment Tracking</h1>
        <div className="d-flex">
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchText}
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <button type="submit" className={styles.searchButton}>
            <Image src={searchBtn} />
          </button>
        </div>
      </div>

      <div className="row py-4 border-top border-bottom mt-4 mb-4">
        <div className="col">PO No.</div>
        <div className="col">Created</div>
        <div className="col">Price</div>
        <div className="col">Mode of Payment</div>
        <div className="col">Supplier</div>
        <div className="col">Status</div>
      </div>

      <div>
        {filteredPurchaseOrders.map((po, index) => (
          <Link key={index} href={'http://localhost:5000/PurchaseOrder/' + po.prID} className="text-decoration-none text-dark drop-shadow ">
            <div className="row py-4 border-bottom mb-2 " style={{ backgroundColor: '#C0D8F7', borderRadius: '15px', height: '85px'}}>
              <div className="col">{po.prID}</div>
              <div className="col">{moment(po.requestDate).format('DD MMM YYYY')}</div>
              <div className="col">${Number(po.Price).toFixed(2)}</div>
              <div className="col">{po.paymentMode}</div>
              <div className="col">{po.supplierName}</div>
              <div className="col">{po.Status}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get(`http://localhost:3000/api/purchaseOrder/`);
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
