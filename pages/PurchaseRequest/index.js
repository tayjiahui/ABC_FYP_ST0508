import React from 'react';
import axios from 'axios';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Style Sheet
import styles from '../../styles/purchaseReq.module.css';

// Images
import searchIcon from '../../public/searchIcon.svg';
import filterIcon from '../../public/filterIcon.svg';
import plusIcon from '../../public/plusIcon.svg';
import pendingCircle from '../../public/yellowPendingCircle.svg';
import approvedCircle from '../../public/greenApprovedCircle.svg';
import rejectedCircle from '../../public/redRejectedCircle.svg';

// Base urls
const URL = [];

function isLocalhost() 
{
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log('hostname   ' + hostname);
        if(hostname == 'localhost'){
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
            
        }
        else if(hostname == 'abc-cooking-studio.azurewebsites.net'){
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

// Each pr row
function PRRow (props){
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
        <div className="py-1">
            <a href={baseURL + '/PurchaseRequest/' + props.prID}>
                <button className={styles.prButton}>
                    <div className={styles.prRow}>
                        <div className={styles.prTextRow}>
                            <div>
                                <p className={styles.prTextNo}>#{props.prID}</p>
                            </div>
                            {/* <div>
                                <p className={styles.prTextName}>{props.Name}</p>
                            </div> */}
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

// Status icon for each PR row
function Icon(props){
    return(
        <Image src={baseURL + props.item} width={25} height={25} id={styles.statusCircle} alt='status indicator'/>
    )
};

export default function PurchaseRequest() {

    const [id, setUserID] = useState();
    const [role, setRoleID] = useState();
    
    const [PRResults, setlist1] = useState([(<div>Loading...</div>)]);

    const [searchValue, setSearchValue] = useState("");

    // show all PR
    useEffect(() => {
        // set user id taken from localstorage
        const userID = parseInt(localStorage.getItem("ID"), 10);
        setUserID(userID);

        // set user role
        const roleID = parseInt(localStorage.getItem("roleID"), 10);
        setRoleID(roleID);

        if(roleID === 2){
            axios.all([
                axios.get(`${baseUrl}/api/purchaseReq/${userID}`,{
                    headers: {
                        'user': userID
                        // 'authorization': 'Bearer ' + token 
                    }
                })
            ])
            .then(axios.spread((response1) => {
                // console.log(response1);

                const prResult = response1.data;

                // data filter out duplicates
                // const uniqueIDs = [];
                // const duplicatePRs = [];

                // const filteredPRData1 = prResult.filter(e => {

                //     // uniqueIDs only keeps one of each prID and removes duplicated prID objects
                //     const isDuplicate = uniqueIDs.includes(e.prID);

                //     if(!isDuplicate){
                //         uniqueIDs.push(e.prID);

                //         return true;
                //     }
                //     else{
                //         duplicatePRs.push(e);

                //         return false;
                //     };
                // });

                // // adds duplicated PR branchname to main PR OBJECT
                // duplicatePRs.forEach((item, index) => {
                //     let foundIndex = filteredPRData1.findIndex(x => x.prID == duplicatePRs[index].prID);
                //     filteredPRData1[foundIndex].branchName += `, ${duplicatePRs[index].branchName}`;
                // });

                // Show List of UPDATED PRs [multiple locations included]
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
                }
                else{
                    alert(err.code);
                }
            });
        }
        else if(roleID === 1){ 
            // admin/approver
            axios.get(`${baseUrl}/api/purchaseReq/`,{
                headers: {
                    // 'user': userID
                    // 'authorization': 'Bearer ' + token 
                }
            })
            .then((response) => {
                const prResult = response.data;

                // Show List of UPDATED PRs [multiple locations included]
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
            })
            .catch((err) => {
                console.log(err);
            });
        }

        
    }, []);

    const handlePRSearch = async(e) => {
        e.preventDefault();

        if(role === 2){
            await axios.post(`${baseUrl}/api/purchaseReq/search/${id}`,
                {
                    "searchValue": searchValue
                }
            )
            .then((response) => {
                // console.log(searchValue);
                // console.log(response.data);

                const searchResult = response.data;

                // Show List of Searched PR results
                const resultsList = [];

                searchResult.forEach((item, index) => {
                    resultsList.push(
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

                setlist1(resultsList);
            })
            .catch((err) => {
                if(err.response.status === 404){
                    setlist1(<div className="p-5">No Results Found!</div>)
                }
                else{
                    alert(err.response.data);
                }
            });
        }
        else if(role === 1){
            await axios.post(`${baseUrl}/api/purchaseReq/search/`,
                {
                    "searchValue": searchValue
                }
            )
            .then((response) => {
                const searchResult = response.data;

                // Show List of Searched PR results
                const resultsList = [];

                searchResult.forEach((item, index) => {
                    resultsList.push(
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

                setlist1(resultsList);
            })
            .catch((err) => {
                if(err.response.status === 404){
                    setlist1(<div className="p-5">No Results Found!</div>)
                }
                else{
                    alert(err.response.data);
                }
            });   
        }
    };

    return (
        <>
            <div className={styles.headerRow}>
                <h1 className={styles.header}>Purchase Request</h1>
                <div>
                    <div className={styles.searchContainer}>
                        <form onSubmit={handlePRSearch}>
                            <input type="text" placeholder="  Search.." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} name="search" className={styles.searchBox}/>
                            <button type="submit" className={styles.searchButton}><Image src={searchIcon} alt='Search'/></button>
                            <button type="button" className={styles.searchButton}><Image src={filterIcon} alt='Filter' width={20} /></button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className={styles.labelRow}>
                <hr/>
                <ul className={styles.tableLabel}>
                    <li className={styles.tableNo}>No.</li>
                    {/* <li className={styles.tableName}>Name</li> */}
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
                <a href={'/PurchaseRequest/CreatePR'}>
                    <button className={styles.createButton}>
                        <Image src={plusIcon} alt='Plus Icon' width={40} height={40}/>
                    </button>
                </a>
            </div>

        </>
    )
}