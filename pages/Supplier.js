import React from 'react';
import axios from 'axios';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// css
import styles from '../styles/supplier.module.css';

// icons
import searchIcon from '../public/searchIcon.svg';
import filterIcon from '../public/filterIcon.svg';
import plusIcon from '../public/plusIcon.svg';

function isLocalhost(url) 
{
    return url.includes('localhost') || url.includes('127.0.0.1');
}

const baseUrl = 'http://localhost:3000';
const baseURL = 'http://localhost:5000';

// user
//const id = 2;

function SupplierRows (props) {
    const supplierID = props.supplierID;
    const categoryID = props.categoryID;
    
    return (
        <div>
            <a href = {baseURL + '/Supplier/ViewSupplier/' + supplierID}>
                <button className={styles.supplBtn}>
                    <div className={styles.listRow}>
                        <div className={styles.listContent}>
                            <div>
                                <p className={styles.contentNo}>{props.supplierID}</p>
                            </div>
                            <div>
                                <p className={styles.contentContactPerson}>{props.ContactPersonName}</p>
                            </div>
                            <div>
                                <p className={styles.contentSupplierName}>{props.SupplierName}</p>
                            </div>
                            <div>
                                <p className={styles.contentCategory}>{props.Category}</p>
                            </div>
                        </div>
                    </div>
                </button>
            </a>
        </div>
    )
};

export default function Supplier() {

    const [supplierResults, supplierList] = useState([(<div>Loading...</div>)]);

    // Suppliers List
    useEffect(() => {
        axios.all([
            axios.get(`${baseUrl}/api/supplier/all`, {
                /*headers: {
                    'user': id
                    // 'authorization': 'Bearer ' + token 
                }*/
            })
        ])
        .then(axios.spread((response1) => {
            console.log(response1);

            console.log(response1.data);
            const supplResults = response1.data;
            
            const supplList = [];

            supplResults.forEach((item, index) => {
                supplList.push(
                    <div key={index}>
                        <SupplierRows
                            supplierID={item.supplierID}
                            ContactPersonName={item.contactPersonName}
                            Supplier={item.supplierName}
                            Category={item.categoryName} />
                    </div>
                )
            });

            supplierList(supplList);
        
        }))
        .catch((err) => {
            console.log(err);
            if(err.response.status === 404) {
                alert(err.response.data);
            }
            else {
                alert(err.code);
            }
        })
    }, []);

    return (
        <>
            <div className={styles.titleBox}>
                <h1 className={styles.title}>Supplier</h1>
                <div>
                    <div className={styles.searchContainer}>
                        <form>
                            <input type="text" placeholder="Search..." name="search" className={styles.searchBox}/>
                            <button type="submit" className={styles.searchButton}><Image src={searchIcon}/></button>
                            <button type="submit" className={styles.searchButton}><Image src={filterIcon} width={20} /></button>
                        </form>
                    </div>
                </div>
            </div>

            <div>
                <hr/>
                <ul className={styles.headerRow}>
                    <li className={styles.headerNo}>No.</li>
                    <li className={styles.headerContactPerson}>Contact Person</li>
                    <li className={styles.headerName}>Supplier Name</li>
                    <li className={styles.headerCategory}>Category</li>
                </ul>
                <hr/>
            </div>

            <div>
                {supplierResults}
            </div>

            <div>
                <a href={baseURL + '/Supplier/CreateSupplier'}>
                    <button className={styles.createBtn}>
                        <Image src={plusIcon} alt='Plus Icon' width={40} height={40}/>
                    </button>
                </a>
            </div>
            
        </>
    )
}