import { useEffect, useState } from "react";
import axios from "axios";

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
  // dropdown
  const [selectedOption, setSelectedOption] = useState({ value: "", id: "" });

  // generate custom excel
  const [CustomForm, setCustomForm] = useState(false);
  const [StartDate, setStartDate] = useState();
  const [EndDate, setEndDate] = useState();
  const [ExcelFile, setExcelFile] = useState(true);
  const [CSVFile, setCSVFile] = useState(false);

  // alert
  const [showAlert, setShowAlert] = useState(false);

  // check if date inputs are filled
  useEffect(() => {
    if (StartDate && EndDate) {
      setCustomForm(true);
    } else {
      setCustomForm(false);
    };
  }, [StartDate, EndDate]);

  const handleInputChange = (e) => {
    const [value, id] = getOptionId(e);
    setSelectedOption({ value: value, id: id });
  };

  const handlFileType = async (e) => {
    console.log(e);
    console.log(e.target.value);

    if (e.target.value === 'Excel') {
      setExcelFile(true);
      setCSVFile(false);
    } else {
      setExcelFile(false);
      setCSVFile(true);
    };
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

      <div className="card">
        <form className="ps-4 py-3">
          <h5>Custom Excel</h5>
          <div className="py-3">
            <label>Start Date:</label>
            <input type="date" onChange={e => setStartDate(e.target.value)} required />
          </div>

          <div className="py-3">
            <label>End Date:</label>
            <input type="date" onChange={e => setEndDate(e.target.value)} required />
          </div>

          <div className="py-3">
            <label>File Type:</label>
            <select onChange={handlFileType}>
              <option selected="selected">Excel</option>
              <option>CSV</option>
            </select>
          </div>

          <div className="py-2">
            {
              CustomForm ? (
                <>
                  {
                    ExcelFile && (
                      <a href={`http://localhost:3000/api/xlsx/excel/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
                        <button type="button" className="btn btn-dark">
                          Generate Report
                        </button>
                      </a>
                    )}
                  {
                    CSVFile &&
                    <a href={`http://localhost:3000/api/xlsx/csv/Date?startDate=` + StartDate + `&endDate=` + EndDate}>
                      <button type="button" className="btn btn-dark">
                        Generate Report
                      </button>
                    </a>
                  }
                </>
              ) : (
                <button type="submit" className="btn btn-dark">
                  Generate Report
                </button>
              )
            }
          </div>
        </form>
      </div>

      <div className="d-flex">
        <div className="py-3 pe-3">
          <a href="http://localhost:8080/invoice">
            <button className="btn btn-danger">CLICK ME FOR PDF</button>
          </a>
        </div>

        <div className="py-3 pe-3">
          <a href="http://localhost:8080/excel">
            <button className="btn btn-success">CLICK ME FOR EXCEL</button>
          </a>
        </div>

        <div className="py-3 pe-3">
          <a href="http://localhost:8080/excel/helooo" >
            <button className="btn btn-info">CLICK ME FOR SPECIAL EXCEL</button>
          </a>
        </div>

        <div className="py-3 pe-3">
          <a href="http://localhost:8080/csv">
            <button className="btn btn-warning">CLICK ME FOR CSV</button>
          </a>
        </div>
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
