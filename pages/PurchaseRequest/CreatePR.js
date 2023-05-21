import { useEffect, useState } from "react";
import Image from 'next/image';

import styles from '../../styles/createPR.module.css';

// Image
import arrowIcon from '../../public/arrowIcon.svg';
import addLocIcon from '../../public/addLocationIcon.svg';
import addIcon from '../../public/plusIcon.svg';

import axios from "axios";

// Base urls
const URL = [];

function isLocalhost() 
{
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        // console.log('hostname   ' + hostname);
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

const id = 2;

function DropdownOpt (props){
    return(
        <>
            <option id={props.ID} value={props.Value}/>
        </>
    )
}

export default function Supplier() {

    const [Suppliers,supplierList] = useState();
    const [Locations, locationList] = useState();
    const [PaymentModes, pmList] = useState();
    const [Items, itemList] = useState();

    // get drop down list
    useEffect(() => {
        axios.all([
            axios.get(`${baseUrl}/api/supplier/all`,{}),
            axios.get(`${baseUrl}/api/purchaseReq/branch/all`,{}),
            axios.get(`${baseUrl}/api/purchaseReq/paymentMode/all`,{}),
            axios.get(`${baseUrl}/api/inventory/item/all`,{})
        ])
        .then(axios.spread((response1 ,response2, response3, response4) => {
            // console.log(response1.data[0]);
            // console.log(response2.data[0]);
            // console.log(response3.data[0]);
            // console.log(response4.data[0]);

            // get suppliers
            const supplierResult = response1.data;
            const SList = [];

            supplierResult.forEach((item, index) => {
                SList.push(
                    <div key={index}>
                        <DropdownOpt 
                        ID={item.supplierID}
                        Value={item.supplierName}/>
                    </div>
                    
                )
            });
            supplierList(SList);

            // get Locations
            const locationResult = response2.data;
            const LList = [];

            locationResult.forEach((item, index) => {
                LList.push(
                    <div key={index}>
                        <DropdownOpt
                            ID={item.branchID}
                            Value={item.branchName}/>
                    </div>
                )
            });
            locationList(LList);

            // get payment modes
            const PMResult = response3.data;
            const PMList = [];

            PMResult.forEach((item, index) => {
                PMList.push(
                    <div key={index}>
                        <DropdownOpt
                            ID={item.paymentModeID}
                            Value={item.paymentMode}/>
                    </div>
                )
            });
            pmList(PMList);

            // get items
            const ItemResult = response4.data;
            const IList = [];

            ItemResult.forEach((item, index) => {
                IList.push(
                    <div key={index}>
                        <DropdownOpt
                            ID={item.itemID}
                            Value={item.itemName}/>
                    </div>
                )
            });
            itemList(IList);
        }))
        .catch((err) => {
            console.log(err);
            alert(err);
        })
    }, [])

    const [LocationsList, setLocations] = useState([{location: ""}]);
    const addLocInput = () => {
        setLocations([...LocationsList, {location: ""}])
    }


    const [ItemLineList, SetItemLineList] = useState([{ItemNo: "", ItemName: "", ItemQty: "", UnitPrice: "", TotalUnitPrice: ""}]);

    const addItemLine = () => {
        if(ItemLineList.length < 5){
            SetItemLineList([...ItemLineList, {ItemNo: "", ItemName: "", ItemQty: "", UnitPrice: "", TotalUnitPrice: ""}]);
        }
    };

    const [dateReqV, setDateReq] = useState('');
    const [supplierV, setSupplier] = useState('');
    const [branchV, setBranch] = useState('');
    const [PMV, setPM] = useState('');
    const [Remark, setRemark] = useState('');

    const [itemNameV, setItem] = useState('');
    const [itemQtyV, setQty] = useState('');
    const [itemUPV, setUnitPrice] = useState('');
    const [totalUPV, setTotalUP] = useState('');

    console.log(dateReqV)
    console.log(branchV);
    console.log(itemNameV)

    const submitPR = async(e) => {
        e.preventDefault();

        axios.all([
            axios.post(`${baseUrl}/api/purchaseReq/`,
                {
                    "requestDate": dateReqV,
                    "userID": id,
                    "supplierID": supplierV,
                    "paymentModeID": PMV,
                    "branchID": branchV,
                    "remarks": Remark
                }
            ),
            axios.post(`${baseUrl}/api/purchaseReq/lineItem`,
                {
                    "prID": 2,
                    "itemID": 3,
                    "quantity": 5,
                    "totalUnitPrice": 8
                }
            )
        ])
    }


    return (
        <>

            <div className="headerRow">
                <h1>
                    <a href={"/PurchaseRequest"}>
                        <Image src={arrowIcon} id={styles.arrow} /> 
                    </a>
                    Create Purchase Request
                </h1>
            </div>

            <div className={styles.prDetails}>
                <div className={styles.viewCol}>
                    <h4>Date Request</h4>
                    <input type="date" value={dateReqV} onChange={(e) => setDateReq(e.target.value)} name="dateReq"></input>
                </div>
                
                <div className={styles.viewRow}>
                    <div className={styles.viewCol}>
                        <h4>Supplier</h4>
                        <input list="suppliers" value={supplierV} onChange={(e) => setSupplier(e.target.value)} name="supplierName"></input>
                        <datalist id="suppliers">
                            {Suppliers}
                        </datalist>
                    </div>

                    <div className={styles.viewCol}>
                        <h4>Location</h4>
                        {LocationsList.map((item, index) => {
                            return <div key={index}>
                                        <input list="Branch" value={branchV} onChange={(e) => {console.log(e); setBranch(e.target.value)}} id="location" name="branchLocation"></input>
                                        <datalist id="Branch">
                                            {Locations}
                                        </datalist>

                                        <div>
                                            <h5 className={styles.addLocationText}>
                                                <button onClick={addLocInput} className={styles.addLocationButton}>
                                                    <Image src={addLocIcon} width={20} height={20} className={styles.addLocIcon}/>
                                                </button>
                                                Add Location
                                            </h5>
                                        </div>
                                    </div>
                        })}
                        
                        
                    </div>
                </div>

                <div className={styles.viewRow}>
                    <div className={styles.viewCol}>
                        <h4>Payment Mode</h4>
                        <input list="PaymentMode" value={PMV} onChange={(e) => setPM(e.target.value)} name="PaymentMode"></input>
                        <datalist id="PaymentMode">
                            {PaymentModes}
                        </datalist>
                    </div>
                </div>
            </div>

            <div className={styles.productDetails}>
                <div className={styles.pDTop}>
                    <h4>Product Details</h4>
                    <hr/>
                    <ul className={styles.itemLabel}>
                        <li className={styles.itemNo}>Item No.</li>
                        <li className={styles.itemName}>Item</li>
                        <li className={styles.itemQty}>Quantity</li>
                        <li className={styles.itemUP}>Unit Price</li>
                        <li className={styles.itemTotalUP}>Total Unit Price</li>
                    </ul>
                    <hr/>
                </div>
                <div>
                    <div className={styles.productLines}>
                        <div className={styles.plRow}>
                        {ItemLineList.map((singleItem, index) => {
                            return <div key={index} className={styles.plItemRow}>
                                    <div>
                                        <input type="number" name="ItemNo" id="ItemNo"  value={index + 1} className={styles.plItemNo}/>
                                    </div>
                                    <div>
                                        <input list="items" type="text" name="ItemName" id="ItemName" value={itemNameV} onChange={(e) => setItem(e.target.value)} className={styles.plItemName}/>
                                        <datalist id="items">
                                            {Items}
                                        </datalist>  
                                    </div>
                                    <div>
                                        <input  type="number" name="ItemQty" id="ItemQty" value={itemQtyV} onChange={(e) => setQty(e.target.value)} className={styles.plQty}/>
                                    </div>
                                    <div>
                                        <input  type="number" name="UnitPrice" id="UnitPrice" value={itemUPV} onChange={(e) => setUnitPrice(e.target.value)} className={styles.plUnitPrice}/>
                                    </div>
                                    <div>
                                        <input  type="number" name="TotalUnitPrice" id="TotalUnitPrice" value={totalUPV} onChange={(e) => setTotalUP(e.target.value)} className={styles.plTotalUP}/>
                                    </div>
                                    <div>
                                        <button onClick={addItemLine} className={styles.createButton}>
                                            <Image src={addIcon} alt='Plus Icon' width={25} height={25} className={styles.addIcon}/>
                                        </button>
                                    </div>
                                </div>
                          
                        })}
                        </div>
                       
                    </div>
                </div>
            </div>
            
            <div className={styles.remarksTestArea}>
                <h4>Remarks</h4>
                <textarea value={Remark} onChange={(e) => setRemark(e.target.value)} className={styles.textArea}></textarea>
            </div>

            <div className={styles.submit}>
                <input type="submit"  onClick={submitPR} className={styles.submitButton}/>
            </div>
        </>
    )
}