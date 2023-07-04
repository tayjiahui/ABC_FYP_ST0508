import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from 'next/link'
import styles from "../../styles/trackPayment.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import Image from 'next/image';
import searchBtn from '../../public/searchIcon.svg';

function isLocalhost(url) {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
const baseURL = 'http://localhost:5000';


export default function TrackPayment({ purchaseOrder }) {
  const poList = purchaseOrder.map((po, index) => (

    
    // <Link href={'https://abc-cooking-studio.azurewebsites.net/PurchaseOrder/' + po.prID} className="text-decoration-none text-dark">
    <Link href={'http://localhost:5000/PurchaseOrder/' + po.prID} className="text-decoration-none text-dark">

      <div key={index} className="row py-4 border-bottom mb-2 shadow" style={{ backgroundColor: '#C0D8F7', borderRadius: '15px'}}>
        <div className="col">{po.prID}</div>
        <div className="col">{moment(po.requestDate).format('DD/MM/YYYY')}</div>
        <div className="col">${Number(po.Price).toFixed(2)}</div>
        <div className="col">{po.paymentMode}</div>
        <div className="col">{po.supplierName}</div>
        <div className="col">{po.Status}</div>
      </div>
    </Link>
  ));

  return (
    <div className="container-fluid px-5">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="m-0">Payment Tracking</h1>
        {/* <div className="d-flex">
          <input type="text" placeholder="Search..." className="form-control me-2" />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div> */}

        <div className="d-flex">
                    <input type="text" placeholder="Search..." className={styles.searchText} />
                    <button type="submit" className={styles.searchButton}>
                        <Image src={searchBtn} />
                    </button>
                </div>
      </div>

      <div className="row py-2 border-top border-bottom mt-4 mb-4">
        <div className="col" >No.</div>
        <div className="col">Created</div>
        <div className="col">Price</div>
        <div className="col">Mode of Payment</div>
        <div className="col">Supplier</div>
        <div className="col">Status</div>
      </div>

      <div>
        {poList}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${baseUrl}/api/purchaseOrder/`);
    const purchaseOrder = await response.data;
    return {
      props: {
        purchaseOrder
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        purchaseOrder: []
      }
    };
  }
}

