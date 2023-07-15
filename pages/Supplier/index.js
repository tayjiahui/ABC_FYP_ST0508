import axios from "axios";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react"; 

// styles & icons
import styles from '../../styles/supplier.module.css';
import searchIcon from '../../public/searchIcon.svg';
import filterIcon from '../../public/filterIcon.svg';
import plusIcon from '../../public/plusIcon.svg';

// WIP component
import WIP from "../../components/WIP";

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        console.log("hostname: " + hostname);
        if (hostname == "localhost") {
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
        } else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
            URL.push(
                'https://abc-cooking-studio-backend.azurewebsites.net',
                'https://abc-cooking-studio.azurewebsites.net'
            );
            console.log("URL: " + URL);
        }

        return URL;
    }
};

isLocalhost();

console.log("url[0]: "+URL[0]);
console.log("url[1]: "+URL[1]);

const baseUrl = URL[0];
const baseURL = URL[1];

// console.log(baseUrl, baseURL);

// main supplier page
export default function Supplier({ suppliers }) {

    // WIP modal for search bar
    const [wip, setWip] = useState(false);

    const wipOpen = async (e) => {
        e.preventDefault()
        setWip(true);
        timer();
    }

    function timer() {
        setTimeout(closeWIP, 2000);
    }

    function closeWIP() {
        setWip(false);
    }

    const supplierList = suppliers.map((supplier, index) => (
        <a href={'/Supplier/' + supplier.supplierID}>
            <button className={styles.cardLink}>
                <div className={styles.listRow}>
                    <div key={index} className={styles.listContent}>
                        <p className={styles.listNo}>{supplier.supplierID}</p>
                        <p className={styles.listSupplierName}>{supplier.supplierName}</p>
                        <p className={styles.listContactPerson}>{supplier.contactPersonName}</p>
                        <p className={styles.listContactNumber}>{supplier.phoneNum}</p>
                        <p className={styles.listCategory}>{supplier.Category}</p> 
                    </div>  
                </div>
            </button>  
        </a>
    ));

    return (
        <>
            <div className={styles.titleRow}>
                <h1 className={styles.title}>Supplier</h1>

                <div>
                    <div className={styles.searchContainer}>
                        <form>
                            <input type="text" placeholder="Search..." name="search" className={styles.searchBox}/>
                            <button type="submit" className={styles.searchButton}><Image src={searchIcon} onClick={wipOpen}/></button>
                            <button type="submit" className={styles.searchButton}><Image src={filterIcon} width={20} onClick={wipOpen}/></button>
                        </form>
                        {/* {wip && <WIP Show={wip} />} */}
                    </div>
                </div>
            </div>

            <div>
                <hr />
                <ul className={styles.tableHeader}>
                    <li className={styles.headerNo}>No.</li>
                    <li className={styles.headerSupplierName}>Supplier</li>
                    <li className={styles.headerContactPerson}>Contact Person</li>
                    <li className={styles.headerContactNumber}>Contact Number</li>
                    <li className={styles.headerCategory}>Category</li>
                </ul>
                <hr /> 
            </div>

            <div>
                {supplierList}
            </div>

            <div>
                <a href={'/Supplier/CreateSupplier'}>
                    <button className={styles.createButton}>
                        <Image src={plusIcon} alt="Create Button" width={40} height={40}/>
                    </button>
                </a>
            </div>

            {wip && <WIP Show={wip} />}
        </>
    )
}

export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    const backBaseURL = [];

    if(host == 'localhost:5000') {
        backBaseURL.push('http://localhost:3000');
    }
    else {
        backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
    }

    try {
        const response = await axios.get(`${backBaseURL}/api/supplier/all`);
        const suppliers = await response.data;
        return {
            props: {
                suppliers
            }
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                suppliers: []
            }
        };
    }
}
