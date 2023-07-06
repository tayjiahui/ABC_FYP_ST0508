import axios from "axios";
import React from "react";
import Select from "react-select";
import { useEffect, useState } from "react";
import Image from "next/image";

// styles & icons
import styles from '../../styles/createSupplier.module.css'
import arrowIcon from '../../public/arrowIcon.svg';

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

// export async function getServerSideProps(context) {
//     const host = context.req.headers.host;
//     const backBaseURL = [];

//     if(host == 'localhost:5000') {
//         backBaseURL.push('http://localhost:3000');
//     }
//     else {
//         backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
//     }
    
//     const { params } = context;
//     const { supplierID } = params;

//     const supplierInfoResponse = await fetch(`${backBaseURL}/api/supplier/${supplierID}`);
//     const supplierInfoResults = await supplierInfoResponse.json();
//     // console.log("supplier info: " + supplierInfoResults);
                     
//     return {
//         props: {
//             host,
//             supplierDetails: supplierInfoResults,
//             supplierID
//         }
//     };
// }

// update supplier form
export default function UpdateSupplier({}) {

    // dropdown options
    const [bankDropdownOptions, setbankDropdownOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // initial dropdowns value
    const [BankDropdownValue, setBankDropdownValue] = useState(null);
    const [CategoryDropdownValues, setCategoryDropdownValues] = useState([]);

    // initial form inputs state
    const [formData, setFormData] = useState({
        supplierName: '',
        email: '',
        officeNum: '',
        webAddress: '',
        bankAccName: '',
        contactPersonName: '',
        phoneNum: '',
        address: '',
        bankID: null,
        bankAccountNum: ''
    });

    // get dropdown options
    useEffect(() => {
        axios.all([
            axios.get(`${baseUrl}/api/supplier/bank/all`,{}),
            axios.get(`${baseUrl}/api/supplier/category/all`,{})
        ])
        .then(axios.spread((response1, response2) => {
            // bank names options
            const bankNames = response1.data.map(option1 => ({
                value: option1.bankID,
                label: option1.bankName
            }));
            // console.log(bankNames);
            setbankDropdownOptions(bankNames);

            // categories options
            const categories = response2.data.map(option2 => ({
                value: option2.categoryID,
                label: option2.categoryName
            }));
            // console.log(categories);
            setCategoryOptions(categories);
        }))
        .catch((err) => {
            console.error(err);
            alert(err)
        });
    }, []);
    
    return (
        <>
            <div className={styles.titleRow}>
                <h1>
                    <a href={'/Supplier'}>
                        <Image src={arrowIcon} className={styles.backArrow} alt="Back Arrow" />
                    </a>
                    <p className={styles.title}>Update Supplier</p>
                </h1>
            </div>

            <form>
                <div className={styles.row}>
                    <div className={styles.col1}>
                        <b className={styles.colTitle}>Supplier Name</b>
                        <input type="text" name="supplierName" placeholder=""className={styles.textbox} required />

                        <b className={styles.colTitle}>Email</b>
                        <input type="email" name="email" placeholder="" className={styles.textbox} required />

                        <b className={styles.colTitle}>Office Number</b>
                        <input type="text" name="officeNum" placeholder="" className={styles.textbox} required />

                        <b className={styles.colTitle}>Web Address</b>
                        <input type="text" name="webAddress" placeholder="" className={styles.textbox} required />
                        
                        <b className={styles.colTitle}>Bank Account Name</b>
                        <input type="text" name="bankAccName" placeholder="" className={styles.textbox} required />

                        <b className={styles.colTitle}>Category</b>
                        <Select
                            isMulti
                            isSearchable 
                            options={categoryOptions}
                            className={styles.multiSelectBox}
                            placeholder=""
                            noOptionsMessage={() => "Category does not exist."}
                        />
                    </div>
                
                    <div className={styles.col2}>
                        <b className={styles.colTitle}>Contact Person</b>
                        <input type="text" name="contactPersonName" placeholder="" className={styles.textbox} required />
                    
                        <b className={styles.colTitle}>Phone Number</b>
                        <input type="text" name="phoneNum" placeholder="" className={styles.textbox} required />
                        
                        <b className={styles.colTitle}>Address</b>
                        <input type="text" name="address" placeholder="" className={styles.textbox} required />
                        
                        <b className={styles.colTitle}>Bank Account Number</b>
                        <input type="text" name="bankAccountNum" placeholder="" className={styles.textbox} required />

                        <b className={styles.colTitle}>Bank Name</b>
                        <Select 
                            isSearchable
                            options={bankDropdownOptions}
                            value={BankDropdownValue}
                            className={styles.selectBox}
                            placeholder="Select Bank"
                            noOptionsMessage={() => "Bank does not exist."}
                            required
                        />

                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>Update</button>
                
            </form>
        </>
    );
}