import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
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

function getSelectedOption(e){
    const selectedValue = e.target.value;
    const selectedOption = Array.from(e.target.list.options).find((option) => option.value === selectedValue);
    const selectedID = selectedOption ? selectedOption.getAttribute('id') : '';

    return [selectedValue, selectedID]
}

export default function Supplier() {
    const { data: session} = useSession();
    const router = useRouter();


    // dropdown lists states
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
    }, []);

    // add location input box
    const [LocationsList, setLocations] = useState([{ location: '', id: ''}]);
    const addLocInput = () => {
        setLocations([...LocationsList, {location: '', id: ''}])
    };

    // handle each location input
    const handleLocationChange = (index, e) => {
        const [location, id] = getSelectedOption(e);

        let data = [...LocationsList];

        data[index].location = location;
        data[index].id = id

        setLocations(data);
    };

    // add item line inputs // currently only max 5 items
    const [ItemLineList, SetItemLineList] = useState([{id:'', ItemNo: '', ItemName: '', ItemQty: '', UnitPrice: '', TotalUnitPrice: ''}]);
    const addItemLine = () => {
        // max 5 items
        if(ItemLineList.length < 5){
            SetItemLineList([...ItemLineList, {id:'', ItemNo: '', ItemName: '', ItemQty: '', UnitPrice: '', TotalUnitPrice: ''}]);
        }
    };

    // handle each item change
    const handleItemChange = (index, e) => {
        let data = [...ItemLineList];

        if (e.target.name !== "ItemName"){
            data[index][e.target.name] = e.target.value;
        }
        else{
            const [itemName, id] = getSelectedOption(e);

            data[index].ItemName = itemName;
            data[index].id = id;
        }

        SetItemLineList(data);
    };

    // input states
    const [dateReqV, setDateReq] = useState('');
    const [supplierV, setSupplier] = useState({ value: '', id: '' });
    const [PMV, setPM] = useState({ value: '', id: '' });
    const [Remark, setRemark] = useState('');

    const handleSupplierInput = (e) => {
        const [value, id] = getSelectedOption(e);
        setSupplier({value: value, id: id});
    };

    const handlePMInput = (e) => {
        const [value, id] = getSelectedOption(e);
        setPM({value: value, id: id});
    };

    // axios to create PR
    const createPR = async(e) => {
        e.preventDefault();

        await axios.post(`${baseUrl}/api/purchaseReq/`,
            {
                "targetDeliveryDate": dateReqV,
                "userID": id,
                "supplierID": supplierV.id,
                "paymentModeID": PMV.id,
                "remarks": Remark
            }
        )
        .then((response) => {
            console.log(response);
            console.log(ItemLineList);

            axios.get(`${baseUrl}/api/purchaseReq/latestPRID/${id}`)
            .then((response) => {
                // console.log(response);
                const latestPRID = response.data[0].prID;
                // console.log(latestPRID);

                LocationsList.forEach((item, index) => {
                    axios.post(`${baseUrl}/api/purchaseReq/deliveryLocation`,
                        {
                            "prID": latestPRID,
                            "branchID": item.id
                        }
                    );
                });

                ItemLineList.forEach((item, index) => {
                    axios.post(`${baseUrl}/api/purchaseReq/lineItem`,
                        {
                            "prID": latestPRID,
                            "itemID": item.id,
                            "quantity": item.ItemQty,
                            "totalUnitPrice": item.TotalUnitPrice
                        }
                    );
                });

                alert(response.data);

                // redirect
                router.push('/PurchaseRequest');
            })
        })
        .catch((err) => {
            console.log(err);
        });
    };

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

            <form onSubmit={createPR}>
                <div className={styles.prDetails}>
                    <div className={styles.viewCol}>
                        <h4>Target Delivery Date</h4>
                        <input type="date" value={dateReqV} onChange={(e) => setDateReq(e.target.value)} name="dateReq"></input>
                    </div>
                    
                    <div className={styles.viewRow}>
                        <div className={styles.viewCol}>
                            <h4>Supplier</h4>
                            <input list="suppliers" value={supplierV.value} id={supplierV.id} onChange={handleSupplierInput} name="supplierName"></input>
                            <datalist id="suppliers">
                                {Suppliers}
                            </datalist>
                        </div>

                        <div className={styles.viewCol}>
                            <h4>Payment Mode</h4>
                            <input list="PaymentMode" value={PMV.value} id={PMV.id} onChange={handlePMInput} name="PaymentMode"></input>
                            <datalist id="PaymentMode">
                                {PaymentModes}
                            </datalist>
                        </div>
                    </div>

                    <div className={styles.viewRow}>
                        <div className={styles.viewCol}>
                            <h4>Location</h4>

                            {LocationsList.map((item, index) => {
                                return <div key={index} className={styles.locationInputs}>
                                            <input list="Branch" value={item.location} onChange={(e) => handleLocationChange(index, e)} id={item.id} name="branchLocation"></input>
                                            <datalist id="Branch">
                                                {Locations}
                                            </datalist>
                                        </div>
                            })}

                            <div>
                                <h5 className={styles.addLocationText}>
                                    <button type="button" onClick={addLocInput} className={styles.addLocationButton}>
                                        <Image src={addLocIcon} width={20} height={20} className={styles.addLocIcon}/>
                                    </button>
                                        Add Location
                                </h5>
                            </div>
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
                            {ItemLineList.map((item, index) => {
                                return <div key={index} className={styles.plItemRow}>
                                        <div>
                                            <input type="number" name="ItemNo" id="ItemNo" defaultValue={index + 1} onChange={(e) => handleItemChange(index, e)} className={styles.plItemNo}/>
                                        </div>
                                        <div>
                                            <input list="items" type="text" name="ItemName" id={item.id} value={item.ItemName} onChange={(e) => handleItemChange(index, e)} className={styles.plItemName}/>
                                            <datalist id="items">
                                                {Items}
                                            </datalist>  
                                        </div>
                                        <div>
                                            <input  type="number" name="ItemQty" id="ItemQty" value={item.ItemQty} onChange={(e) => handleItemChange(index, e)} className={styles.plQty}/>
                                        </div>
                                        <div>
                                            <input  type="number" name="UnitPrice" id="UnitPrice" value={item.UnitPrice} onChange={(e) => handleItemChange(index, e)} className={styles.plUnitPrice}/>
                                        </div>
                                        <div>
                                            <input  type="number" name="TotalUnitPrice" id="TotalUnitPrice" value={item.TotalUnitPrice} onChange={(e) => handleItemChange(index, e)} className={styles.plTotalUP}/>
                                        </div>
                                        <div>
                                            <button type="button" onClick={addItemLine} className={styles.createButton}>
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
                    <button type="submit" className={styles.submitButton}>Submit</button>
                </div>
            </form>
            
        </>
    )
}