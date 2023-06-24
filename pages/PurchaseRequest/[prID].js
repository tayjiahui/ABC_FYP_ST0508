import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from 'next/image';
import moment from 'moment';

import styles from '../../styles/viewPR.module.css';

// Image
import arrowIcon from '../../public/arrowIcon.svg';
import pendingCircle from '../../public/yellowPendingCircle.svg';
import approvedCircle from '../../public/greenApprovedCircle.svg';
import rejectedCircle from '../../public/redRejectedCircle.svg';

import axios from "axios";

// Base urls
const URL = [];

function isLocalhost (){
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
};

isLocalhost();

const baseUrl = URL[0];

function ItemLines (props){
    return(
        <div className={styles.productLines}>
            <div className={styles.plRow}>
                <div className={styles.plItemRow}>
                    <div>
                        <p className={styles.plItemNo}>{props.ItemNo}</p>
                    </div>
                    <div>
                        <p className={styles.plItemName}>{props.ItemName}</p>
                    </div>
                    <div>
                        <p className={styles.plQty}>{props.Qty}</p>
                    </div>
                    <div>
                        <p className={styles.plUnitPrice}>{props.UnitPrice}</p>
                    </div>
                    <div>
                        <p className={styles.plTotalUP}>{props.TotalUnitPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export async function getServerSideProps(context){
    const host = context.req.headers.host;
    // console.log(host);
    
    const backBaseURL = [];

    if(host == 'localhost:5000'){
        backBaseURL.push('http://localhost:3000');
    }
    else{
        backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
    }
    
    const { params } = context;
    const { prID } = params;

    const response1 = await fetch(`${backBaseURL}/api/purchaseReq/PR/${prID}`);
    const response2 = await fetch(`${backBaseURL}/api/purchaseReq/lineItem/${prID}`);

    const data1 = await response1.json();
    const data2 = await response2.json();

    // show in terminal
    // console.log(data1);
    // console.log(data2);

    // filter out duplicated data & combine multiple locations
    // data1.forEach((item, index) => {
    //     if(index > 0){
    //         data1[0].branchName += `, ${item.branchName}`;
    //     }
    // });

    return { 
        props:{
            host,
            prDetails: data1,
            pLDetails: data2,
            prID
        }
    }
}

export default function Supplier({prDetails, pLDetails}) {
    const router = useRouter();

    const prID = router.query.prID;

    const [id, setUserID] = useState();
    const [role, setRoleID] = useState();

    const [Circle,testCircle] = useState();

    const [TargetDeliveryDate, setTargetDate] = useState();

    const [ProductDetails, setList] = useState();

    const [Subtotal, subtotalCal] = useState();
    const [GST, gstCal] = useState();
    const [Total, totalCal] = useState();

    const [checkRemark, setRemark] = useState(false);
    const [checkApprComment, setComment] = useState(false);

    const [ApprComment, setApprComment] = useState();

    const [isAdmin, setAdmin] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isRejected, setIsRejected] = useState(false);

    // PR Details  
    const PR = prDetails[0];

    console.log(PR)
    
    useEffect(() => {
        // set user id taken from localstorage
        const userID = parseInt(localStorage.getItem("ID"), 10);
        setUserID(userID);

        // set user role
        const roleID = parseInt(localStorage.getItem("roleID"), 10);
        setRoleID(roleID);

        
        // check if admin/ approver
        if(roleID === 1){
            setAdmin(true);
        }

        // Test for status Circle
        const statusID = PR.prStatusID;

        function circleTest(statusID){
            if(statusID == 1){
                setIsPending(true);
                return '/yellowPendingCircle.svg';
            }
            else if(statusID == 2){
                setIsApproved(true);
                return '/greenApprovedCircle.svg';
            }
            else if(statusID == 3){
                setIsRejected(true);
                return '/redRejectedCircle.svg';
            }
            else{
                return '/yellowPendingCircle.svg';
            }
        }

        const circle = circleTest(statusID);
        testCircle(circle);

        // Target Delivery Date formatting
        const newDateFormat = moment(PR.targetDeliveryDate).format('DD/MM/YYYY');
        setTargetDate(newDateFormat);

        // Product lines
        const itemLines = [];
        const totalPrices = [];

        pLDetails.forEach((item, index) => {
            itemLines.push(
                <div key={index}>
                    <ItemLines
                        ItemNo={index + 1}
                        ItemName={item.itemName}
                        Qty={item.quantity}
                        UnitPrice={item.unitPrice}
                        TotalUnitPrice={item.totalUnitPrice}/>
                </div>
            );

            totalPrices.push(item.totalUnitPrice);
        });

        setList(itemLines);

        // Calculate Total
        function CalculateTotal(array){
            let total = 0;
            for(let i = 0; i < array.length; i++){
                let num = +array[i]
                total = total + num
            }

            return total;
        }            
        
        // Calculate GST
        function GSTFinder(amt){
            const gst = (8/100)*amt;
            return gst;
        }
                
        const totalArr = [];

        // Find subtotal
        const subtotal = CalculateTotal(totalPrices);
        subtotalCal(subtotal.toFixed(2));

        // Find GST
        const gst = GSTFinder(subtotal);
        gstCal(gst.toFixed(2));

        // push values into totalArr
        totalArr.push(subtotal, gst);

        // Calculate final total
        const total = CalculateTotal(totalArr).toFixed(2);
        totalCal(total);

        // check if there is remarks
        if(PR.remarks !== "" && PR.remarks !== null){
            setRemark(true);
        };

        // check if there is approver comment
        if(PR.apprRemarks !== "" && PR.apprRemarks !== null){
            setComment(true);
        };

    }, []);

    const submitApproval = async(e) => {
        e.preventDefault();

        if(ApprComment !== ""){
            await axios.put(`${baseUrl}/api/purchaseReq/PR/${prID}`,
                {
                    "comments": ApprComment,
                    "prStatusID": 2
                }
            )
            .then((response) => {
                alert(`Purchase Request #${prID} has been Approved!`);
                router.push('/PurchaseRequest');
            })
            .catch((err) => {
                console.log(err);
            })
        }
        else{
            await axios.put(`${baseUrl}/api/purchaseReq/PR/${prID}`,
                {
                    "prStatusID": 2
                }
            )
            .then((response) => {
                alert(`Purchase Request #${prID} has been Approved!`);
                router.push('/PurchaseRequest');
            })
            .catch((err) => {
                console.log(err);
            })
        }
    };

    const submitDeny = async(e) => {
        e.preventDefault();

        if(ApprComment !== ""){
            await axios.put(`${baseUrl}/api/purchaseReq/PR/${prID}`,
                {
                    "comments": ApprComment,
                    "prStatusID": 3
                }
            )
            .then((response) => {
                alert(`Purchase Request #${prID} has been Denied!`);
                router.push('/PurchaseRequest');
            })
            .catch((err) => {
                console.log(err);
            })
        }
        else{
            await axios.put(`${baseUrl}/api/purchaseReq/PR/${prID}`,
                {
                    "prStatusID": 3
                }
            )
            .then((response) => {
                alert(`Purchase Request #${prID} has been Denied!`);
                router.push('/PurchaseRequest');
            })
            .catch((err) => {
                console.log(err);
            })
        }

    };

    const convertToPO = async(e) => {
        e.preventDefault();
        
    };

    return (
        <>
            <div className="pb-5">
                <div className="headerRow">
                    <div>
                        <h1>
                            <a href={"/PurchaseRequest"}>
                                <Image src={arrowIcon} id={styles.arrow} alt="Back"/> 
                            </a>
                            Purchase Request #{prID}
                            <Image src={Circle} alt="PR Status" width={25} height={25} className={styles.statusCircle}/>
                        </h1>
                    </div>
                </div>

                <div className={styles.prDetails}>
                    <div className="py-3">
                        <h4>Target Delivery Date</h4>
                        <p>{TargetDeliveryDate}</p>
                    </div>
                    
                    <div className={styles.viewRow}>
                        <div className="py-3">
                            <div className={styles.viewCol}>
                                <h4>Name</h4>
                                <p>{PR.name}</p>
                            </div>
                            <div className={styles.viewCol}>
                                <h4>Supplier</h4>
                                <p>{PR.supplierName}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.viewRow}>
                        <div className="py-3">
                            <div className={styles.viewCol}>
                                <h4>Location</h4>
                                <p>{PR.branchName}</p>
                            </div>
                            <div className={styles.viewCol}>
                                <h4>Payment Mode</h4>
                                <p>{PR.paymentMode}</p>
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
                        {ProductDetails}
                    </div>
                    <div>
                        <hr/>
                        <div className={styles.totalRow}>
                            <div className={styles.totalCol1}>
                                <h3 className={styles.priceLabel}>Subtotal</h3>
                            </div>
                            <div className={styles.totalCol2}>
                                <p className={styles.price}>${Subtotal}</p>
                            </div>
                        </div>

                        <div className={styles.totalRow}>
                            <div className={styles.totalCol1}>
                                <h3 className={styles.priceLabel}>GST 8%</h3>
                            </div>
                            <div className={styles.totalCol2}>
                                <p className={styles.price}>${GST}</p>
                            </div>
                        </div>

                        <hr id={styles.totalLine}/>

                        <div className={styles.totalRow}>
                            <div className={styles.totalCol1}>
                                <h2 className={styles.priceLabel}>Total</h2>
                            </div>
                            <div className={styles.totalCol2}>
                                <p className={styles.totalprice}>${Total}</p>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            
                <div className={styles.prDetails}>
                    {
                        checkRemark && 
                            <div className="pt-3">
                                <h4>Remarks</h4>
                                <p>{PR.remarks}</p>
                            </div>
                    }
                </div>

                <div className="px-5">
                    <hr className={styles.endLine}/>
                </div>

                <div>
                    {
                        isPending && isAdmin &&
                            <div>
                                <div className="px-5 mx-5 pb-5 pt-2">
                                    <h2>Approve Purchase Request?</h2>
                                    <form>
                                        <div className="py-3 mb-3">
                                            <p>Comments</p>
                                            <textarea value={ApprComment} onChange={(e) => setApprComment(e.target.value)} className={styles.textArea}></textarea>
                                        </div>
                                        
                                        <div className="py-3">
                                            <div className={styles.apprButtons}>
                                                <button onClick={submitDeny} className={styles.denyButton}>Deny</button>
                                                <div className={styles.divider}></div>
                                                <button onClick={submitApproval} className={styles.approveButton}>Approve</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                    }
                </div>

                <div>
                    {
                        checkApprComment &&
                            <div className="px-5 mx-5 pb-5 pt-2">
                                <div>
                                    {
                                        isRejected &&
                                            <h2>Purchase Request #{prID} has been <b className={styles.rejectedB}>Rejected</b>!</h2>
                                    }
                                    {
                                        isApproved &&
                                            <h2>Purchase Request #{prID} has been <b className={styles.approvedB}>Approved</b>!</h2>
                                    }
                                    <div className="pt-5">
                                        <h4>Approver's Comments</h4>
                                        <div className="py-3 w-70">
                                            <div className={styles.apprCommentsBox}>
                                                <div className="px-4 py-5">
                                                    <p>{PR.apprRemarks}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>

                <div>
                    {
                        isApproved &&
                            <div>
                                <div className="px-5 mx-5 py-5">
                                    <div className={styles.createPO}>
                                        <button onClick={convertToPO} className={styles.createPOButton}>Convert To Purchase Order</button>
                                    </div>
                                </div>
                            </div>
                    }
                </div>

                <div>        
                    {
                        isRejected &&
                            <div>
                                <div className="px-5 py-3 mx-5 mb-5">
                                    <div className={styles.reappealPR}>
                                        <button className={styles.reappealPRButton}>Reappeal Purchase Order</button>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}