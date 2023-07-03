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
        };

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
                                        <div className='px-4 ms-3 col-sm-1'>
                                            {
                                                showPL === false &&
                                                    <button onClick={viewProductLines} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                            {
                                                showPL === true &&
                                                    <button onClick={closeViewProductLines} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                        </div>
                                        
                                        <div className='px-1 col-sm-1'>
                                            <p>{props.ReqDate}</p>
                                        </div>

                                        <div className='px-4 mx-4 col-sm-3'> 
                                            <p>{props.Location}</p>
                                        </div>

                                        <div className='px-1 col-sm-2'>
                                            <p>{props.Supplier}</p>
                                        </div>

                                        <div className='px-1 col-sm-1'>
                                            <p>{props.TargetDate}</p>
                                        </div>

                                        <div className='px-5 mx-3 col-sm-2'>
                                            <div className='row'>
                                                <div className='col-sm-1'>
                                                    <p className={styles.prTextStatus}>{props.Status}</p>
                                                </div>
                                                <div className='ps-5 ms-4 col-sm-2'>
                                                    <Icon item={circle}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-sm-1 px-0'>
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
                                                                            <li className="list-group-item col-sm-1 border-0 bg-transparent">{index + 1}</li>
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
                                        <div className='px-4 mx-2 col-sm-1'>
                                            {
                                                showPL === false &&
                                                    <button onClick={viewProductLines} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                            {
                                                showPL === true &&
                                                    <button onClick={closeViewProductLines} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                        </div>
                                        
                                        <div className='col-sm-1'>
                                            <p>{props.ReqDate}</p>
                                        </div>

                                        <div className='px-1 ms-4 col-sm-1'>
                                            <p>{props.Name}</p>
                                        </div>

                                        <div className='px-3 col-sm-3'> 
                                            <p>{props.Location}</p>
                                        </div>

                                        <div className='col-sm-1'>
                                            <p>{props.Supplier}</p>
                                        </div>

                                        <div className='px-0 mx-4 col-sm-1 text-center'>
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
                                                                            <li className="list-group-item col-sm-1 border-0 bg-transparent">{index + 1}</li>
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

function AdHocRow (props){
    const statusID = props.StatusID;

    const [showDescript, setShowDescript] = useState(false);

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

    const viewDescription = async(e) => {
        e.preventDefault();
        setShowDescript(true);
    };

    const closeViewDescription = async(e) => {
        e.preventDefault();
        setShowDescript(false);
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
                                        <div className='px-4 ms-3 col-sm-1'>
                                            {
                                                showDescript === false &&
                                                    <button onClick={viewDescription} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                            {
                                                showDescript === true &&
                                                    <button onClick={closeViewDescription} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                        </div>
                                        
                                        <div className='px-1 col-sm-1'>
                                            <p>{props.ReqDate}</p>
                                        </div>

                                        <div className='px-1 col-sm-1'>
                                            <p>{props.TargetDate}</p>
                                        </div>

                                        <div className='px-5 mx-3 col-sm-2'>
                                            <div className='row'>
                                                <div className='col-sm-1'>
                                                    <p className={styles.prTextStatus}>{props.Status}</p>
                                                </div>
                                                <div className='ps-5 ms-4 col-sm-2'>
                                                    <Icon item={circle}/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-sm-1 px-0'>
                                            {
                                                showDescript === false &&
                                                    <button onClick={viewDescription} type='button' className={styles.viewIconButton}>
                                                        <Image src={eyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                            {
                                                showDescript === true &&
                                                    <button onClick={closeViewDescription} type='button' className={styles.viewIconButton}>
                                                        <Image src={closeEyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    showDescript &&
                                        <div className={styles.plRow}>
                                            <h5 className='ps-5 pt-3 text-start'><u>Description</u></h5>

                                            <div className='py-2 ps-5 text-start'>
                                                <p>{props.Description}</p>
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
                                        <div className='px-4 mx-2 col-sm-1'>
                                            {
                                                showDescript === false &&
                                                    <button onClick={viewDescription} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                            {
                                                showDescript === true &&
                                                    <button onClick={closeViewDescription} type='button' className={styles.viewIconButton}>
                                                         <p>#{props.prID}</p>
                                                    </button>
                                            }
                                        </div>
                                        
                                        <div className='col-sm-1'>
                                            <p>{props.ReqDate}</p>
                                        </div>

                                        <div className='px-1 ms-4 col-sm-1'>
                                            <p>{props.Name}</p>
                                        </div>

                                        <div className='px-0 mx-4 col-sm-1 text-center'>
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
                                                showDescript === false &&
                                                    <button onClick={viewDescription} type='button' className={styles.viewIconButton}>
                                                        <Image src={eyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                            {
                                                showDescript === true &&
                                                    <button onClick={closeViewDescription} type='button' className={styles.viewIconButton}>
                                                        <Image src={closeEyeCon} width={30} height={30} alt='Eye Icon'/>
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </div>

                                {
                                    showDescript &&
                                        <div className={styles.plRow}>
                                            <h5 className='ps-5 pt-3 text-start'><u>Description</u></h5>

                                            <div className='py-2 ps-5 text-start'>
                                               <p>{props.Description}</p>
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

export default function PurchaseRequest() {

    const [id, setUserID] = useState();
    const [role, setRoleID] = useState();
    
    const [PRResults, setlist1] = useState([(<div>Loading...</div>)]);
    const [AdHocResults, setAdHocResults] = useState([(<div>Loading...</div>)]);

    const [showAdHoc, setShowAdHoc] = useState(false);

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
                }),
                axios.get(`${baseUrl}/api/purchaseReq/adhoc/${userID}`,{
                    headers: {
                        'user': userID
                        // 'authorization': 'Bearer ' + token 
                    }
                })
            ])
            .then(axios.spread((response1, response2) => {
                console.log(response1);
                console.log(response2.data);

                const prResult = response1.data;
                const adHocResult = response2.data;

                console.log(adHocResult);

                // Show List of UPDATED PRs [multiple locations included]
                const prList = [];

                prResult.forEach((item, index) => {
                    // Time stamp formatting
                    const reqDate = moment(prResult[index].requestDate).format('D MMM YYYY');
                    const targetDeliveryDate = moment(prResult[index].targetDeliveryDate).format('D MMM YYYY');

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
                    );
                });

                setlist1(prList);

                // Show List of Ad-hoc Purchases
                const adHocList = [];

                adHocResult.forEach((item, index) => {
                    // Time stamp formatting
                    const reqDate = moment(adHocResult[index].requestDate).format('D MMM YYYY');
                    const targetDeliveryDate = moment(adHocResult[index].targetDeliveryDate).format('D MMM YYYY');

                    adHocList.push(
                        <div key={index}>
                            <AdHocRow
                                RoleID={roleID}
                                prID={item.prID}
                                ReqDate={reqDate}
                                Name={item.name}
                                TargetDate={targetDeliveryDate}
                                Status={item.prStatus}
                                StatusID={item.prStatusID}
                                Description={item.remarks} />
                        </div>
                    );
                });

                setAdHocResults(adHocList);
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
                };
            });
        }
        else if(roleID === 1){ 
            // admin/approver
            axios.all([
                axios.get(`${baseUrl}/api/purchaseReq/`,{
                    headers: {
                        // 'user': userID
                        // 'authorization': 'Bearer ' + token 
                    }
                }),
                axios.get(`${baseUrl}/api/purchaseReq/adhoc/purchases`,{
                    headers: {
                        // 'user': userID
                        // 'authorization': 'Bearer ' + token 
                    }
                })
            ])
            .then(axios.spread((response1, response2) => {
                const prResult = response1.data;
                const adHocResult = response2.data;

                // Show List of UPDATED PRs [multiple locations included]
                const prList = [];

                prResult.forEach((item, index) => {
                    // Time stamp formatting
                    const reqDate = moment(prResult[index].requestDate).format('D MMM YYYY');
                    const targetDeliveryDate = moment(prResult[index].targetDeliveryDate).format('D MMM YYYY');

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
                    );
                });

                setlist1(prList);

                // Show List of Ad-hoc Purchases
                const adHocList = [];

                adHocResult.forEach((item, index) => {
                    // Time stamp formatting
                    const reqDate = moment(adHocResult[index].requestDate).format('D MMM YYYY');
                    const targetDeliveryDate = moment(adHocResult[index].targetDeliveryDate).format('D MMM YYYY');

                    adHocList.push(
                        <div key={index}>
                            <AdHocRow
                                RoleID={roleID}
                                prID={item.prID}
                                ReqDate={reqDate}
                                Name={item.name}
                                TargetDate={targetDeliveryDate}
                                Status={item.prStatus}
                                StatusID={item.prStatusID}
                                Description={item.remarks} />
                        </div>
                    );
                });

                setAdHocResults(adHocList);
            }))
            .catch((err) => {
                console.log(err);
                if(err.code === "ERR_NETWORK"){
                    alert(err.message);
                };
            });
        };
    }, []);

    const adHocView = async(e) => {
        console.log(e.target.checked);
        console.log("adhoc conly");

        if(e.target.checked === true){
            setShowAdHoc(true);
        }
        else{
            setShowAdHoc(false);
        };
    };

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
                    const reqDate = moment(searchResult[index].requestDate).format('D MMM YYYY');
                    const targetDeliveryDate = moment(searchResult[index].targetDeliveryDate).format('D MMM YYYY');

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
                    );
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
                };
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
                    const reqDate = moment(searchResult[index].requestDate).format('D MMM YYYY');
                    const targetDeliveryDate = moment(searchResult[index].targetDeliveryDate).format('D MMM YYYY');

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
                };
            });   
        };
    };

    return (
        <>

            <h1 className={styles.header}>Purchase Request</h1>
            
            <div className="pb-5">
                <div className={styles.rightFloater}>
                    <div className="px-3 pb-4">
                        <div className={styles.toggle}>
                            <div className="px-3 pt-1">
                                <h5>Ad-Hoc</h5>
                            </div>

                            <label className={styles.switch}>
                                <input type="checkbox" onChange={(e) => {adHocView(e)}}/>
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                    <div className={styles.searchContainer}>
                        <form onSubmit={handlePRSearch}>
                            <input type="text" placeholder="  Search.." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} name="search" className={styles.searchBox}/>
                            <button type="submit" className={styles.searchButton}><Image src={searchIcon} width={25} alt='Search'/></button>
                            <button type="button" className={styles.searchButton}><Image src={filterIcon} width={25} alt='Filter' /></button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className='pt-1'>
                <div className={styles.labelRow}>
                    <div className='pt-1'>
                        <hr/>
                    </div>
                    
                    {
                        role === 2 && showAdHoc === false &&
                            <ul className="list-group list-group-horizontal">
                                <li className="list-group-item col-sm-1 px-4 ms-3 border-0">PR No.</li>
                                <li className="list-group-item col-sm-1 px-1 border-0">Date</li>
                                <li className="list-group-item col-sm-3 px-4 mx-4 border-0">Location</li>
                                <li className="list-group-item col-sm-2 px-1 border-0">Supplier</li>
                                <li className="list-group-item col-sm-1 px-1 border-0">Target Date</li>
                                <li className="list-group-item col-sm-2 px-5 mx-3 border-0">Status</li>
                                <li className="list-group-item col-sm-1 border-0"></li>
                            </ul>
                    }

                    {
                        role === 1 && showAdHoc === false &&
                            <ul className="list-group list-group-horizontal">
                                <li className="list-group-item col-sm-1 px-3 mx-2 border-0">PR No.</li>
                                <li className="list-group-item col-sm-1 px-1 border-0">Date</li>
                                <li className="list-group-item col-sm-1 px-1 ms-4 border-0">Name</li>
                                <li className="list-group-item col-sm-3 px-3 border-0">Location</li>
                                <li className="list-group-item col-sm-1 px-0 border-0">Supplier</li>
                                <li className="list-group-item col-sm-1 px-1 mx-4 border-0 text-center">Target Date</li>
                                <li className="list-group-item col-sm-2 px-5 mx-2 border-0">Status</li>
                                <li className="list-group-item col-sm-1 border-0"></li>
                            </ul>
                    }

                    {
                        role === 2 && showAdHoc === true &&
                            <ul className="list-group list-group-horizontal">
                                <li className="list-group-item col-sm-1 px-3 mx-2 border-0">PR No.</li>
                                <li className="list-group-item col-sm-1 px-1 border-0">Date</li>
                                <li className="list-group-item col-sm-1 px-1 mx-4 border-0 text-center">Target Date</li>
                                <li className="list-group-item col-sm-2 px-5 mx-2 border-0">Status</li>
                                <li className="list-group-item col-sm-1 border-0"></li>
                            </ul>
                    }

                    {
                        role === 1 && showAdHoc === true &&
                            <ul className="list-group list-group-horizontal">
                                <li className="list-group-item col-sm-1 px-3 mx-2 border-0">PR No.</li>
                                <li className="list-group-item col-sm-1 px-1 border-0">Date</li>
                                <li className="list-group-item col-sm-1 px-1 ms-4 border-0">Name</li>
                                <li className="list-group-item col-sm-1 px-1 mx-4 border-0 text-center">Target Date</li>
                                <li className="list-group-item col-sm-2 px-5 mx-2 border-0">Status</li>
                                <li className="list-group-item col-sm-1 border-0"></li>
                            </ul>
                    }
                    
                    <hr/>
                </div>
            </div>
            

            <div className={styles.prData}>
                {
                    showAdHoc === false &&
                        <div>{PRResults}</div>
                }

                {
                    showAdHoc === true &&
                        <div>{AdHocResults}</div>
                }
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
};