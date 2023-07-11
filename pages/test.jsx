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
}

// function AlertBox(props) {
//   return (
//     <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//   <div class="modal-dialog">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title" id="staticBackdropLabel">Modal title</h5>
//         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//       </div>
//       <div class="modal-body">
//         ...
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Understood</button>
//       </div>
//     </div>
//   </div>
// </div>
//   );
// }

export default function YourComponent() {
  const [selectedOption, setSelectedOption] = useState({ value: "", id: "" });

  // const [invoiceUrl, setInvoiceUrl] = useState(null);

  const [showAlert1, setShowAlert1] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);

  const [modal, setModal] = useState();

  useEffect(() => {
    const modal = [];

    modal.push(
      <div>
        <div>
          <h1>I AM HERE</h1>
          <AlertBox Show={showAlert1} Body={`HELOOO`} />
        </div>
      </div>
    );
    setModal(modal);
  }, []);

  // Your component code

  const handleInputChange = (e) => {
    const [value, id] = getOptionId(e);
    setSelectedOption({ value: value, id: id });
  };

  const changeMe1 = () => {
    console.log("BUTTON 1");
    if (showAlert1 === false) {
      console.log(true);
      setShowAlert1(true);

      // 3 seconds timer
      myFunction();
    } else {
      console.log(false);
      setShowAlert1(false);
    }
  };

  const handleOpenModal = () => {
    setShowAlert1(true);
    myFunction();
  };

  const handleCloseModal = () => {
    setShowAlert1(false);
  };

  const changeMe2 = () => {
    console.log("BUTTON 2");
    if (showAlert2 === false) {
      console.log(true);
      setShowAlert2(true);
    } else {
      console.log(false);
      setShowAlert2(false);
    }
  };

  function myFunction() {
    setTimeout(alertFunc, 3000);
  }

  function alertFunc() {
    console.log("HELLO CAN YOU WORK PLS");
    setShowAlert1(false);
    console.log(showAlert1);
  }

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

      <a href="http://localhost:8080/invoice">
        <button>CLICK ME</button>
      </a>
      <div className="py-5">
        <button
          onClick={changeMe1}
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          click me for alert 1
        </button>
      </div>

      <div>
        <button
          onClick={changeMe2}
          className="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          click me for alert 2
        </button>
      </div>

      {/* <AlertBox
        showModal={showAlert1}
        handleCloseModal={handleCloseModal}
        title="My Modal Title"
        content="This is the content of the modal"
      /> */}

      {
        showAlert1 &&
        <div>
          <h1>HXSHXDKJCHKD</h1>
          <AlertBox
            Show={showAlert1}
            Body={`HELOOO`} />
        </div>
      }

      {/* <AlertBox 
              Show={showAlert1}
              Body={`HELOOO`}/> */}

      {/* <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Modal title
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
