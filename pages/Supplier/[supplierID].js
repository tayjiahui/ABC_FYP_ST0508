import axios from "axios";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react";
import Image from "next/image";
import Select from "react-select";

// styles & icons
import styles from "../../styles/viewSupplier.module.css";
import arrowIcon from "../../public/arrowIcon.svg";
import editIcon from "../../public/penIcon.svg";
import deleteIcon from "../../public/trashBinIcon.svg";
import xIcon from '../../public/xIcon.svg';
import AlertBox from "../../components/alert";
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

// get supplier info
export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    const backBaseURL = [];

    if (host == 'localhost:5000') {
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

    const [Token, setToken] = useState();

    // alert box
    const [updatedSuccessAlert, setUpdatedSuccessAlert] = useState(false);
    const [updatedErrorAlert, setUpdatedErrorAlert] = useState(false);
    const [deletedSuccessAlert, setDeletedSuccessAlert] = useState(false);
    const [deletedErrorAlert, setDeletedErrorAlert] = useState(false);
    const [selectAlert, setSelectAlert] = useState(false);

    // alert box timer
    function alertTimer() {
        setTimeout(alertFunc, 3000);
    };

    function alertFunc() {
        setUpdatedSuccessAlert(false);
        setUpdatedErrorAlert(false);
        setDeletedSuccessAlert(false);
        setDeletedErrorAlert(false);
        setSelectAlert(false);
    };

    // dropdown options
    const [bankDropdownOptions, setbankDropdownOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    // dropdowns values
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // get dropdown options
    useEffect(() => {
        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        axios.all([
            axios.get(`${baseUrl}/api/supplier/bank/all`,
                {
                    headers: {
                        authorization: 'Bearer ' + token
                    }
                }
            ),
            axios.get(`${baseUrl}/api/supplier/category/all`,
                {
                    headers: {
                        authorization: 'Bearer ' + token
                    }
                }
            )
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
                if (err.response.status === 401 || err.response.status === 403) {
                    localStorage.clear();
                    signOut({ callbackUrl: '/Unauthorised' });
                }
                else {
                    console.log(err);
                };
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
        bankAccountNum: supplierDetail.bankAccountNum,
        MOQ: supplierDetail.MOQ,
        deliveryTimeLine: supplierDetail.deliveryTimeLine
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
        bankAccountNum: '',
        MOQ: '',
        deliveryTimeLine: ''
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

    // handle delete popup
    const [deleteSupplierPop, setDeleteSupplierPop] = useState(false);

    const handleClosePopup = () => {
        setDeleteSupplierPop(false);
    }

    const handleOpenPopup = () => {
        setDeleteSupplierPop(true);
    }

    // handle popup delete button
    const handleConfirmDelete = async (e) => {
        e.preventDefault();

        await axios.put(`${baseUrl}/api/supplier/delete/${supplierID}`, {},
            {
                headers: {
                    authorization: 'Bearer ' +  Token
                }
            }
        )
            .then((res1) => {
                console.log(res1.data);
                // alert(res1.data);

                axios.put(`${baseUrl}/api/supplier/delete/category/${supplierID}`,{},
                    {
                        headers: {
                            authorization: 'Bearer ' + Token
                        }
                    })
                    .then((res2) => {
                        console.log(res2.data);
                    })

                setDeletedSuccessAlert(true);

                // timer to reset to false
                alertTimer();

                // timer before redirect
                setTimeout(() => { router.push('/Supplier') }, 3000);

            })
            .catch((err) => {
                console.log(err)
                // if (err.response.status === 401 || err.response.status === 403) {
                //     localStorage.clear();
                //     signOut({ callbackUrl: '/Unauthorised' });
                // }
                // else {
                //     setDeletedErrorAlert(true);
                //     // alert(err);

                //     alertTimer();
                //     console.log(err);
                // };
            });

        setDeleteSupplierPop(false);

        // redirect to supplier main page
        // router.push('/Supplier');
    }

    // text edit for update
    const [editSupplier, allowEditSupplier] = useState(false);

    // allow edit mode when pen icon is clicked
    const handleAllowEdit = () => {
        allowEditSupplier(true);
    };

    // cancel button for update
    const handleCancelEdit = () => {
        allowEditSupplier(false);
    }

    // handle update button
    const handleConfirmUpdate = async (e) => {
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
            bankID: selectedBank ? selectedBank.value : formData.bankID,
            MOQ: updatedFormData.MOQ || formData.MOQ,
            deliveryTimeLine: updatedFormData.deliveryTimeLine || formData.deliveryTimeLine
        };
        console.log(updatedValues);

        // check for category inputs
        if (selectedCategories.length === 0) {
            // alert("Please select at least one option for Category");
            setSelectAlert(true);
            alertTimer();
        }
        else {
            // send form data using axios PUT
            await axios.put(`${baseUrl}/api/supplier/${supplierID}`, updatedValues,
                {
                    headers: {
                        authorization: 'Bearer ' + Token
                    }
                })
                .then((res1) => {
                    console.log(res1.data);
                    // alert(res1.data);

                    axios.put(`${baseUrl}/api/supplier/suppliersCategory/${supplierID}`, {
                        categoryIDs: selectedCategories.map((option) => option.value).join(',')
                    },
                        {
                            headers: {
                                authorization: 'Bearer ' + Token
                            }
                        })
                        .then((res2) => {
                            console.log(res2.data);
                        })

                    setUpdatedSuccessAlert(true);

                    // timer to reset to false
                    alertTimer();

                    // timer before redirect
                    setTimeout(() => { router.push('/Supplier') }, 3000);

                })
                .catch((err) => {
                    if (err.response.status === 401 || err.response.status === 403) {
                        localStorage.clear();
                        signOut({ callbackUrl: '/Unauthorised' });
                    }
                    else {
                        setUpdatedErrorAlert(true);
                        alertTimer();
                        console.log(err);
                    };
                });
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-10 mt-2 mb-4">
                    <h1>
                        <a href={'/Supplier'}>
                            <Image src={arrowIcon} className={styles.backArrow} alt="Back Arrow" />
                        </a>

                        <p className="h1 d-inline">{supplierDetail.supplierName}</p>
                    </h1>
                </div>

                <div className="col-2 mt-2 mb-4">
                    <Image src={editIcon} onClick={handleAllowEdit} className="d-inline" style={{ marginLeft: "30px", width: "40px", height: "40px", cursor: "pointer" }} alt="Edit Button" />

                    <Image src={deleteIcon} onClick={handleOpenPopup} className="d-inline" style={{ marginLeft: "40px", width: "45px", height: "45px", cursor: "pointer" }} alt="Delete Button" />

                    {deleteSupplierPop && (
                        <div className={styles.popupContainer}>
                            <div className={styles.popupBox}>
                                <h2 className={styles.confirmDeleteText}> Confirm Delete?</h2>
                                <button onClick={handleClosePopup} className={styles.closeButton2}>
                                    <Image src={xIcon} width={35} height={35} alt="Cancel" />
                                </button>

                            </div>
                            <div className={styles.deleteButtons}>
                                <button className={styles.deleteButton} onClick={handleConfirmDelete}>Delete</button>
                                <button className={styles.cancelButton1} onClick={handleClosePopup} >Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container">
                <div className="row ms-2">
                    <div className="col-6" style={{ fontSize: "large" }}>

                        <b>Supplier Name</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.supplierName}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="text"
                                name="supplierName"
                                value={updatedFormData.supplierName || formData.supplierName}
                                onChange={handleInput}
                                className={styles.editInputs}
                            />
                        }
                        <br></br>

                        <b>Email</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.email}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="email"
                                name="email"
                                value={updatedFormData.email || formData.email}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            />
                        }
                        <br></br>

                        <b>Office Number</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.officeNum}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="tel"
                                name="officeNum"
                                value={updatedFormData.officeNum || formData.officeNum}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="[3689][0-9]{7}"
                            />
                        }
                        <br></br>

                        <b>Web Address</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.webAddress}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="url"
                                name="webAddress"
                                value={updatedFormData.webAddress || formData.webAddress}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="^https?:\/\/.+$"
                            />
                        }
                        <br></br>

                        <b>Bank Account Name</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.bankAccName}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="text"
                                name="bankAccName"
                                value={updatedFormData.bankAccName || formData.bankAccName}
                                onChange={handleInput}
                                className={styles.editInputs}
                            />
                        }
                        <br></br>

                        <b>Category</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.Category}</p>
                        }

                        {editSupplier === true &&
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
                        }
                        <br></br>

                        <b>Contact Person</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.contactPersonName}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="text"
                                name="contactPersonName"
                                value={updatedFormData.contactPersonName || formData.contactPersonName}
                                onChange={handleInput}
                                className={styles.editInputs}
                            />
                        }
                        <br></br>
                    </div>

                    <div className="col-5" style={{ fontSize: "large" }}>



                        <b>Phone Number</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.phoneNum}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="tel"
                                name="phoneNum"
                                value={updatedFormData.phoneNum || formData.phoneNum}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="[3689][0-9]{7}"
                            />
                        }
                        <br></br>

                        <b>Address</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.address}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="text"
                                name="address"
                                value={updatedFormData.address || formData.address}
                                onChange={handleInput}
                                className={styles.editInputs}
                            />
                        }
                        <br></br>

                        <b>Bank Account Number</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.bankAccountNum}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="text"
                                name="bankAccountNum"
                                value={updatedFormData.bankAccountNum || formData.bankAccountNum}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="[0-9]{8,18}"
                            />
                        }
                        <br></br>

                        <b>Bank Name</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.bankName}</p>
                        }

                        {editSupplier === true &&
                            <Select
                                isSearchable
                                options={bankDropdownOptions}
                                name="bankID"
                                value={selectedBank || formData.bankID}
                                onChange={handleSelectBank}
                                className={styles.selectBox}
                                placeholder={supplierDetail.bankName}
                            />
                        }
                        <br></br>

                        <b>Minimum Order Quantity</b><br></br>
                        {editSupplier === false &&
                            <p>${supplierDetail.MOQ}</p>
                        }

                        {editSupplier === true &&
                            <input
                                type="text"
                                name="MOQ"
                                value={updatedFormData.MOQ || formData.MOQ}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="^[0-9]+$"
                            />
                        }
                        <br></br>

                        <b>Delivery Time Line</b><br></br>
                        {editSupplier === false &&
                            <p>{supplierDetail.deliveryTimeLine} Days</p>
                        }
                        {editSupplier === true &&
                            <input
                                type="text"
                                name="deliveryTimeLine"
                                value={updatedFormData.deliveryTimeLine || formData.deliveryTimeLine}
                                onChange={handleInput}
                                className={styles.editInputs}
                                pattern="^[0-9]+$"
                            />
                        }

                    </div>

                    {editSupplier == true &&
                        <div className="pt-5" >
                            <button type="button" className={styles.cancelButton2} onClick={handleCancelEdit}>Cancel</button>
                            <button type="submit" className={styles.submitButton} onClick={handleConfirmUpdate}>Update</button>
                        </div>
                    }

                </div>
            </div>

            {updatedSuccessAlert &&
                <AlertBox
                    Show={updatedSuccessAlert}
                    Message={`Supplier Successfully Updated!`}
                    Type={"success"}
                    Redirect={`/Supplier`}
                />
            }

            {updatedErrorAlert &&
                <AlertBox
                    Show={updatedErrorAlert}
                    Message={`Failed to Update Supplier`}
                    Type={"danger"}
                />
            }

            {deletedSuccessAlert &&
                <AlertBox
                    Show={deletedSuccessAlert}
                    Message={`Supplier Successfully Deleted!`}
                    Type={"success"}
                    Redirect={`/Supplier`}
                />
            }

            {deletedErrorAlert &&
                <AlertBox
                    Show={deletedErrorAlert}
                    Message={`Failed to Delete Supplier`}
                    Type={"danger"}
                />
            }

            {selectAlert &&
                <AlertBox
                    Show={selectAlert}
                    Message={`Please select at least one Category`}
                    Type={"danger"}
                />
            }
        </>
    );
}