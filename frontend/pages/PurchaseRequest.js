import React from 'react';
import axios from 'axios';

import { useEffect, useState } from 'react';
import Image from 'next/image';


// Style Sheet
import styles from '../styles/purchaseReq.module.css';

// Images
import searchIcon from '../public/searchIcon.svg';
import filterIcon from '../public/filterIcon.svg';
import plusIcon from '../public/plusIcon.svg';
import pendingCircle from '../public/yellowPendingCircle.svg';
import approvedCircle from '../public/greenApprovedCircle.svg';
import rejectedCircle from '../public/redRejectedCircle.svg';

function isLocalhost(url) 
{
    return url.includes('localhost') || url.includes('127.0.0.1');
}

// const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// const baseUrl = API_URL;
const baseUrl = 'http://localhost:3000';
const baseURL = 'http://localhost:5000';

// const id = localStorage.getItem("user_Id");
const id = 2;

function PRRow (props){
    const prID = props.ID
    const statusID = props.StatusID;

    function circleTest(statusID){
        if(statusID == 1){
            return '/yellowPendingCircle.svg';
        }
        else if(statusID == 2){
            return '/greenApprovedCircle.svg';
        }
        else if(statusID == 3){
            return '/redRejectedCircle.svg';
        }
        else{
            return '/yellowPendingCircle.svg';
        }
    }

    const circle = circleTest(statusID);

    return (
        <div>
            <a href={baseURL + '/PurchaseRequest/ViewPR/' + props.prID}>
                <button className={styles.prButton}>
                    <div className={styles.prRow}>
                        <div className={styles.prTextRow}>
                            <div>
                                <p className={styles.prTextNo}>{props.prID}</p>
                            </div>
                            <div>
                                <p className={styles.prTextName}>{props.Name}</p>
                            </div>
                            <div>
                                <p className={styles.prTextLocation}>{props.Location}</p>
                            </div>
                            <div>
                                <p className={styles.prTextSupplier}>{props.Supplier}</p>
                            </div>
                            <div>
                                <p className={styles.prTextStatus}>{props.Status}</p>
                            </div>
                            <div>
                                <Icon item={circle}/>
                            </div>
                        </div>
                    </div>
                </button>
            </a>
        </div>
    )
};

function Icon(props){
    return(
        <Image src={baseURL + props.item} width={25} height={25} id={styles.statusCircle} alt='status indicator'/>
    )
}


export default function PurchaseReq() {
    const [PRResults, setlist1] = useState([(<div>Loading...</div>)]);

    // show all PR
    useEffect(() => {
        axios.all([
            axios.get(`${baseUrl}/api/purchaseReq/${id}`,{
                headers: {
                    'user': id
                    // 'authorization': 'Bearer ' + token 
                }
            })
        ])
        .then(axios.spread((response1) => {
            // console.log(response1);

            const prResult = response1.data;

            const prList = [];

            prResult.forEach((item, index) => {
                prList.push(
                    <div key={index}>
                        <PRRow
                            prID={item.prID}
                            Name={item.name}
                            Location={item.branchName}
                            Supplier={item.supplierName}
                            Status={item.prStatus}
                            StatusID={item.prStatusID} />
                    </div>
                )
            });

            setlist1(prList);
        }))
        .catch((err) => {
            console.log(err);
            if(err.response.status === 404){
                alert(err.response.data);
            }
            else{
                alert(err.code);
            }
        })
    }, []);

    return (
        <>
            <div className={styles.headerRow}>
                <h1 className={styles.header}>Purchase Request</h1>
                <div>
                    <div className={styles.searchContainer}>
                        <form>
                            <input type="text" placeholder="Search.." name="search" className={styles.searchBox}/>
                            <button type="submit" className={styles.searchButton}><Image src={searchIcon}/></button>
                            <button type="submit" className={styles.searchButton}><Image src={filterIcon} width={20} /></button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className={styles.labelRow}>
                <hr/>
                <ul className={styles.tableLabel}>
                    <li className={styles.tableNo}>No.</li>
                    <li className={styles.tableName}>Name</li>
                    <li className={styles.tableLocation}>Location</li>
                    <li className={styles.tableSupplier}>Supplier</li>
                    <li className={styles.tableStatus}>Status</li>
                </ul>
                <hr/>
            </div>

            <div className={styles.prData}>
                {PRResults}
            </div>

            <div>
                <a href={baseURL + '/PurchaseRequest/CreatePR'}>
                    <button className={styles.createButton}>
                        <Image src={plusIcon} alt='Plus Icon' width={40} height={40}/>
                    </button>
                </a>
                
            </div>

        </>
    )
}