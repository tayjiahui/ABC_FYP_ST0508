
import React from "react";
import axios from "axios";
import styles from "../../styles/trackPayment.module.css";
import searchBtn from '../../public/searchIcon.svg';
import Image from 'next/image';
import { useEffect, useState } from "react";
import Link from 'next/link'

function isLocalhost(url) {
    return url.includes('localhost') || url.includes('127.0.0.1');
}

const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
const baseURL = 'http://localhost:5000';

export default function TrackPayment({ purchaseOrder }) {
    const poList = purchaseOrder.map((po, index) => (
        <Link href={baseURL + '/PurchaseOrder/' + po.prID} className={styles.textLink}>
            <div key={index} className={styles.row}>
                <p className={styles.rowTitlesNo1}>{po.prID}</p>
                <p className={styles.rowTitlesCreate1}>{po.requestDate}</p>
                <p className={styles.rowTitlesPrice1}>${Number(po.Price).toFixed(2)}</p>
                <p className={styles.rowTitlesMOP1}>{po.paymentMode}</p>
                <p className={styles.rowTitlesSup1}>{po.supplierName}</p>
                <p className={styles.rowTitlesStat1}>{po.Status}</p>
            </div>
        </Link>
    ));

    return (
        <div>
            <div className={styles.ptContainer}>
                <h1 className={styles.mainHeader}>Payment Tracking</h1>
                <div className={styles.searchQuery}>
                    <input type="text" placeholder="Search..." className={styles.searchText} />
                    <button type="submit" className={styles.searchButton}>
                        <Image src={searchBtn} />
                    </button>
                </div>
            </div>

            <div className={styles.rowHeaders}>
                <hr />
                <p className={styles.rowTitlesNo}>No.</p>
                <p className={styles.rowTitlesCreate}>Created</p>
                <p className={styles.rowTitlesPrice}>Price</p>
                <p className={styles.rowTitlesMOP}>Mode of Payment</p>
                <p className={styles.rowTitlesSup}>Supplier</p>
                <p className={styles.rowTitlesStat}>Status</p>
                <hr />
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