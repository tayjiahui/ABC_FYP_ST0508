import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from 'moment-timezone';
import axios from "axios";

// styles
import styles from '../../../styles/adHocByID.module.css';

// components
import WIP from '../../../components/WIP';
import AlertBox from "../../../components/alert";

// Image
import arrowIcon from "../../../public/arrowIcon.svg";
import editIcon from "../../../public/penIcon.svg";
import cancelEditIcon from "../../../public/cancelPenIcon.svg";

const timezone = 'Asia/Singapore';

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        console.log('hostname   ' + hostname);
        if (hostname == 'localhost') {
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
        }
        else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
            URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
            console.log(URL);
        };
        return URL;
    };
};

isLocalhost();

const baseUrl = URL[0];

export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    // console.log(host);

    const backBaseURL = [];

    if (host == "localhost:5000") {
        backBaseURL.push("http://localhost:3000");
    } else {
        backBaseURL.push("https://abc-cooking-studio-backend.azurewebsites.net");
    };

    const { params } = context;
    const { poID } = params;

    // Normal View PR by ID page
    const getAdHocDetails = await fetch(`${backBaseURL}/api/purchaseReq/adhoc/viewBy/${poID}`);

    const adHocDetails = await getAdHocDetails.json();

    return {
        props: {
            host,
            AdHocDetails: adHocDetails,
            poID
        },
    };
};

export default function ViewAdHoc({ AdHocDetails }) {

    const [id, setUserID] = useState();
    const [Token, setToken] = useState();

    // Dates
    const [ReqDate, setReqDate] = useState();
    const [haveTotalPrice, setHaveTotalPrice] = useState(false);
    const [OGAdHocPrice, setOGAdHocPrice] = useState();
    const [adHocPrice, setAdHocPrice] = useState();
    const [editTotal, setEditTotal] = useState(false);

    const [showInProg, setInProg] = useState(false);

    //INVOICE
    const [selectedFile, setSelectedFile] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [PDF, setPDF] = useState([]);

    // Alerts
    const [updateTPAlert, setTPAlert] = useState(false);
    const [uploadedReceiptAlert, setUploadedReceiptAlert] = useState(false);

    const AH = AdHocDetails[0];
    const poID = AdHocDetails[0].prID;


     // get user id
    useEffect(() => {
    // set user id taken from localstorage
    const userID = parseInt(localStorage.getItem("ID"), 10);
    setUserID(userID);

    //set user token
    const token = localStorage.getItem("token");
    setToken(token);

    }, [])


    useEffect(() => {
        // set user id taken from localstorage
        const userID = parseInt(localStorage.getItem("ID"), 10);
        setUserID(userID);

        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        // Requested Date formatting
        const newReqDateFormat = moment(AH.requestedDate).format("D MMM YYYY");
        setReqDate(newReqDateFormat);

        // set if totalPrice is not 0.00
        if (AH.totalPrice > 0) {
            setHaveTotalPrice(true);
            setAdHocPrice(AH.totalPrice);
        } else {
            setEditTotal(true);
        };
    }, []);

    useEffect(() => {
        axios.get(`${baseUrl}/api/purchaseReq/adhoc/viewBy/${poID}`)
            .then((response) => {
                // get og total
                const AHD = response.data[0];
                setOGAdHocPrice(AHD.totalPrice);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [editTotal, adHocPrice])

    // edit total price toggle
    const totalPriceEdit = async () => {
        setHaveTotalPrice(true);

        // converts decimal to 2 d.p.
        const totalPriceValue = parseFloat(adHocPrice).toFixed(2);
        setAdHocPrice(totalPriceValue);

        if (editTotal === false) {
            setEditTotal(true);
        };

        if (editTotal === true) {
            setEditTotal(false);

            await axios.put(`${baseUrl}/api/trackOrder/purchaseOrder/totalPrice/${poID}`,
                {
                    totalPrice: totalPriceValue
                },
                {
                    headers: {
                        authorization: 'Bearer ' + Token
                    }
                }
            )
                .then(async(response) => {
                    // console.log(response);

                    setTPAlert(true);
                    alertTimer();

                    // audit log
                    await axios.post(`${baseUrl}/api/auditTrail/`,
                        {
                            timestamp: moment().tz(timezone).format(),
                            userID: id,
                            actionTypeID: 4,
                            itemId: poID,
                            newValue: adHocPrice,
                            oldValue: OGAdHocPrice
                        },
                        {
                          headers: {
                            authorization: 'Bearer ' + Token
                          }
                        }
                    )
                        .then((response) => {
                            // console.log(response.data);
                        })
                })
                .catch((err) => {
                    console.log(err);
                })
        };
    };

    const handleTotalChange = async (e) => {
        const inputValue = e.target.value;

        // does not allow input value to be alphabets
        setAdHocPrice(inputValue.replace(/[^0-9.]/g, ''));
    };

    // alert box timer
    function alertTimer() {
        // changes all alert useStates to false after 3s
        setTimeout(alertFunc, 3000);
    };

    function alertFunc() {
        // list of alerts useStates in your page
        setTPAlert(false);
        setUploadedReceiptAlert(false);
    };

    // WIP Modal
    // timer
    function timeFunc() {
        // 2 seconds
        setTimeout(closeWIPModal, 2000);
    };

    const handleOpenWip = () => {
        setInProg(true);
        timeFunc();
    };

    // close WIP Modal
    function closeWIPModal() {
        setInProg(false);
    };

    //fetching invoice
    useEffect(() => {
        fetchPDFData();
    }, []);

    const fetchPDFData = () => {
        axios
            .get(`${baseUrl}/api/trackOrder/documents/${poID}/invoice`, {
                responseType: 'arraybuffer',
            })
            .then((res) => {
                const base64Data = btoa(
                    new Uint8Array(res.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                setPDF(base64Data);
            })
            .catch((err) => {
                console.log('Error fetching PDF:', err);
                setPDF(null);
            });
    };

    const handleOpenPDFInNewTab = () => {
        if (PDF) {
            const byteCharacters = atob(PDF);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

            const pdfUrl = window.URL.createObjectURL(pdfBlob);
            const newTab = window.open();
            newTab.document.write('<iframe src="' + pdfUrl + '" width="100%" height="100%"></iframe>');
            newTab.document.close();
        }
    };

    //uploading invoice
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            axios.put(`${baseUrl}/api/trackOrder/documents/${poID}/invoice`, formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                    user: id,
                    authorization: 'Bearer ' + Token
                }
            })
                .then(() => {
                    console.log('Invoice uploaded successfully!!');
                    setUploadedReceiptAlert(true);
                    alertTimer()
                    fetchPDFData();
                })
                .catch((err) => {
                    console.log("Error uploading Invoice", err);
                })
        };
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleOpenModal2 = () => {
        setShowModal2(true);
    };

    const handleCloseModal2 = () => {
        setShowModal2(false);
    };

    const handleConfirmUpload = () => {
        setShowModal(false);
        setShowModal2(true);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    return (
        <div>
            <h1 className='firstHeaderTop'>
                <a href={"/TrackOrder"} className='purchaseOrderNo'>
                    <Image src={arrowIcon} className="col-sm pr-2 pb-2" alt="Back" />
                </a>Ad Hoc Purchase #{AH.prID}
            </h1>

            <div className="pt-4">
                <h3 className="col-sm ms-5">Ad Hoc Details</h3>

                <div className={styles.lineContainer}>
                    <hr className={styles.lineDivider}></hr>
                </div>
            </div>

            <div className="px-5 py-4">

                <div className="py-2">
                    <h4>Created Date</h4>
                    <p>{ReqDate}</p>
                </div>

                <div className="mt-4">
                    <h4>Name</h4>
                    <p>{AH.name}</p>
                </div>

                <div className="py-4">
                    <h4>Description</h4>
                    <p>{AH.remarks}</p>
                </div>

                <div className="py-4">
                    <div className="d-flex">
                        <h4>Total Purchase Price</h4>
                        <div className="px-3">
                            <button onClick={totalPriceEdit} className="btn p-0">
                                {
                                    editTotal === false &&
                                    <Image src={editIcon} width={23} height={23} alt="Edit Pen Icon" />
                                }
                                {
                                    editTotal === true &&
                                    <Image src={cancelEditIcon} width={23} height={23} alt="Canceled Edit Pen Icon" />
                                }
                            </button>
                        </div>
                    </div>

                    {
                        haveTotalPrice === true && editTotal === false &&
                        <p>${adHocPrice}</p>
                    }

                    {
                        editTotal &&
                        <div>
                            $<input type="text" value={adHocPrice} onChange={(e) => handleTotalChange(e)} placeholder="0.00" className="px-2" />
                        </div>
                    }

                </div>
            </div>

            <div className="pb-3 pt-4">
                <h3 className="col-sm ms-5">Upload Ad-Hoc Receipt</h3>
                <div className={styles.lineContainer}>
                    <hr className={styles.lineDivider}></hr>
                </div>

                <div className="ps-3 pt-3 pb-2">
                    <button onClick={handleOpenModal} className="rounded-4 mt-3 w-50 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284' }}>
                        <h4 className="col-sm text-white pt-2">Upload Receipt</h4><br></br>
                        {showInProg && <WIP Show={showInProg} />}
                    </button>
                </div>
            </div>

            <div className="ps-3 pt-3 pb-5">
                {PDF ? (
                    <>
                        <button className="rounded-4 w-50 ms-4 pt-3 me-1 border-0 shadow text-center col-sm text-white pt-2" style={{ backgroundColor: '#486284' }} onClick={handleOpenPDFInNewTab} >
                            <h4 className="col-sm text-white pt-2">View Receipt</h4><br/>
                        </button>
                    </>
                ) : (
                    <p className="ms-4">No receipt uploaded currently.</p>
                )}
            </div>




            {/* INVOICE PDF */}
            {showModal && (
                <div className="modal fade show d-block" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{border: '1px solid black'}}>
                            <div className="modal-body">
                                <div className="d-flex flex-column align-items-center">
                                    <h5 className="modal-title">Upload A File</h5>
                                    <button type="button" className="closeXbtn" onClick={handleCloseModal} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', background: 'transparent' }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button> <br />
                                    <div style={{ width: '80%', border: '1px dashed black', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <input type="file" className="btn btn-custom-primary mt-3" style={{ display: 'none' }} onChange={(e) => { handleFileUpload(e); }} id="fileUpload" />

                                        <label htmlFor="fileUpload" className="btn btn-custom-primary mt-3" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px', cursor: 'pointer' }}>
                                            Browse Computer
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ borderTop: 'none' }}>


                                {selectedFile && (
                                    <p className="selected-file">{selectedFile.name}</p>

                                )}

                                <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px', marginRight: '10px' }} onClick={handleCloseModal}>Cancel</button>
                                <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px' }} onClick={() => { handleCloseModal(); handleOpenModal2(); }}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal2 && (
                <div className="modal fade show d-block" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="d-flex flex-column align-items-center mt-2">
                                    <h2 className="modal-title">Confirm Upload ?</h2>
                                    <button type="button" className="close" onClick={handleCloseModal2} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', backgroundColor: 'transparent' }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button> <br />
                                </div>
                            </div>
                            <div className="d-flex justify-content-center text-center mb-5">
                                <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px', marginRight: '15px' }} onClick={handleCloseModal2}>Cancel</button>
                                <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px' }} onClick={() => { handleConfirmUpload(); handleCloseModal2(); handleUpload(); }}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* {Alerts} */}
            {
                updateTPAlert &&
                <AlertBox
                    Show={updateTPAlert}
                    Message={`Total Purchase Price Updated!`}
                    Type={'success'}
                    Redirect={``} />
            }

            {uploadedReceiptAlert &&
                <AlertBox
                    Show={uploadedReceiptAlert}
                    Message={`Receipt Uploaded!`}
                    Type={'success'} />
            }

        </div>
    );
};