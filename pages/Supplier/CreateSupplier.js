import axios from "axios";
import React from "react";
import Select from "react-select";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

// when submit button is clicked
// formData - data for creating new supplier
// selectedCategories - array of categoryIDs selected from multiselect dropdown
// const handleFormSubmit = async(formData, selectedCategories) => {
//     try {
//         // create new supplier
//         const response = await axios.post(`${baseUrl}/api/supplier/`, formData);
//         const supplierID = response.data.supplierID;
//         console.log(supplierID)

//         // fetch latest supplierID
//         const supplierIdResponse =await axios.get(`${baseUrl}/api/supplier/supplierid`);
//         const supplier = supplierIdResponse.data;
//         console.log(supplier)

//         // create suppliers categories
//         await axios.post(`${baseUrl}/api/supplier/suppliersCategory`, {
//             fkSupplier_id: supplier.supplierID,
//             fkCategory_id: selectedCategories
//         });

//         console.log("Supplier created: ", supplier);
//         alert("Supplier created: ", supplier);
//     }
//     catch(err) {
//         console.error(err);
//         alert(err);
//     }
// };

// create supplier form
export default function CreateSupplier() {
    const router = useRouter();
    
    // initialise created supplierID 
    const [CreateID, setCreateID] = useState(''); 

    // dropdown options
    const [bankDropdownOptions, setbankDropdownOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    
    // dropdowns values
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

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
        // bankID: null,
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

    // handle input changes
    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };
    
    // handle bank name dropdown change
    const handleSelectBank = (selectedBankOpt) => {
        setSelectedBank(selectedBankOpt);
    };

    // handle category dropdown change
    const handleMultiCategory = (selectedOpts) => {
        console.log(selectedOpts);
        setSelectedCategories(selectedOpts.map(option => option.value));
    };

    // send form data using axios POST
    const handleSubmit = async(e) => {
        e.preventDefault();

        // handleFormSubmit(formData, selectedCategories);
        // email validation
        // const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        // if(!emailPattern.test(email)) {
        //     setEmailError("Email requirements")
        // }
        
        const submitData = {
            supplierName: formData.supplierName,
            email: formData.email,
            officeNum: formData.officeNum,
            webAddress: formData.webAddress,
            bankAccName: formData.bankAccName,
            contactPersonName: formData.contactPersonName,
            phoneNum: formData.phoneNum,
            address: formData.address,
            bankAccountNum: formData.bankAccountNum,
            bankID: selectedBank ? selectedBank.value: null,
        };

        console.log(submitData);

        axios.post(`${baseUrl}/api/supplier/`, submitData)
            .then((response) => {
                console.log(response.data);
                alert(response.data);
                router.push('/Supplier'); // redirect back to main page
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            });

        // try {
        //     // step 1: create basic supplier info
        //     const res1 = await axios.post(`${baseUrl}/api/supplier/`, submitData)
        //     const createdSupplierID = res1.data.id; // get id from axios post res.data
        //     setCreateID(createdSupplierID);
        //     // console.log(res1.data);
        //     // alert(res1.data);

        //     //step 2: create supplier category thru dropdown
        //     const postCategory = {
        //         fkSupplier_id: createdSupplierID,
        //         fkCategory_id: CategoryDropdownValues.map((option) => option.value),
        //     };

        //     const res2 = await axios.post(`${baseUrl}/api/supplier/suppliersCategory`, postCategory);
        //     const createdSupplierCategory = res2.data;
        //     setCategoryDropdownValues(createdSupplierCategory);

        // }
        // catch(err) {
        //     console.log(err);
        //     alert(err);
        // };

        /*try {
            const response = await axios.post(`${baseUrl}/api/supplier/`, {formValue});
            console.log(response.data);
            alert(response.data);
        }
        catch(err) {
            console.log(err);
            alert(err);
        };*/
    };

    return (
        <>
            <div className={styles.titleRow}>
                <h1>
                    <a href={'/Supplier'}>
                        <Image src={arrowIcon} className={styles.backArrow} alt="Back Arrow" />
                    </a>
                    <p className={styles.title}>Create Supplier</p>
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <div className={styles.col1}>
                        <b className={styles.colTitle}>Supplier Name</b>
                        <input type="text" name="supplierName" value={formData.supplierName} onChange={handleInput} placeholder="Enter Supplier Name" className={styles.textbox} required />

                        <b className={styles.colTitle}>Email</b>
                        <input type="email" name="email" value={formData.email} onChange={handleInput} placeholder="eg. example@email.com" className={styles.textbox} required />

                        <b className={styles.colTitle}>Office Number</b>
                        <input type="text" name="officeNum" value={formData.officeNum} onChange={handleInput} placeholder="eg. 12345678" className={styles.textbox} required />

                        <b className={styles.colTitle}>Web Address</b>
                        <input type="text" name="webAddress" value={formData.webAddress} onChange={handleInput} placeholder="eg. www.example.com" className={styles.textbox} required />
                        
                        <b className={styles.colTitle}>Bank Account Name</b>
                        <input type="text" name="bankAccName" value={formData.bankAccName} onChange={handleInput} placeholder="Enter Bank Account Holder's Name" className={styles.textbox} required />

                        <b className={styles.colTitle}>Category</b>
                        <Select
                            isMulti
                            isSearchable
                            options={categoryOptions} 
                            value={selectedCategories}
                            onChange={handleMultiCategory}
                            className={styles.multiSelectBox}
                            placeholder="What do you sell?"
                            noOptionsMessage={() => "Category does not exist."}
                        />
                    </div>
                
                    <div className={styles.col2}>
                        <b className={styles.colTitle}>Contact Person</b>
                        <input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleInput} placeholder="Enter Contact Person's Name" className={styles.textbox} required />
                    
                        <b className={styles.colTitle}>Phone Number</b>
                        <input type="text" name="phoneNum" value={formData.phoneNum} onChange={handleInput} placeholder="eg. 12345678" className={styles.textbox} required />
                        
                        <b className={styles.colTitle}>Address</b>
                        <input type="text" name="address" value={formData.address} onChange={handleInput} className={styles.textbox} required />

                        <b className={styles.colTitle}>Bank Account Number</b>
                        <input type="text" name="bankAccountNum" value={formData.bankAccountNum} onChange={handleInput} placeholder="eg. 001-2345-6789" className={styles.textbox} required />

                        <b className={styles.colTitle}>Bank Name</b>
                        <Select
                            isSearchable
                            options={bankDropdownOptions}
                            value={selectedBank}
                            onChange={handleSelectBank}
                            className={styles.selectBox}
                            placeholder="Select Bank"
                            noOptionsMessage={() => "Bank does not exist."}
                            required
                        />

                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>Create</button>

            </form>
        </>
    );
}