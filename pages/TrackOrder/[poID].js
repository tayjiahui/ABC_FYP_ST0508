import Link from 'next/link'
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from 'next/image';
import arrowIcon from '../../public/arrowIcon.svg';
import plusIcon from '../../public/addLocationIcon.svg';
// import greenCircle from '../../public/greenApprovedCircle.svg'
import styles from '../../styles/trackOrderById.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

//----------------------function name has to be uppercase


function ItemLines(props) {
    return (
        <div className={styles.productLines}>
            <div className={styles.plRow}>
                <div className={styles.plItemRow}>
                    <div className={styles.newRow1}>
                        <h5 className={styles.plItemNo}>{props.ItemNo}</h5>
                    </div>
                    <div className={styles.newRow2}>
                        <h5 className={styles.plItemName}>{props.ItemName}</h5>
                    </div>
                    <div className={styles.newRow3}>
                        <h5 className={styles.plQty}>{props.Qty}</h5>
                    </div>
                    <div className={styles.newRow4}>
                        <h5 className={styles.plUnitPrice}>{props.UnitPrice}</h5>
                    </div>
                    <div className={styles.newRow5}>
                        <h5 className={styles.plTotalUP}>{props.TotalUnitPrice}</h5>
                    </div>
                    <div className={styles.numReceived}>
                        <input type="text" id={styles.noRecInfo}></input><br></br>
                        {/* <input type="text" id={styles.noRecInfo2}></input> */}
                    </div>
                </div>

            </div>

        </div>
    )
};

// get backend 
export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    // console.log(host);

    const backBaseURL = [];

    if (host == 'localhost:5000') {
        backBaseURL.push('http://localhost:3000');
    }
    else {
        backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
    }

    const { params } = context;
    const { poID } = params;

    const poD = await fetch(`${backBaseURL}/api/trackOrder/purchaseOrderDetails/${poID}`);
    const productD = await fetch(`${backBaseURL}/api/trackOrder/productDetails/${poID}`);

    const data1 = await poD.json();
    const data2 = await productD.json();

    console.log(data1);
    console.log(data2);


    // filter out duplicated data & combine multiple locations
    data1.forEach((item, index) => {
        if (index > 0) {
            data1[0].branchName += `, ${item.branchName}`;
        }
    });

    return {
        props: {
            host,
            purOrderD: data1,
            productDeets: data2,
            poID
        }
    }
}

// main frontend page
export default function Main({ purOrderD, productDeets }) {
    const router = useRouter();

    const poID = router.query.poID;

    // const [Circle, testCircle] = useState();

    // const [DateRequest, setDateRequest] = useState();
    const [TargetDeliveryDate, setTargetDate] = useState();

    const [ProductDetails, setList] = useState();

    const [Subtotal, subtotalCal] = useState();
    const [GST, gstCal] = useState();
    const [Total, totalCal] = useState();

    const [checkRemark, setRemark] = useState();

    // PR Details  
    const PR = purOrderD[0];
    console.log("pr detais", PR)


    useEffect(() => {

        // // Test for status Circle
        // const statusID = PR.prStatusID;

        // function circleTest(statusID) {
        //     if (statusID == 1) {
        //         return '/yellowPendingCircle.svg';
        //     }
        //     else if (statusID == 2) {
        //         return '/greenApprovedCircle.svg';
        //     }
        //     else if (statusID == 3) {
        //         return '/redRejectedCircle.svg';
        //     }
        //     else {
        //         return '/yellowPendingCircle.svg';
        //     }
        // }

        // const circle = circleTest(statusID);
        // testCircle(circle);

        // Target Delivery Date formatting
        const newDateFormat = moment(PR.targetDeliveryDate).format('DD/MM/YYYY');
        setTargetDate(newDateFormat);

        console.log(productDeets)

        // Product lines
        const itemLines = [];
        const totalPrices = [];

        productDeets.forEach((item, index) => {
            itemLines.push(
                <div key={index}>
                    <ItemLines
                        ItemNo={index + 1}
                        ItemName={item.itemName}
                        Qty={item.quantity}
                        UnitPrice={item.unitPrice}
                        TotalUnitPrice={item.totalUnitPrice} />
                </div>
            );

            totalPrices.push(item.totalUnitPrice);
        });

        setList(itemLines);

        // Calculate Total
        function CalculateTotal(array) {
            let total = 0;
            for (let i = 0; i < array.length; i++) {
                let num = +array[i]
                total = total + num
            }

            return total;
        }

        // Calculate GST
        function GSTFinder(amt) {
            const gst = (8 / 100) * amt;
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
        // if (PR.remarks !== "") {
        //     setRemark(true)
        // }
        // else {
        //     setRemark(false)
        // }

    }, []);
    return (
        <div>
            <h1 className='firstHeaderTop'>
                <a href={"/TrackOrder"} className='purchaseOrderNo'>
                    <Image src={arrowIcon} id={styles.arrow} alt="Back" />
                </a>Purchase Order #{poID}
                {/* <Image src={greenCircle} id={styles.greenCircle} alt="greencircle" /> */}
            </h1>

            <div className='secondDiv'>
                <h3 className={styles.h3header}>Purchase Order Details</h3>
                <div className={styles.lineContainer}>
                    <hr className={styles.lineDivider}></hr>
                </div>


                <h5 className={styles.dateRequest}>Date Request</h5>
                <h7 className={styles.dateInfo}>{PR.requestDate}</h7><br></br>

                <div className={styles.info1}>
                    <div className={styles.nameCol}>
                        <h5 className={styles.name}>Name</h5>
                        <h7 className={styles.nameInfo}>{PR.name}</h7>
                    </div>

                    <div className={styles.supCol}>
                        <h5 className={styles.supplier}>Supplier</h5>
                        <h7 className={styles.supInfo}>{PR.supplierName}</h7>
                    </div>

                </div><br></br>

                <div className={styles.info2}>
                    <div className={styles.locCol}>
                        <h5 className={styles.location}>Location</h5>
                        <h7 className={styles.locInfo}>{PR.branchName}</h7><br></br>
                        {/* <h7 className={styles.locInfo}>Takashimaya</h7> */}
                    </div><br></br>

                    <div className={styles.payCol}>
                        <h5 className={styles.payMode}>Payment Mode</h5>
                        <h7 className={styles.payModeInfo}>{PR.paymentMode}</h7>
                    </div>

                </div>


                <div className={styles.box}>
                    <h5 className={styles.prodDetails}>Product Details</h5>

                    <div className={styles.lineContainer}>
                        <hr className={styles.lineDivider}></hr>
                    </div>

                    <div className={styles.prodDetailsHeader}>
                        <div className={styles.itemNo}>
                            <h5 className={styles.itemNoInfo}>Item No.</h5>
                        </div>

                        <div className={styles.description}>
                            <h5 className={styles.desInfo}>Description</h5>
                        </div>

                        <div className={styles.quantity}>
                            <h5 className={styles.quanInfo}>Quantity</h5>
                        </div>

                        <div className={styles.unitPrice}>
                            <h5 className={styles.uPriceInfo}>Unit Price</h5>
                        </div>

                        <div className={styles.totalUPrice}>
                            <h5 className={styles.totalInfo}>Total Unit Price</h5>
                        </div>

                        <div className={styles.noReceived}>
                            <h5 className={styles.RecInfo}>No. Received</h5>
                        </div>


                    </div>
                    <div className={styles.lineContainer}>
                        <hr className={styles.lineDivider}></hr>
                    </div>

                    <div className={styles.hello}>
                        <div className={styles.important}>
                            {ProductDetails}
                        </div>
                    </div>



                    <div className={styles.lineContainer}>
                        <hr className={styles.lineDivider}></hr>
                    </div>

                </div>


                <div className={styles.totalRow}>
                    {/* <hr /> */}
                    <div className={styles.row1}>
                        <div className={styles.totalCol1}>
                            <h3 className={styles.priceLabel1}>Subtotal</h3>
                        </div>
                        <div className={styles.totalCol1}>
                            <p className={styles.price1}>${Subtotal}</p>
                        </div>
                    </div>

                    <div className={styles.row2}>
                        <div className={styles.totalCol2}>
                            <h3 className={styles.priceLabel2}>GST 8%</h3>
                        </div>
                        <div className={styles.totalCol2}>
                            <p className={styles.price2}>${GST}</p>
                        </div>
                    </div>

                    {/* <hr id={styles.totalLine} /> */}

                    <div className={styles.lineContainer2}>
                        <hr className={styles.lineDivider2}></hr>
                    </div>

                    <div className={styles.totalRow3}>
                        <div className={styles.totalCol3}>
                            <h2 className={styles.priceLabel3}>Total</h2>
                        </div>
                        <div className={styles.totalCol3}>
                            <p className={styles.totalprice3}>${Total}</p>
                        </div>
                    </div>

                </div>


                <br></br>
                <br></br>
                <div className={styles.remarks}>

                    <div>
                        <h5 className={styles.remarksTitle}>Remarks</h5>
                        <h7 className={styles.details}>{PR.remarks}</h7>
                    </div>



                </div>

                <br></br>
                <br></br>
                <h3 className={styles.status}>Purchase & Payment Status</h3>
                <div className={styles.lineContainer}>
                    <hr className={styles.lineDivider}></hr>
                </div>

                <br></br>


                <div className={styles.statusInfo}>

                    <div className={styles.container1}>
                        <label for="payStatus" id={styles.payStatus}>Payment Status</label><br></br>

                        <select name="status" id={styles.words1}>
                            <option value="pending">Pending</option>
                            <option value="sent">Payment Sent</option>
                            <option value="received">Payment Received</option>
                            <option value="create">Create New Status</option>
                        </select>
                    </div>

                    <div className={styles.container2}>
                        <label for="payStatus" id={styles.purStatus}>Purchase Status</label><br></br>

                        <select name="status" id={styles.words2}>
                            <option value="acceptO">Accept Order</option>
                            <option value="preparingO">Preparing Order</option>
                            <option value="preparingD">Preparing Delivery</option>
                            <option value="shipping">Shipping Item</option>
                            <option value="delivered">Item Delivered</option>
                        </select>
                    </div>
                </div>

                <div className={styles.uploadR}>Upload Receipt</div>

                <h3 className={styles.files}>Upload Invoice & Delivery Orders</h3>
                <div className={styles.lineContainer}>
                    <hr className={styles.lineDivider}></hr>
                </div>

                <div className={styles.filesSub}>
                    <div className={styles.invoice}>
                        <h5 className={styles.invoiceText}>Upload Invoice</h5><br></br>


                    </div>


                    <div className={styles.do}>
                        <h5 className={styles.doText}>Upload Delivery Order</h5><br></br>
                    </div>
                </div>

                <div className={styles.hold}>
                    <div className={styles.borderPlus}>
                        <Image src={plusIcon} className={styles.plusIcon} alt="plus" />
                        <h7 className={styles.add1}>Add Invoice</h7>
                    </div>

                    <div className={styles.borderPlus2}>
                        <Image src={plusIcon} className={styles.plusIcon2} alt="plus" />
                        <h7 className={styles.add2}>Add Delivery Order</h7>
                    </div>
                </div>





            </div>

        </div>

    );
};