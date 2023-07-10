import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Image from "next/image";
import Select from "react-select";

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

// get supplier info
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

    const router = useRouter()
    const supplierID = router.query.supplierID;
    
    const supplierDetail = supplierDetails[0];
    //console.log("ID from url: "+ supplierID);
    // console.log(supplierDetail);

    // dropdown options
    const [bankDropdownOptions, setbankDropdownOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // dropdowns values
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

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

    // current data of the form inputs
    const [formData, setFormData] = useState({
        supplierName: supplierDetail.supplierName,
        email: supplierDetail.email,
        officeNum: supplierDetail.officeNum,
        webAddress: supplierDetail.webAddress,
        bankAccName: supplierDetail.bankAccName,
        contactPersonName: supplierDetail.contactPersonName,
        phoneNum: supplierDetail.phoneNum,
        address: supplierDetail.address,
        bankID: supplierDetail.bankID,
        bankAccountNum: supplierDetail.bankAccountNum
    });

    // update form states
    const [updatedFormData, setUpdatedFormData] = useState({
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
    })

    // handle update form input changes
    const handleInput = (e) => {
        const { name, value } = e.target;
        setUpdatedFormData((prevState) => ({
            ...prevState, // copy the initial formData state (which is the current supplier info) and update the specific field that is changed
            [name]: value,
        }));
    };

    // handle bank name dropdown change
    const handleSelectBank = (selectedBankOpt) => {
        // console.log(selectedBankOpt)
        setSelectedBank(selectedBankOpt);
    };

    // handle category dropdown change
    const handleMultiCategory = (selectedOpts) => {
        console.log(selectedOpts);
        setSelectedCategories(selectedOpts);
    };

    const [deleteSupplierPop, setDeleteSupplierPop] = useState(false);
    const [updateSupplierPop, setUpdateSupplierPop] = useState(false);

    // delete popup handling
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

    // update popup handling
    const handleOpenUpdate = () => {
        setUpdateSupplierPop(true);
    }

    const handleCloseUpdate = () => {
        setUpdateSupplierPop(false);
    }

    // handle update button
    const handleConfirmUpdate = async(e) => {
        e.preventDefault();

        // updated fields
        const updatedValues = {
            supplierName: updatedFormData.supplierName || formData.supplierName,
            email: updatedFormData.email || formData.email,
            officeNum: updatedFormData.officeNum || formData.officeNum,
            webAddress: updatedFormData.webAddress || formData.webAddress,
            bankAccName: updatedFormData.bankAccName || formData.bankAccName,
            contactPersonName: updatedFormData.contactPersonName || formData.contactPersonName,
            phoneNum: updatedFormData.phoneNum || formData.phoneNum,
            address: updatedFormData.address || formData.address,
            bankAccountNum: updatedFormData.bankAccountNum || formData.bankAccountNum,
            bankID: selectedBank ? selectedBank.value: formData.bankID,
        };

        console.log(updatedValues);

        if (selectedCategories.length === 0) {
            alert("Please select at least one option for Category");
            setUpdateSupplierPop(true);
        } 
        else {
            await axios.put(`${baseUrl}/api/supplier/${supplierID}`, updatedValues)
            .then((res1) => {
                console.log(res1.data);
                alert(res1.data);

                axios.put(`${baseUrl}/api/supplier/suppliersCategory/${supplierID}`, {
                    categoryIDs: selectedCategories.map((option) => option.value).join(',')
                })
                .then((res2) => {
                    console.log(res2.data);
                    // alert(res2.data);
                })

                // refresh page to show updates
                router.push('/Supplier');
                // router.reload() --> didnt work

            })
            .catch((err) => {
                console.log(err);
                alert(err);
            });
        }
        setUpdateSupplierPop(true);
    }

    return (
        <>
            <div className={styles.titleRow}>
                <h1>
                    <a href={'/Supplier'}>
                        <Image src={arrowIcon} className={styles.backArrow} alt="Back Arrow" />
                    </a>

                    <p className={styles.title}>{supplierDetail.supplierName}</p>

                    <Image src={editIcon} onClick={handleOpenUpdate} className={styles.penIcon} alt="Edit Button" />
                    
                    {updateSupplierPop && (
                        <div className={styles.updatePopContainer}>
                            <div className={styles.updatePopBox}>
                                <h5 className={styles.updateTitle}>Update Supplier</h5>
                                <button onClick={handleCloseUpdate} className={styles.closeButton1}>X</button>
                                <div className={styles.formRow}>
                                    <form>
                                        <div className={styles.formCol1}>
                                            <b className={styles.editInput1}>Supplier Name</b>
                                            <input type="text" name="supplierName" value={updatedFormData.supplierName || formData.supplierName} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Email</b>
                                            <input type="text" name="email" value={updatedFormData.email || formData.email} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Office Number</b>
                                            <input type="text" name="officeNum" value={updatedFormData.officeNum || formData.officeNum} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Web Address</b>
                                            <input type="text" name="webAddress" value={updatedFormData.webAddress || formData.webAddress} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Bank Account Name</b>
                                            <input type="text" name="bankAccName" value={updatedFormData.bankAccName || formData.bankAccName} onChange={handleInput} className={styles.editInputs}></input><br></br>
                                        </div>

                                        <div className={styles.formCol2}>
                                            <b className={styles.editInput1}>Contact Person</b>
                                            <input type="text" name="contactPersonName" value={updatedFormData.contactPersonName || formData.contactPersonName} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Phone Number</b>
                                            <input type="text" name="phoneNum" value={updatedFormData.phoneNum || formData.phoneNum} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Address</b>
                                            <input type="text" name="address" value={updatedFormData.address || formData.address} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Bank Account Number</b>
                                            <input type="text" name="bankAccountNum" value={updatedFormData.bankAccountNum || formData.bankAccountNum} onChange={handleInput} className={styles.editInputs}></input><br></br>

                                            <b className={styles.editInput1}>Bank Name</b>
                                            <Select
                                                isSearchable
                                                options={bankDropdownOptions}
                                                name="bankID"
                                                value={selectedBank || formData.bankID} 
                                                onChange={handleSelectBank}
                                                className={styles.selectBox}
                                                placeholder={supplierDetail.bankName}
                                            /> 

                                            <b className={styles.editInput1}>Category*</b>
                                            <Select
                                                isMulti
                                                isSearchable
                                                options={categoryOptions}
                                                value={selectedCategories}
                                                onChange={handleMultiCategory}
                                                className={styles.multiSelectBox}
                                                placeholder={supplierDetail.Category}
                                                // placeholder="What do you sell?"
                                                noOptionsMessage={() => "Category does not exist."}
                                                required
                                            />
                                        </div>
                                        <br></br>
                                        <button type="submit" className={styles.submitButton} onClick={handleConfirmUpdate}>Update</button>
                                    </form>
                                </div> 
                            </div>
                        </div>
                    )}

                    <Image src={deleteIcon} onClick={handleOpenPopup} className={styles.trashBin} alt="Delete Button" />

                    {deleteSupplierPop && (
                        <div className={styles.popupContainer}>
                            <div className={styles.popupBox}>
                                <h2 className={styles.confirmDeleteText}> Confirm Delete?</h2>
                                <button onClick={handleClosePopup} className={styles.closeButton2}>X</button>
                            </div>
                            <div className={styles.deleteButtons}>
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