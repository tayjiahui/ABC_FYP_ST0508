import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from 'next/image';

import styles from '../../../styles/viewPR.module.css';

// Image
import arrowIcon from '../../../public/arrowIcon.svg';
import pendingCircle from '../../../public/yellowPendingCircle.svg';
import approvedCircle from '../../../public/greenApprovedCircle.svg';
import rejectedCircle from '../../../public/redRejectedCircle.svg';

import axios from "axios";

function isLocalhost(url) 
{
    return url.includes('localhost') || url.includes('127.0.0.1');
}

// const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// const baseUrl = API_URL;
const baseUrl = 'http://localhost:3000';
const baseURL = 'http://localhost:5000';

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

export default function Supplier() {
    const router = useRouter();

    const prID = router.query.prID;

    const [Circle,testCircle] = useState();

    const [DateRequest, dateReqRes] = useState();
    const [Name, nameRes] = useState();
    const [Supplier, supplierRes] = useState();
    const [Location, locationRes] = useState();
    const [PaymentMode, paymentModeRes] = useState();
    const [Remarks, remarksRes] = useState();

    const [ProductDetails, setList] = useState();

    const [Subtotal, subtotalCal] = useState();
    const [GST, gstCal] = useState();
    const [Total, totalCal] = useState();

    useEffect(() => {
        axios.all([
            axios.get(`${baseUrl}/api/purchaseReq/PR/${prID}`, {}),
            axios.get(`${baseUrl}/api/purchaseReq/lineItem/${prID}`, {})
        ])
        .then(axios.spread((response1, response2) => {
            // console.log(response1.data);
            // console.log(response2.data);
            // console.log(response1.data[0]);

            // Test for statuts Circle
            const statusID = response1.data[0].prStatusID;

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
            testCircle(circle);

            // Get PR Details
            const prDetails = response1.data[0];

            dateReqRes(prDetails.requestDate);
            nameRes(prDetails.name);
            supplierRes(prDetails.supplierName);
            locationRes(prDetails.branchName);
            paymentModeRes(prDetails.paymentMode);
            remarksRes(prDetails.remarks);

            const PD = response2.data;
            const itemLines = [];
            const totalPrices = [];

            PD.forEach((item, index) => {
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
            
            function GSTFinder(amt){
                const gst = (8/100)*amt;
                return gst;
            }
            
            const totalArr = [];

            const subtotal = CalculateTotal(totalPrices);
            subtotalCal(subtotal.toFixed(2));

            const gst = GSTFinder(subtotal);
            gstCal(gst.toFixed(2));

            totalArr.push(subtotal, gst);

            const total = CalculateTotal(totalArr).toFixed(2);
            totalCal(total);

        }))
        .catch((err) => {
            console.log(err);
        })
    })

    return (
        <>
            <div className="headerRow">
                <h1>
                    <a href={baseURL + "/PurchaseRequest"}>
                        <Image src={arrowIcon} id={styles.arrow} /> 
                    </a>
                    Purchase Request #{prID}
                    <Image src={Circle} width={25} height={25} className={styles.statusCircle}/>
                </h1>
            </div>

            <div className={styles.prDetails}>
                <div>
                    <h4>Date Request</h4>
                    <p>{DateRequest}</p>
                </div>
                
                <div className={styles.viewRow}>
                    <div className={styles.viewCol}>
                        <h4>Name</h4>
                        <p>{Name}</p>
                    </div>
                    <div className={styles.viewCol}>
                        <h4>Supplier</h4>
                        <p>{Supplier}</p>
                    </div>
                </div>

                <div className={styles.viewRow}>
                    <div className={styles.viewCol}>
                        <h4>Location</h4>
                        <p>{Location}</p>
                    </div>
                    <div className={styles.viewCol}>
                        <h4>Payment Mode</h4>
                        <p>{PaymentMode}</p>
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
                <h4>Remarks</h4>
                <p>{Remarks}</p>
            </div>
        </>
    )
}