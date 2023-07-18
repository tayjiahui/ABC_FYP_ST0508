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
import pendingCircle from "../../../public/yellowPendingCircle.svg";
import approvedCircle from "../../../public/greenApprovedCircle.svg";
import rejectedCircle from "../../../public/redRejectedCircle.svg";
import nextArrow from "../../../public/rightArrowWhite.svg";
import addLocIcon from "../../../public/addLocationIcon.svg";
import addIcon from "../../../public/plusIcon.svg";
import xIcon from "../../../public/xIcon.svg";

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
    console.log(params);
    console.log(poID);

    // Normal View PR by ID page
    const getAdHocDetails = await fetch(`${backBaseURL}/api/purchaseReq/adhoc/viewBy/${poID}`);

    const adHocDetails = await getAdHocDetails.json();

    console.log(adHocDetails);

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
    const [TargetDeliveryDate, setTargetDate] = useState();

    const [showInProg, setInProg] = useState(false);


    console.log("1dcsvfsv", AdHocDetails[0]);

    const AH = AdHocDetails[0];

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
                    <button onClick={handleOpenWip} className="rounded-4 mt-3 w-50 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284' }}>
                        <h4 className="col-sm text-white pt-2">Upload Receipt</h4><br></br>
                        {showInProg && <WIP Show={showInProg} />}
                    </button>
                </div>
            </div>
        </div>
    );
};