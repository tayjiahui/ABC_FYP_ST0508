import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"
import axios from "axios";
import Image from "next/image"
import styles from '../../styles/viewPO.module.css';
import arrowIcon from '../../public/arrowIcon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';



function isLocalhost(url) {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

// const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// const baseUrl = API_URL;
// const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';

const baseURL = 'http://localhost:5000';




export async function getServerSideProps(context) {
  const { params } = context;
  const { poID } = params;

  // console.log( "id" + poID)

  const paymentTrackResponse = await fetch(`${baseUrl}/api/paymentTrack/supplier/pr/${poID}`);

  const response1 = await paymentTrackResponse.json();
  const supplierID = response1[0].supplierID;

  // console.log(response1);
  // console.log(supplierID);

  const supplierInfoResponse = await fetch(`${baseUrl}/api/paymentTrack/supplier/info/${supplierID}`);
  const supplierInfo = await supplierInfoResponse.json();

  // console.log(response2);
  // console.log(supplierInfo);

  return {
    props: {
      poID,
      supplierDetail: supplierInfo
    }
  }

  // try {
  //   // const purchaseOrderResponse = await axios.get(`${baseUrl}/api/purchaseOrder/`);
  //   // const prID = purchaseOrderResponse.data[0].prID;

  //   const paymentTrackResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/pr/${prId}`);
  //   // const supplierID = await paymentTrackResponse.data[0].supplierID;
  //   const supplierID = await supplierInfoResponse.json();
  //   console.log(supplierID);

  //   const supplierInfoResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/info/${supplierID}`);
  //   const supplierInfo =  await supplierInfoResponse.data;
  //   // const supplierInfo = await supplierInfoResponse.json();

  //   return {
  //     props: {
  //       supplierDetails: supplierInfo
  //     },
  //   };
  // } 
  // catch (error) {
  //   console.log( "error" + error);
  // }
}

export default function ViewPO({ supplierDetail }) {
  const router = useRouter()
  const poID = router.query.poID
  // const [supplierName, setSupplierName] = useState([]);
  // const [supplierInfo, setSupplierInfo] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  const [fileDisplay, setFileDisplay] = useState(false);
  // const [prID, setprID] = useState(false);
  // const [supplierID, setsupplierID] = useState(false);
  //statuses
  const [status, setStatus] = useState([]);
  const [selectedStatus2, setSelectedStatus2] = useState('');
  //create status
  const [newStatusPop, setNewStatusPop] = useState(false); //status pop up
  const [statusInput, setStatusInput] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);

  const supplierDetails = supplierDetail[0];


  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  }

  const handleSave = () => {
    alert(`Status :${selectedStatus2}, Remakrs : ${remarks}`)

    axios.get(`${baseUrl}/api/paymentTrack/status/${selectedStatus2}`)
      .then(res => {
        console.log(res.data[0].PaymentStatusID)
      })
      .catch((err) => {
        console.log(err)
      })


  }


  const handleOpenReceipt = () => {
    setFileDisplay(true);
  }

  const handleCloseReceipt = () => {
    setFileDisplay(false);
  }

  const handleCloseStatusPop = () => {
    setNewStatusPop(false);
  }

  const handleInputChange = (event) => {
    setStatusInput(event.target.value);
  }

  const handleSubmit = (event) => {
    // event.preventDefault();
    alert(statusInput);


    axios.post(`${baseUrl}/api/paymentTrack/`, {
      paymentStatus: statusInput
    })
      .then(res => {
        alert(`sucessfully created new status ${statusInput}`)
        setNewStat(false)
        console.log(res.data);
        setStatus((prevStatus) => [...prevStatus, res.data]);
        onSubmit(statusInput)
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // const handleNewStatus = () => {
  //   setStatusModal(true);
  // }

  const handleCloseModal2 = () => {
    setShowModal2(false);
  }

  const handleOpenModal2 = () => {
    setShowModal2(true);
  }

  const handleConfirmUpload = () => {
    setShowModal(false);
    setShowModal2(false);
    setFileUpload(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleOpenModal = () => {
    console.log(selectedStatus2.paymentStatus)
    setShowModal(true);
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  }


  useEffect(() => {
    axios.get(`${baseUrl}/api/paymentTrack/`)
      .then(res => {
        console.log(res.data)
        setStatus(res.data);
        setSelectedStatus2(res.data[0]); //initiall selected status -> res.data[0] is pending.
      })
      .catch(err => console.log(err));
  }, []);

  const handleStatusChange2 = (event) => {
    setSelectedStatus2(event.target.value);
    const selectedValue = event.target.value;
    if (selectedValue === "+ Create New Status") {
      setNewStatusPop(true);
    }
    else {
      console.log('other options')
    }
  };



  return (
    <>
      <div className={styles.poHeader}>
        <h1>
          <a href={"/PurchaseOrder"}>
            <Image src={arrowIcon} className={styles.back} />
          </a>
          <p className={styles.title}>Purchase Order #{poID}</p>
        </h1>
      </div>

      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-md-5 offset-md-1">
            <div className="form-group">
              <label htmlFor="paymentStatus">Payment Status:</label>
              <select className="form-control" id="paymentStatus" value={selectedStatus2} onChange={handleStatusChange2}>
                {status.map((status, index) => (
                  <option key={index} value={status.paymentStatus}>{status.paymentStatus}</option>
                ))}
                <option value="+ Create New Status"> + Create New Status</option>
              </select>
            </div>
          </div>

          <div className="col-md-5">
            <div className="form-group">
              <label htmlFor="paymentMode">Payment Mode:</label>
              <select className="form-control" id="paymentMode" disabled>
                <option value="option1">Bank Transfer</option>
                <option value="option2">Cash on Delivery</option>
                <option value="option3">+ New Method</option>
              </select>
            </div>
          </div>
        </div>
      </div>


      {fileUpload && (
        <div className="mt-4">
          <div className="col-md-2 offset-md-1" style={{ border: '1px dashed black', padding: '10px', borderRadius: '7px' }}>
            <div className="text-center" onClick={handleOpenReceipt}>{selectedFile.name}</div>
          </div>
        </div>
      )}

      <div>

        <div className="mt-5">
          <div className="col-md-6 offset-md-1">
            <button className={`btn ${selectedStatus2.paymentStatus === 'Pending' ? 'disabled' : ''} `} style={{ backgroundColor: '#486284', borderRadius: '50px', color: 'white', padding: '15px' }} onClick={handleOpenModal} disabled={selectedStatus2.paymentStatus === 'Pending'}>Upload Receipt</button>
          </div>
        </div>


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
                      <p className="mb-3">Drag and drop file here</p>
                      <p>or</p>
                      <input type="file" className="btn btn-custom-primary mt-3" style={{ display: 'none' }} onChange={handleFileUpload} id="fileUpload" />

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
                  <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px' }} onClick={handleOpenModal2}>Upload</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showModal2 && (
          <div className={styles.modalcontainer2}>
            <div className={styles.modalBox2}>
              <h2 className={styles.uploadConfirm}> Confirm Upload ?</h2>
              <button onClick={handleCloseModal2} className={styles.closeme2}>X</button>
            </div>

            <div className={styles.uploadButtons}>
              <button className={styles.cancelBtn2} onClick={handleCloseModal2} >Cancel</button>
              <button className={styles.uploadBtn2} onClick={handleConfirmUpload}>Upload</button>
            </div>

          </div>
        )}

        {fileDisplay && (
          <div className={styles.displayReceipt}>
            <button onClick={handleCloseReceipt} className={styles.closeReceipt}>X</button>

            <h2>proof of payment / receipt</h2>
          </div>
        )}

        {newStatusPop && (
          <div className={styles.newStatusBox}>
            <div className={styles.newStatus}>
              <h2 className={styles.newStatusText}> Create New Status </h2>
              <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
              <form onSubmit={handleSubmit}>
                <label htmlFor="statusInput">Enter status name : </label> <br />
                <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
                <button type="submit" className={styles.createStatusBtn}> Create Status</button>
              </form>

            </div>
          </div>
        )}


      </div>

      <div className="containersupplier mt-5 m-auto col-10">
        <div className="row row-cols-4">
          <h4 className="col-12 mt-10">Supplier Information</h4>
          <div className="col-12">
            <hr /> <br />
          </div>
          <div className="col">
            <div>
              <b>Supplier Name</b>
            </div>
            <div>
              <p>{supplierDetails.supplierName}</p>
            </div>
          </div>
          <div className="col">
            <div>
              <b>Contact Person</b>
            </div>
            <div>
              <p>{supplierDetails.contactPersonName}</p>
            </div>
          </div>
          <div className="col">
            <div>
              <b>Phone Number</b>
            </div>
            <div>
              <p>{supplierDetails.phoneNum}</p>
            </div>
          </div>
          <div className="col">
            <div>
              <b>Email</b>
            </div>
            <div>
              <p>{supplierDetails.email}</p>
            </div>
            <br></br>
          </div>
        </div>
        <div className="row row-cols-4 mb-0">
          <div className="col">
            <div>
              <b>Category</b>
            </div>
            <div>
              <p>{supplierDetails.categoryName}</p>
            </div>
          </div>
          <div className="col">
            <div>
              <b>Bank Account Number</b>
            </div>
            <div>
              <p>{supplierDetails.bankAccountNum}</p>
            </div>
          </div>
          <div className="col">
            <div>
              <b>Office Number</b>
            </div>
            <div>
              <p>{supplierDetails.officeNum}</p>
            </div>
          </div>
          <div className="col">
            <div>
              <b>Address</b>
            </div>
            <div>
              <p>{supplierDetails.address}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <hr className="mt-0" />
          </div>
        </div>
      </div>






      <div className="row">
  <div className="col-md-10 offset-md-1">
    <div className="mb-4 mt-5">
      <b className="d-inline-block">Remarks</b> <br />
      <input
        type="text"
        className="form-control mt-2"
        style={{
          height: '200px',
          width: '100%',
          maxWidth: '2000px'
        }}
        onChange={handleRemarksChange}
      />
    </div>
  </div>
</div>


      {/*   <div className="mt-5">
          <div className="col-md-6 offset-md-1">
            <button className={`btn ${selectedStatus2.paymentStatus === 'Pending' ? 'disabled' : ''} `} style={{ backgroundColor: '#486284', borderRadius: '50px', color: 'white', padding: '15px' }} onClick={handleOpenModal} disabled={selectedStatus2.paymentStatus === 'Pending'}>Upload Receipt</button>
          </div>
        </div> */}



      <div className={styles.save}>
        <button className={styles.saveButton} onClick={handleSave}> Save </button>
      </div>


    </>
  )
}

// export async function getServerSideProps() {
//   const baseUrl = 'http:localhost:3000';

//   try {
//     const purchaseOrderResponse = await axios.get(`${baseUrl}/api/purchaseOrder/`);
//     const prID = purchaseOrderResponse.data[0].prID;

//     const paymentTrackResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/pr/${prID}`);
//     const supplierID = paymentTrackResponse.data[0].supplierID;

//     const supplierInfoResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/info/${supplierID}`);
//     const supplierInfo = supplierInfoResponse.data[0];

//     return {
//       props: {
//         supplierInfo,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       props: {
//         supplierInfo: null,
//       },
//     };
//   }
// }
