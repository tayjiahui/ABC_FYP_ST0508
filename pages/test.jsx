import { useEffect, useState } from "react";

import AlertBox from "../components/alert";

function getOptionId(e) {
  // console.log(e);
  const selectedValue = e.target.value;
  // console.log("value print" + selectedValue);
  const selectedOption = Array.from(e.target.list.options).find(
    (option) => option.value === selectedValue
  );
  const selectedId = selectedOption
    ? selectedOption.getAttribute("data-id")
    : "";
  // console.log("id print" + selectedId);

  const returnArr = [selectedValue, selectedId];

  return returnArr;
};

export default function YourComponent() {
  const [selectedOption, setSelectedOption] = useState({ value: "", id: "" });

  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    const [value, id] = getOptionId(e);
    setSelectedOption({ value: value, id: id });
  };

  const openAlertBox = () => {
    if (showAlert === false) {
      setShowAlert(true);
      alertTimer();
    } else {
      setShowAlert(false);
    };
  };

  function alertTimer() {
    setTimeout(alertFunc, 3000);
  };

  function alertFunc() {
    setShowAlert(false);
  };

  return (
    <div>
      <input list="options" onChange={handleInputChange} />
      <datalist id="options">
        <div>
          <option value="Option 1" data-id="1" />
        </div>
        <div>
          <option value="Option 2" data-id="2" />
        </div>
        <div>
          <option value="Option 3" data-id="3" />
        </div>
      </datalist>
      <p>Selected Value: {selectedOption.value}</p>
      <p>Selected ID: {selectedOption.id}</p>

      <div className="py-3">
        <a href="http://localhost:8080/invoice">
          <button className="btn btn-danger">CLICK ME FOR PDF</button>
        </a>
      </div>

      <div className="py-3">
        <a href="http://localhost:8080/excel">
          <button className="btn btn-success">CLICK ME FOR EXCEL</button>
        </a>
      </div>

      <div className="py-3">
        <a href="http://localhost:8080/csv">
          <button className="btn btn-warning">CLICK ME FOR CSV</button>
        </a>
      </div>


      <div className="py-3">
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
