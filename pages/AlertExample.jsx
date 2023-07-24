import { useState } from "react";

import AlertBox from "../components/alert";

export default function YourComponent() {

  const [showAlert, setShowAlert] = useState(false);

  const openAlertBox = () => {
    if (showAlert === false) {
      setShowAlert(true);
      alertTimer();
    } else {
      setShowAlert(false);
    };
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
        setShowAlert &&
        <AlertBox
          Show={showAlert}
          Message={`SUCCESS!`}
          // Type refer to bootstrap alert type
          // alert colour options refer to: https://www.geeksforgeeks.org/react-bootstrap-alerts-component/
          // "success" => green[for success actions]
          // "danger"  => red [for failed actions]
          Type={`success`} />
      }
    </div>
  );
}