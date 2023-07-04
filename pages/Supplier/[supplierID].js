import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// styles & icons
import styles from "../../styles/viewSupplier.module.css";
import arrowIcon from "../../public/arrowIcon.svg";
import editIcon from "../../public/penIcon.svg";
import deleteIcon from "../../public/trashBinIcon.svg";

const URL = [];

function isLocalhost()
{
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        console.log("hostname   " + hostname);
        if (hostname == "localhost") {
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
        }
        else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
            URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
            console.log(URL);
        }
        return URL;
    }
}

isLocalhost();

const baseUrl = 'http://localhost:3000';
const baseURL = 'http://localhost:5000';

console.log(baseUrl, baseURL);

// get backend
export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    const backBaseURL = [];

    if(host == 'localhost:5000') {
        backBaseURL.push('http://localhost:3000');
    }
    else {
        backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
    }
    
    const { params } = context;
    const { supplierID } = params;

    const supplierInfoResponse = await fetch(`${backBaseURL}/api/supplier/${supplierID}`);
    const supplierInfoResults = await supplierInfoResponse.json();
    // console.log("supplier info: " + supplierInfoResults);
                     
    return {
        props: {
            host,
            supplierDetails: supplierInfoResults,
            supplierID
        }
    };
};

// view supplier page
export default function viewSupplier({ supplierDetails }) {

    const router = useRouter();
    const supplierID = router.query.supplierID;
    
    const supplierDetail = supplierDetails[0];
    console.log("supplierID: "+ supplierID);
    // console.log(supplierDetail);

    const [deleteSupplierPop, setDeleteSupplierPop] = useState(false);

    const handleClosePopup = () => {
        setDeleteSupplierPop(false);
    }

    const handleOpenPopup = () => {
        setDeleteSupplierPop(true);
    }

    // handle popup delete button
    const handleConfirmDelete = async(e) => {
        e.preventDefault();

        try {
            const response = await axios.delete(`${baseUrl}/api/supplier/${supplierID}`,{});
            console.log(response.data);
            alert(response.data);
        }
        catch(err) {
            console.log(err);
            alert(err);
        }
        
        setDeleteSupplierPop(false);

        // redirect to supplier main page
        router.push('/Supplier');
    }

    return (
        <>
            <div className={styles.titleRow}>
                <h1>
                    <a href={'/Supplier'}>
                        <Image src={arrowIcon} className={styles.backArrow} alt="Back Arrow" />
                    </a>

                    <p className={styles.title}>{supplierDetail.supplierName}</p>

                    <a href={'/Supplier/UpdateSupplier'}>
                        <Image src={editIcon} className={styles.penIcon} alt="Edit Button" />
                    </a>

                    <Image src={deleteIcon} onClick={handleOpenPopup} className={styles.trashBin} alt="Delete Button" />

                    {deleteSupplierPop && (
                        <div className={styles.popupContainer}>
                            <div className={styles.popupBox}>
                                <h2 className={styles.confirmDeleteText}> Confirm Delete?</h2>
                                <button onClick={handleClosePopup} className={styles.closeButton}>X</button>
                            </div>
                            <div className={styles.buttons}>
                                <button className={styles.cancelButton} onClick={handleClosePopup} >Cancel</button>
                                <button className={styles.deleteButton} onClick={handleConfirmDelete}>Delete</button>
                            </div>
                        </div>
                    )}
                </h1>

                <div className={styles.row}>
                    <div className={styles.col1}>
                        <b className={styles.colTitle}>Supplier Name</b>
                        <p className={styles.colData}>{supplierDetail.supplierName}</p>

                        <b className={styles.colTitle}>Email</b>
                        <p className={styles.colData}>{supplierDetail.email}</p>

                        <b className={styles.colTitle}>Office Number</b>
                        <p className={styles.colData}>{supplierDetail.officeNum}</p>

                        <b className={styles.colTitle}>Web Address</b>
                        <p className={styles.colData}>{supplierDetail.webAddress}</p>

                        <b className={styles.colTitle}>Bank Account Name</b>
                        <p className={styles.colData}>{supplierDetail.bankAccName}</p>

                        <b className={styles.colTitle}>Category</b>
                        <p className={styles.colData}>{supplierDetail.Category}</p>
                    </div>

                    <div className={styles.col2}>
                        <b className={styles.colTitle}>Contact Person</b>
                        <p className={styles.colData}>{supplierDetail.contactPersonName}</p>

                        <b className={styles.colTitle}>Phone Number</b>
                        <p className={styles.colData}>{supplierDetail.phoneNum}</p>

                        <b className={styles.colTitle}>Address</b>
                        <p className={styles.colData}>{supplierDetail.address}</p>

                        <b className={styles.colTitle}>Bank Name</b>
                        <p className={styles.colData}>{supplierDetail.bankName}</p>

                        <b className={styles.colTitle}>Bank Account Number</b>
                        <p className={styles.colData}>{supplierDetail.bankAccountNum}</p>

                    </div>
                </div>
                
            </div>
        </>
    );
}