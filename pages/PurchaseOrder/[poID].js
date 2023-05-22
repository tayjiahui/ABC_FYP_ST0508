import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios";
import Image from "next/image"
import styles from '../../styles/viewPO.module.css';
import arrowIcon from '../../public/arrowIcon.svg';
function isLocalhost(url) {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

// const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// const baseUrl = API_URL;
const baseUrl = 'http://localhost:3000';
const baseURL = 'http://localhost:5000';

export default function ViewPO() {

  const router = useRouter()
  const poID = router.query.poID
  const [supplierName, setSupplierName] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [fileUpload, setFileUpload] = useState(false);
  //statuses
  const [status, setStatus] = useState([]);
  const [selectedStatus2, setSelectedStatus2] = useState('');
  //create status
  const [newStatusPop, setNewStatusPop] = useState(false); //status pop up
  const [statusInput, setStatusInput] = useState([]);



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
    setShowModal(true);
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  }

  useEffect(() => {
    axios.get(`${baseUrl}/api/purchaseOrder/`)
      .then(res => {
        console.log(res.data[0].supplierName);
        console.log(res.data[0])
        setSupplierName(res.data[0].supplierName);
        console.log(supplierName+"!")

        axios.get(`${baseUrl}/api/paymentTrack/supplier/${supplierName}`)
          .then(res => {
            console.log(res.data[0]);
            setSupplierInfo(res.data[0]);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, []);

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
          <a href={baseURL + "/TrackPayment"}>
            <Image src={arrowIcon} className={styles.back} />
          </a>
          <p className={styles.title}>Purchase Order #{poID}</p>
        </h1>
      </div>

      <div className={styles.dropContainer}>


        {/* <div className={styles.dropdown1}>
          <div className={styles.dropColumn}>
            <p className={styles.dropTitle}>Payment Status: </p>
            <select className={styles.dropDown} value={selectedStatus} onChange={handleStatusChange}>
              <option value="option1">Pending</option>
              <option value="option2">Payment Sent</option>
              <option value="option3">Payment Received</option>
              <option value="option4">+ Create New Status</option>
            </select>
          </div>
        </div> */}

        <div className={styles.dropdown1}>
          <div className={styles.dropColumn}>
            <p className={styles.dropTitle}>Payment Status: </p>
            <select className={styles.dropDown} value={selectedStatus2} onChange={handleStatusChange2}>
              {status.map((status, index) => (
                <option key={index} value={status.paymentStatus}>{status.paymentStatus}</option>
              ))}
              <option value="+ Create New Status"> + Create New Status</option>
            </select>
          </div>
        </div>


        <div className={styles.dropdown2}>
          <div className={styles.dropColumn}>
            <p className={styles.dropTitle}>Payment Mode: </p>
            <select className={styles.dropDown} disabled>
              <option value="option1">Bank Transfer</option>
              <option value="option2">Cash on Delivery</option>
              <option value="option3">+ New Method</option>
            </select>
          </div>
        </div>
      </div>

      {fileUpload && (
        <div className={styles.rectangleContainer}>
          <div className={styles.rectangle}>PO #001 Receipt</div>
        </div>
      )}

      <div>

        <button className={styles.uploadButton} onClick={handleOpenModal} >Upload Receipt</button>
        {showModal && (
          <div className={styles.modalcontainer}>
            <div className={styles.modalBox}>
              <h2 className={styles.uploadText}>Upload A File</h2>
              <button onClick={handleCloseModal} className={styles.closeme}>X</button>

              <div className={styles.innerBox}>
                <p className={styles.firstText}>Drag and drop file here</p>
                <p>or</p>
                <button className={styles.browseButton}>Browse Computer</button>
              </div>

              <div className={styles.twoButtons}>
                <button className={styles.cancelBtn} onClick={handleCloseModal} >Cancel</button>
                <button className={styles.uploadBtn} onClick={handleOpenModal2} >Upload</button>
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

      <div className={styles.supplierInfo}>
        <p className={styles.supText}>Supplier Information </p>

        <hr></hr>

        <div className={styles.firstRow}>
          <b className={styles.firstTitle}>Supplier Name </b>
          <b className={styles.firstTitle}>Contact Person </b>
          <b className={styles.firstTitle}>Phone Number </b>
          <b className={styles.firstTitle}>Email </b>
        </div>

        <div className={styles.firstRData}>
          <p className={styles.firstData1}>{supplierInfo.supplierName}</p>
          <p className={styles.firstData2}>{supplierInfo.contactPersonName}</p>
          <p className={styles.firstData3}>{supplierInfo.phoneNum} </p>
          <p className={styles.firstData4}>{supplierInfo.email} </p>
        </div>

        <div className={styles.secondRow}>
          <b className={styles.secondTitle1}>Bank Account Number </b>
          <b className={styles.secondTitle2}>Category </b>
          <b className={styles.secondTitle3}>Office Number </b>
          <b className={styles.secondTitle4}>Address </b>
        </div>

        <div className={styles.secondRData}>
          <p className={styles.secondData1}>{supplierInfo.bankAccountNum}</p>
          <p className={styles.secondData2}>{supplierInfo.categoryName}</p>
          <p className={styles.secondData3}>{supplierInfo.officeNum} </p>
          <p className={styles.secondData4}>{supplierInfo.address} </p>
        </div>

        <hr></hr>

      </div>


      <div className={styles.remarkSection}>
        <b className={styles.remarkText}>Remarks </b> <br />
        <input type="text" className={styles.remarksInput} />
      </div>

      <div className={styles.save}>
        <button className={styles.saveButton}> Save </button>
      </div>


    </>
  )
}