import { useState } from "react";
import { useRouter } from 'next/router';

import AlertBox from "../components/alert";

export default function YourComponent() {
    const router = useRouter();

    const [showAlert, setShowAlert] = useState(false);

    const openAlertBox = () => {
        setShowAlert(true);
        alertTimer();
        // if there is page redirection after
        // setTimeout(()=> {router.push('/PurchaseRequest')}, 5000)
    };

    function alertTimer() {
        // changes all alert useStates to false after 3s
        setTimeout(alertFunc, 3000);
    };

    function alertFunc() {
        // list of alerts useStates in your page
        setShowAlert(false);
    };

    return (
        <div>
            <div className="py-5">
                <button className="btn btn-dark" onClick={openAlertBox}>OPEN ALERT</button>
            </div>

            {
                showAlert &&
                <AlertBox
                    Show={showAlert}
                    Message={`SUCCESS!`}
                    // Type refer to bootstrap alert type
                    // alert colour options refer to: https://www.geeksforgeeks.org/react-bootstrap-alerts-component/
                    // "success" => green[for success actions]
                    // "danger"  => red [for failed actions]
                    Type={`success`}
                    Redirect={`/PurchaseRequest`} />
            }
            
            <div className="h-100 m-5 p-5"></div>
            <div className="h-100 m-5 p-5"></div>
            <div className="h-100 m-5 p-5"></div>
            <div className="h-100 m-5 p-5"></div>
            <div className="h-100 m-5 p-5"></div>
            
        </div>
    );
}