import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import moment from 'moment-timezone';
import axios from "axios";

// styles
import styles from '../../../styles/adHocByID.module.css';
import styles2 from '../../../styles/viewPR.module.css';

// Component
import AlertBox from "../../../components/alert";

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

    const backBaseURL = [];

    if (host == "localhost:5000") {
        backBaseURL.push("http://localhost:3000");
    } else {
        backBaseURL.push("https://abc-cooking-studio-backend.azurewebsites.net");
    };

    const { params } = context;
    const { prID } = params;

    // Normal View PR by ID page
    const getAdHocDetails = await fetch(`${backBaseURL}/api/purchaseReq/adhoc/viewBy/${prID}`);

    const adHocDetails = await getAdHocDetails.json();

    return {
        props: {
            host,
            AdHocDetails: adHocDetails,
            prID
        },
    };
};

export default function ViewAdHoc({ AdHocDetails }) {
    const router = useRouter();

    const prID = router.query.prID;

    const [id, setUserID] = useState();
    const [Token, setToken] = useState();

    const [Circle, testCircle] = useState();

    // Dates
    const [ReqDate, setReqDate] = useState();

    // Acknowledgement Section
    const [ApprComment, setApprComment] = useState();

    const [isAdmin, setAdmin] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Alert Box
    const [ApprovedAlert, setApprAlert] = useState(false);

    const AH = AdHocDetails[0];

    useEffect(() => {
        // set user id taken from localstorage
        const userID = parseInt(localStorage.getItem("ID"), 10);
        setUserID(userID);

        // set user role
        const roleID = parseInt(localStorage.getItem("roleID"), 10);

        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        // check if admin/ approver
        if (roleID === 1) {
            setAdmin(true);
        };

        // Requested Date formatting
        const newReqDateFormat = moment(AH.requestedDate).format("D MMM YYYY");
        setReqDate(newReqDateFormat);

        // Test for status Circle
        const statusID = AH.prStatusID;

        function circleTest(statusID) {
            if (statusID == 1) {
                setIsPending(true);
                return "/yellowPendingCircle.svg";
            } else if (statusID == 4) {
                setIsApproved(true);
                return "/greenApprovedCircle.svg";
            }
        };

        const circle = circleTest(statusID);
        testCircle(circle);
    }, []);

    // alert box timer
    function alertTimer() {
        setTimeout(alertFunc, 3000);
    };

    function alertFunc() {
        setApprAlert(false);
    };

    const submitApproval = async (e) => {
        e.preventDefault();

        await axios.put(`${baseUrl}/api/purchaseReq/PR/${prID}`,
            {
                comments: ApprComment,
                prStatusID: 4,
                apprUserID: id,
            },
            {
                headers: {
                    authorization: 'Bearer ' + Token
                }
            }
        )
            .then((response) => {

                setApprAlert(true);
                // timer to reset to false
                alertTimer();

                // set timer before redirect
                setTimeout(() => { router.push("/PurchaseRequest") }, 3000);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
                    localStorage.clear();
                    signOut({ callbackUrl: '/Unauthorised' });
                }
                else {
                    console.log(err);
                };
            });

    };

    return (
        <div>
            <h1 className='firstHeaderTop'>
                <a href={"/PurchaseRequest"} className='purchaseOrderNo'>
                    <Image src={arrowIcon} className="col-sm pr-2 pb-2" alt="Back" />
                </a>Ad Hoc Purchase #{AH.prID}
                <Image
                    src={Circle}
                    alt="PR Status"
                    width={25}
                    height={25}
                    className={styles2.statusCircle}
                />
            </h1>

            {/* Ad Hoc Details */}
            <div className="px-5">
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
            </div>

            <div className={styles.lineContainer}>
                <hr className={styles.lineDivider}></hr>
            </div>

            {/* Approver's Section */}
            {
                isPending && isAdmin &&
                <div className="pt-3">
                    <div className="px-5 mx-5 pb-5 pt-2">
                        <h2>Acknowledge Ad Hoc Purchase?</h2>
                        <form>
                            <div className="py-3 mb-3">
                                <p>Comments</p>
                                <textarea value={ApprComment} onChange={(e) => setApprComment(e.target.value)} className={styles2.textArea} ></textarea>
                            </div>

                            <div className="py-3">
                                <div className={styles2.apprButtons}>
                                    <button onClick={submitApproval} className={styles2.ackButton}>
                                        <div className="px-2">Acknowledge</div>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            }


            {
                ApprovedAlert &&
                <AlertBox
                    Show={ApprovedAlert}
                    Message={`Ad Hoc Purchase #${prID} has been Acknowledged!`}
                    Type={'success'}
                    Redirect={'/PurchaseRequest'} />
            }
        </div>
    );
};