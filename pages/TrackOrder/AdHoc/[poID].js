import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import axios from "axios";

// styles
import styles from '../../../styles/adHocByID.module.css';

// components
import WIP from '../../../components/WIP';

// Image
import arrowIcon from "../../../public/arrowIcon.svg";

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
    console.log(host);

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

    // Dates
    const [ReqDate, setReqDate] = useState();

    const [showInProg, setInProg] = useState(false);

    //INVOICE
    const [selectedFile, setSelectedFile] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [PDF, setPDF] = useState([]);

    const AH = AdHocDetails[0];
    const poID = AdHocDetails[0].prID;

    useEffect(() => {
        // Requested Date formatting
        const newReqDateFormat = moment(AH.requestedDate).format("DD MMM YYYY");
        setReqDate(newReqDateFormat);
    }, []);


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
                    'Content-Type': "multipart/form-data"
                }
            })
                .then(() => {
                    console.log('Invoice uploaded successfully!!');
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
            </div>

            <div className="pb-3 pt-4">
                <h3 className="col-sm ms-5">Upload Ad-Hoc Receipt</h3>
                <div className={styles.lineContainer}>
                    <hr className={styles.lineDivider}></hr>
                </div>

                <div className="ps-3 pt-3 pb-5">
                    <button onClick={handleOpenModal} className="rounded-4 mt-3 w-50 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284' }}>
                        <h4 className="col-sm text-white pt-2">Upload Receipt</h4><br></br>
                        {showInProg && <WIP Show={showInProg} />}
                    </button>
                </div>
            </div>

            <div className="mt-4 ms-5">
                {PDF ? (
                    <iframe src={`data:application/pdf;base64,${PDF}`} width="70%" height="500px" />
                ) : (
                    <p>No Invoice uploaded currently.</p>
                )}
            </div>

            {/* INVOICE PDF */}
            {showModal && (
                <div className="modal fade show d-block" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="d-flex flex-column align-items-center">
                                    <h5 className="modal-title">Upload A File</h5>
                                    <button type="button" className="closeXbtn" onClick={handleCloseModal} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5' }}>
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
        </div>
    );
};