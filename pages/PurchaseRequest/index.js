import React from 'react';
import axios from 'axios';
import moment from 'moment';

import { useRouter } from "next/router";
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
import eyeCon from '../../public/eyeCon.svg';
import closeEyeCon from '../../public/closeEyeCon.svg'

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
    };
};

isLocalhost();

const baseUrl = URL[0];
const baseURL = URL[1];

// Each pr row
function PRRow (props){
    const statusID = props.StatusID;

    const [showPL, setShowPL] = useState(false);

    const [plRows, setPLRows] = useState([]);

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
    };

    const circle = circleTest(statusID);

    const viewProductLines = async(e) => {
        e.preventDefault();

        await axios.get(`${baseUrl}/api/purchaseReq/lineItem/${props.prID}`)
        .then((response) => {
            const plResult = response.data;
            setPLRows(plResult);
            setShowPL(true);
        })
        .catch((err) => {
            console.log(err);
            if(err.code === "ERR_NETWORK"){
                alert(err.message);
            }
        })
    };

    const closeViewProductLines = async(e) => {
        e.preventDefault();
        setShowPL(false);
    };

    return (
        <div className="py-1">
            <a href={baseURL + '/PurchaseRequest/' + props.prID}>
                <button className={styles.prButton}>
                    {
                        props.RoleID === 2 &&
                            <div className={styles.prRow}>
                                <div className='pt-2 row'>
                                    <div className={styles.prTextRow}>
                                        <div className='px-5 col-sm-1'>
                                            <p>#{props.prID}</p>
                                        </div>
                                        
                                        <div className='px-3 col-sm-1'>
                                            <p>{props.ReqDate}</p>
                                        </div>

                                        <div className='px-5 col-sm-3'> 
                                            <p>{props.Location}</p>
                                        </div>

                                        <div className='px-4 col-sm-2'>
                                            <p>{props.Supplier}</p>
                                        </div>

                                        <div className='px-3 col-sm-1'>
                                            <p>{props.TargetDate}</p>
                                        </div>

                                        <div className='px-5 mx-4 col-sm-2'>
                                            <div className='row'>
                                                <div className='col-sm-1'>
                                                    <p className={styles.prTextStatus}>{props.Status}</p>
                                                </div>
                                                <div className='ps-5 ms-4 col-sm-2'>
                                                    <Icon item={circle}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-sm-1'>
                                            {
                                                showPL === false &&
                                                    <button onClick={viewProductLines} type='button' className={styles.viewIconButton}>
                                                        <Image src={eyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                            {
                                                showPL === true &&
                                                    <button onClick={closeViewProductLines} type='button' className={styles.viewIconButton}>
                                                        <Image src={closeEyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    showPL &&
                                        <div className={styles.plRow}>
                                            <h5 className='ps-5 pt-3 text-start'><u>Product Lines</u></h5>

                                            <div className='py-3'>
                                                <div className='ps-4'>
                                                    <ul className="list-group list-group-horizontal text-center">
                                                        <li className="list-group-item col-sm-1 border-0 bg-transparent">Item No.</li>
                                                        <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">Item Name</li>
                                                        <li className="list-group-item col-sm-2 border-0 bg-transparent">Quantity</li>
                                                        <li className="list-group-item col-sm-1 border-0 bg-transparent"></li>
                                                        <li className="list-group-item col-sm-2 border-0 bg-transparent">Unit Price</li>
                                                        <li className="list-group-item col-sm-2 border-0 bg-transparent">Total Unit Price</li>
                                                    </ul>
                                                </div>

                                                {
                                                    plRows.map((item, index) => {
                                                        return <div key={index}>
                                                                    <div className='ps-4'>
                                                                        <ul className="list-group list-group-horizontal">
                                                                            <li className="list-group-item col-sm-1 border-0 bg-transparent">{item.lineItemID}</li>
                                                                            <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">{item.itemName}</li>
                                                                            <li className="list-group-item col-sm-2 border-0 bg-transparent">{item.quantity}</li>
                                                                            <li className="list-group-item col-sm-1 border-0 bg-transparent">X</li>
                                                                            <li className="list-group-item col-sm-2 border-0 bg-transparent">${item.unitPrice}</li>
                                                                            <li className="list-group-item col-sm-2 border-0 bg-transparent">${item.totalUnitPrice}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                }
                            </div>
                    }

                    {
                        props.RoleID === 1 &&
                            <div className={styles.prRow}>
                                <div className='pt-2 row'>
                                    <div className={styles.prTextRow}>
                                        <div className='px-5 col-sm-1'>
                                            <p>#{props.prID}</p>
                                        </div>
                                        
                                        <div className='px-3 col-sm-1'>
                                            <p>{props.ReqDate}</p>
                                        </div>

                                        <div className='px-5 col-sm-2'>
                                            <p>{props.Name}</p>
                                        </div>

                                        <div className='col-sm-3'> 
                                            <p>{props.Location}</p>
                                        </div>

                                        <div className='col-sm-1'>
                                            <p>{props.Supplier}</p>
                                        </div>

                                        <div className='px-3 col-sm-1'>
                                            <p>{props.TargetDate}</p>
                                        </div>

                                        <div className='px-5 col-sm-2'>
                                            <div className='row'>
                                                <div className='col-sm-1'>
                                                    <p className={styles.prTextStatus}>{props.Status}</p>
                                                </div>
                                                <div className='ps-5 ms-4 col-sm-2'>
                                                    <Icon item={circle}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-sm-1'>
                                            {
                                                showPL === false &&
                                                    <button onClick={viewProductLines} type='button' className={styles.viewIconButton}>
                                                        <Image src={eyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                            {
                                                showPL === true &&
                                                    <button onClick={closeViewProductLines} type='button' className={styles.viewIconButton}>
                                                        <Image src={closeEyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    showPL &&
                                        <div className={styles.plRow}>
                                            <h5 className='ps-5 pt-3 text-start'><u>Product Lines</u></h5>

                                            <div className='py-3'>
                                                <div className='ps-4'>
                                                    <ul className="list-group list-group-horizontal text-center">
                                                        <li className="list-group-item col-sm-1 border-0 bg-transparent">Item No.</li>
                                                        <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">Item Name</li>
                                                        <li className="list-group-item col-sm-2 border-0 bg-transparent">Quantity</li>
                                                        <li className="list-group-item col-sm-1 border-0 bg-transparent"></li>
                                                        <li className="list-group-item col-sm-2 border-0 bg-transparent">Unit Price</li>
                                                        <li className="list-group-item col-sm-2 border-0 bg-transparent">Total Unit Price</li>
                                                    </ul>
                                                </div>

                                                
                                                {
                                                    plRows.map((item, index) => {
                                                        return <div key={index}>
                                                                    <div className='ps-4'>
                                                                        <ul className="list-group list-group-horizontal">
                                                                            <li className="list-group-item col-sm-1 border-0 bg-transparent">{item.lineItemID}</li>
                                                                            <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">{item.itemName}</li>
                                                                            <li className="list-group-item col-sm-2 border-0 bg-transparent">{item.quantity}</li>
                                                                            <li className="list-group-item col-sm-1 border-0 bg-transparent">X</li>
                                                                            <li className="list-group-item col-sm-2 border-0 bg-transparent">${item.unitPrice}</li>
                                                                            <li className="list-group-item col-sm-2 border-0 bg-transparent">${item.totalUnitPrice}</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                    })
                                                }
                                            </div>
                                            
                                        </div>
                                }
                            </div>
                    }
                    
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
                    // Time stamp formatting
                    const reqDate = moment(prResult[index].requestDate).format('DD/MM/YYYY');
                    const targetDeliveryDate = moment(prResult[index].targetDeliveryDate).format('DD/MM/YYYY');

                    prList.push(
                        <div key={index}>
                            <PRRow
                                RoleID={roleID}
                                prID={item.prID}
                                ReqDate={reqDate}
                                Name={item.name}
                                Location={item.branchName}
                                Supplier={item.supplierName}
                                TargetDate={targetDeliveryDate}
                                Status={item.prStatus}
                                StatusID={item.prStatusID} />
                        </div>
                    )
                });

                setlist1(prList);
            }))
            .catch((err) => {
                console.log(err);
                if(err.code === "ERR_NETWORK"){
                    alert(err.message);
                }
                else if(err.response.status === 404){
                    alert(err.response.data);
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
                    // Time stamp formatting
                    const reqDate = moment(prResult[index].requestDate).format('DD/MM/YYYY');
                    const targetDeliveryDate = moment(prResult[index].targetDeliveryDate).format('DD/MM/YYYY');

                    prList.push(
                        <div key={index}>
                            <PRRow
                                RoleID={roleID}
                                prID={item.prID}
                                ReqDate={reqDate}
                                Name={item.name}
                                Location={item.branchName}
                                Supplier={item.supplierName}
                                TargetDate={targetDeliveryDate}
                                Status={item.prStatus}
                                StatusID={item.prStatusID} />
                        </div>
                    )
                });

                setlist1(prList);
            })
            .catch((err) => {
                console.log(err);
                if(err.code === "ERR_NETWORK"){
                    alert(err.message);
                }
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
                    // Time stamp formatting
                    const reqDate = moment(searchResult[index].requestDate).format('DD/MM/YYYY');
                    const targetDeliveryDate = moment(searchResult[index].targetDeliveryDate).format('DD/MM/YYYY');

                    resultsList.push(
                        <div key={index}>
                            <PRRow
                                RoleID={role}
                                prID={item.prID}
                                ReqDate={reqDate}
                                Name={item.name}
                                Location={item.branchName}
                                Supplier={item.supplierName}
                                TargetDate={targetDeliveryDate}
                                Status={item.prStatus}
                                StatusID={item.prStatusID} />
                        </div>
                    )
                });

                setlist1(resultsList);
            })
            .catch((err) => {
                if(err.code === "ERR_NETWORK"){
                    alert(err.message);
                }
                else if(err.response.status === 404){
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
                    // Time stamp formatting
                    const reqDate = moment(searchResult[index].requestDate).format('DD/MM/YYYY');
                    const targetDeliveryDate = moment(searchResult[index].targetDeliveryDate).format('DD/MM/YYYY');

                    resultsList.push(
                        <div key={index}>
                            <PRRow
                                RoleID={role}
                                prID={item.prID}
                                ReqDate={reqDate}
                                Name={item.name}
                                Location={item.branchName}
                                Supplier={item.supplierName}
                                TargetDate={targetDeliveryDate}
                                Status={item.prStatus}
                                StatusID={item.prStatusID} />
                        </div>
                    )
                });

                setlist1(resultsList);
            })
            .catch((err) => {
                console.log(err);
                if(err.code === "ERR_NETWORK"){
                    alert(err.message);
                }
                else if(err.response.status === 404){
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
                {
                    role === 2 &&
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item col-sm-1 px-5 border-0">No.</li>
                            <li className="list-group-item col-sm-1 px-3 border-0">Date</li>
                            <li className="list-group-item col-sm-3 px-5 border-0">Location</li>
                            <li className="list-group-item col-sm-2 px-3 border-0">Supplier</li>
                            <li className="list-group-item col-sm-1 px-2 ms-1 border-0">Target Date</li>
                            <li className="list-group-item col-sm-2 px-5 mx-3 border-0">Status</li>
                            <li className="list-group-item col-sm-1 border-0"></li>
                        </ul>
                }

                {
                    role === 1 &&
                        <ul className="list-group list-group-horizontal">
                            <li className="list-group-item col-sm-1 px-5 border-0">No.</li>
                            <li className="list-group-item col-sm-1 px-3 border-0">Date</li>
                            <li className="list-group-item col-sm-2 px-5 border-0">Name</li>
                            <li className="list-group-item col-sm-3 px-0 border-0">Location</li>
                            <li className="list-group-item col-sm-1 px-0 border-0">Supplier</li>
                            <li className="list-group-item col-sm-1 px-2 border-0">Target Date</li>
                            <li className="list-group-item col-sm-2 px-5 mx-2 border-0">Status</li>
                            <li className="list-group-item col-sm-1 border-0"></li>
                        </ul>
                }
                
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