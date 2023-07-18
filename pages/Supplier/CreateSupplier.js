import axios from "axios";
import React from "react";
import Select from "react-select";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// styles & icons
import styles from '../../styles/createSupplier.module.css'
import arrowIcon from '../../public/arrowIcon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        console.log("hostname   " + hostname);
        if (hostname == "localhost") {
            URL.push("http://localhost:3000", "http://localhost:5000");
            console.log(URL);
        } else if (hostname == "abc-cooking-studio.azurewebsites.net") {
            URL.push(
                "https://abc-cooking-studio-backend.azurewebsites.net",
                "https://abc-cooking-studio.azurewebsites.net"
            );
            console.log(URL);
        }

        return URL;
    }
};

isLocalhost();

const baseUrl = URL[0];
const baseURL = URL[1];

// console.log(baseUrl, baseURL);

// create supplier form
export default function CreateSupplier() {
    const router = useRouter();
    
    // initialise supplierID 
    const [SupplierID, setSupplierID] = useState(''); 

    // dropdown options
    const [bankDropdownOptions, setbankDropdownOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    
    // selected dropdowns values
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

    // error messages in form validation
    const [errors, setErrors] = useState({});

    // ------ regex patterns
    // valid email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 8 digits
    const phonePattern = /^\d{8}$/;

    // valid url format starting with http or https
    const webAddressPattern = /^(http|https):\/\/[^ "]+$/;

    // 8-18 digits
    const bankAccountPattern = /^\d{8,18}$/;

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
        // console.log(selectedOpts);
        setSelectedCategories(selectedOpts);
    };

    // set first input to autofocus - Supplier Name
    const firstInput = useCallback((inputElement) => {
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    // send form data using axios POST
    const handleSubmit = async(e) => {
        e.preventDefault();

        const errors = {};

        //------ form validation
        // email
        if (!formData.email) { // no input
            errors.email = "Email address is required";
        } 
        else if (!emailPattern.test(formData.email)) { // not matched with regex pattern
            errors.email = "Please enter your email address in the format yourname@example.com";
        }

        // phone number
        if (!formData.phoneNum) { // no input
            errors.phoneNum = "Phone number is required";
        } 
        else if (!phonePattern.test(formData.phoneNum)) { // not matched with regex pattern
            errors.phoneNum = "Please enter a valid phone number";
        }

        // office number
        if (!formData.officeNum) {
            errors.officeNum = "Office number is required";
        } 
        else if (!phonePattern.test(formData.officeNum)) {
            errors.officeNum = "Please enter a valid office number";
        }

        // web address
        if (!webAddressPattern.test(formData.webAddress)) {
            errors.webAddress = "Please enter a valid web address";
        }

        // bank account number
        if (!formData.bankAccountNum) {
            errors.bankAccountNum = "Bank account number is required";
        } 
        else if (!bankAccountPattern.test(formData.bankAccountNum)) {
            errors.bankAccountNum = "Please enter a valid bank account number";
        }
        
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
        } 
        else { // submit form
            // form data
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

            await axios.post(`${baseUrl}/api/supplier/`, submitData)
            .then((res) => {
                console.log(res.data);

                axios.get(`${baseUrl}/api/supplier/supplierid`)
                .then((res) => {
                    const supplierId = res.data[0].supplierID;
                    console.log(supplierId);

                    axios.post(`${baseUrl}/api/supplier/suppliersCategory`, {
                        fkSupplier_id: supplierId,
                        categoryIDs: selectedCategories.map((option) => option.value).join(',')
                    });
                })

                alert(res.data);
                
                // redirect back to main page
                router.push('/Supplier'); 
            })
            .catch((err) => {
                console.log(err);
                alert(err);
            });    
        }
    };

    return (
        <>
            <div className="mt-2 mb-4">
                <h1>
                    <a href={'/Supplier'}>
                        <Image src={arrowIcon} className={styles.backArrow} alt="Back Arrow" />
                    </a>

                    <p className="h1 d-inline">Create Supplier</p>
                </h1>
            </div>

            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="row justify-content-center ms-5">
                        <div className="col-6">
                            <b>Supplier Name</b><br></br>
                            <input 
                                type="text" 
                                name="supplierName" 
                                value={formData.supplierName} 
                                onChange={handleInput} 
                                className={styles.textbox}
                                ref={firstInput}
                                required 
                            />
                            <br></br>

                            <b>Email</b> {errors.email && <span className="text-danger" style={{marginLeft: "2px"}}><small>{errors.email}</small></span>}
                            <br></br>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInput} 
                                className={styles.textbox} 
                                placeholder="example@email.com" 
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                title="Please enter your email address in the format yourname@example.com" 
                                required 
                             />
                            <br></br>

                            <b>Office Number</b> {errors.officeNum && <span className="text-danger" style={{marginLeft: "2px"}}><small>{errors.officeNum}</small></span>}
                            <br></br>
                            <input 
                                type="tel" 
                                name="officeNum" 
                                value={formData.officeNum} 
                                onChange={handleInput} 
                                className={styles.textbox}
                                pattern="[3689][0-9]{7}" 
                                title="Please enter a valid phone number" 
                                required 
                            />
                            <br></br>

                            <b>Web Address</b>
                            <span className="text-secondary"><small> (optional)</small></span> 
                            {errors.webAddress && <span className="text-danger" style={{marginLeft: "2px"}}><small>{errors.webAddress}</small></span>}
                            <br></br>
                            <input 
                                type="url" 
                                name="webAddress" 
                                value={formData.webAddress} 
                                onChange={handleInput} 
                                className={styles.textbox} 
                                placeholder="https://www.example.com" 
                                pattern="^https?:\/\/.+$"
                                title="Please enter a valid web address in the format http://www.example.com"
                            />
                            <br></br>

                            <b>Bank Account Name</b><br></br>
                            <input 
                                type="text" 
                                name="bankAccName" 
                                value={formData.bankAccName} 
                                onChange={handleInput} 
                                className={styles.textbox} 
                                placeholder="Bank account holder's name" 
                                required 
                            />
                            <br></br>

                            <b>Category</b><br></br>
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
                    
                        <div className="col-6">
                            <b>Contact Person</b><br></br>
                            <input 
                                type="text" 
                                name="contactPersonName" 
                                value={formData.contactPersonName} 
                                onChange={handleInput} 
                                className={styles.textbox} 
                                required 
                            />
                            <br></br>

                            <b>Phone Number</b> {errors.phoneNum && <span className="text-danger" style={{marginLeft: "2px"}}><small>{errors.phoneNum}</small></span>}
                            <br></br>
                            <input 
                                type="tel" 
                                name="phoneNum" 
                                value={formData.phoneNum} 
                                onChange={handleInput} 
                                className={styles.textbox} 
                                pattern="[3689][0-9]{7}" 
                                title="Please enter a valid phone number" 
                                required 
                            />
                            <br></br>

                            <b>Address</b><br></br>
                            <input 
                                type="text" 
                                name="address" 
                                value={formData.address} 
                                onChange={handleInput} 
                                className={styles.textbox} 
                                title="Please enter a valid address in SG" 
                                required 
                            />
                            <br></br>

                            <b>Bank Account Number</b> {errors.bankAccountNum && <span className="text-danger" style={{marginLeft: "2px"}}><small>{errors.bankAccountNum}</small></span>}
                            <br></br>
                            <input 
                                type="text" 
                                name="bankAccountNum" 
                                value={formData.bankAccountNum} 
                                onChange={handleInput} 
                                className={styles.textbox}
                                pattern="[0-9]{8,18}" 
                                title="Please enter a valid bank account number"
                                required 
                            />
                            <br></br>

                            <b>Bank Name</b><br></br>
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
            </div>
            
        </>
    );
}