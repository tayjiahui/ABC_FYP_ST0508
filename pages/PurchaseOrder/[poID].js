// import { useRouter } from "next/router"
// import { useEffect, useState } from "react"
// import axios from "axios";
// import Image from "next/image"
// import styles from '../../styles/viewPO.module.css';
// import arrowIcon from '../../public/arrowIcon.svg';


// function isLocalhost(url) {
//   return url.includes('localhost') || url.includes('127.0.0.1');
// }

// // const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// // const baseUrl = API_URL;
// const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
// const baseURL = 'http://localhost:5000';

// export default function ViewPO() {

//   const router = useRouter()
//   const poID = router.query.poID
//   const [supplierName, setSupplierName] = useState([]);
//   const [supplierInfo, setSupplierInfo] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("Pending");
//   const [showModal, setShowModal] = useState(false);
//   const [showModal2, setShowModal2] = useState(false);
//   const [fileUpload, setFileUpload] = useState(false);
//   const [fileDisplay, setFileDisplay] = useState(false);
//   const [prID, setprID] = useState(false);
//   const [supplierID, setsupplierID] = useState(false);
//   //statuses
//   const [status, setStatus] = useState([]);
//   const [selectedStatus2, setSelectedStatus2] = useState('');
//   //create status
//   const [newStatusPop, setNewStatusPop] = useState(false); //status pop up
//   const [statusInput, setStatusInput] = useState([]);
//   const [remarks, setRemarks] = useState([]);


//   //saving of page
//   const handleRemarksChange = (event) => {
//     setRemarks(event.target.value);
//   }

//   const handleSave = () => {
//     alert(`Status :${selectedStatus2}, Remarks : ${remarks}`)

//     axios.get(`${baseUrl}/api/paymentTrack/status/${selectedStatus2}`)
//       .then(res => {
//         console.log(res.data[0].PaymentStatusID)
//       })
//       .catch((err) => {
//         console.log(err)
//     })
    
    

//   }
//   //saving of page end


//   const handleOpenReceipt = () => {
//     setFileDisplay(true);
//   }

//   const handleCloseReceipt = () => {
//     setFileDisplay(false);
//   }

//   const handleCloseStatusPop = () => {
//     setNewStatusPop(false);
//   }

//   const handleInputChange = (event) => {
//     setStatusInput(event.target.value);
//   }

//   const handleSubmit = (event) => {
//     // event.preventDefault();
//     alert(statusInput);


//     axios.post(`${baseUrl}/api/paymentTrack/`, {
//       paymentStatus: statusInput
//     })
//       .then(res => {
//         alert(`sucessfully created new status ${statusInput}`)
//         setNewStat(false)
//         console.log(res.data);
//         setStatus((prevStatus) => [...prevStatus, res.data]);
//         onSubmit(statusInput)
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   }

//   // const handleNewStatus = () => {
//   //   setStatusModal(true);
//   // }

//   const handleCloseModal2 = () => {
//     setShowModal2(false);
//   }

//   const handleOpenModal2 = () => {
//     setShowModal2(true);
//   }

//   const handleConfirmUpload = () => {
//     setShowModal(false);
//     setShowModal2(false);
//     setFileUpload(true);
//   }

//   const handleCloseModal = () => {
//     setShowModal(false);
//   }

//   const handleOpenModal = () => {
//     console.log(selectedStatus2.paymentStatus)
//     setShowModal(true);
//   }


//   useEffect(() => {
//     axios.get(`${baseUrl}/api/purchaseOrder/`)
//       .then(res => {
//         console.log(res.data[0].prID);
//         setprID(res.data[0].prID);
//         console.log(res.data[0].prID);

//         axios.get(`${baseUrl}/api/paymentTrack/supplier/pr/${res.data[0].prID}`)
//           .then(res => {
//             console.log(res.data[0].supplierID);
//             setsupplierID(res.data[0].supplierID);

//             axios.get(`${baseUrl}/api/paymentTrack/supplier/info/${res.data[0].supplierID}`)
//               .then(res => {
//                 console.log(res.data[0]);
//                 setSupplierInfo(res.data[0]);
//               })
//               .catch(err => console.log(err));
//           })
//           .catch(err => console.log(err));
//       })
//       .catch(err => console.log(err));
//   }, []);




//   useEffect(() => {
//     axios.get(`${baseUrl}/api/paymentTrack/`)
//       .then(res => {
//         console.log(res.data)
//         setStatus(res.data);
//         setSelectedStatus2(res.data[0]); //initiall selected status -> res.data[0] is pending.
//       })
//       .catch(err => console.log(err));
//   }, []);

//   const handleStatusChange2 = (event) => {
//     setSelectedStatus2(event.target.value);
//     const selectedValue = event.target.value;
//     if (selectedValue === "+ Create New Status") {
//       setNewStatusPop(true);
//     }
//     else {
//       console.log('other options')
//     }
//   };



//   return (
//     <>
//       <div className={styles.poHeader}>
//         <h1>
//           <a href={baseURL + "/PurchaseOrder"}>
//             <Image src={arrowIcon} className={styles.back} />
//           </a>
//           <p className={styles.title}>Purchase Order #{poID}</p>
//         </h1>
//       </div>

//       <div className={styles.dropContainer}>
//         <div className={styles.dropdown1}>
//           <div className={styles.dropColumn}>
//             <p className={styles.dropTitle}>Payment Status: </p>
//             <select className={styles.dropDown} value={selectedStatus2} onChange={handleStatusChange2}>
//               {status.map((status, index) => (
//                 <option key={index} value={status.paymentStatus}>{status.paymentStatus}</option>
//               ))}
//               <option value="+ Create New Status"> + Create New Status</option>
//             </select>
//           </div>
//         </div>


//         <div className={styles.dropdown2}>
//           <div className={styles.dropColumn}>
//             <p className={styles.dropTitle}>Payment Mode: </p>
//             <select className={styles.dropDown} disabled>
//               <option value="option1">Bank Transfer</option>
//               <option value="option2">Cash on Delivery</option>
//               <option value="option3">+ New Method</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {fileUpload && (
//         <div className={styles.rectangleContainer}>
//           <div className={styles.rectangle} onClick={handleOpenReceipt}>PO #001 Receipt</div>
//         </div>
//       )}

//       <div>

//         <button className={`${styles.uploadButton} ${selectedStatus2.paymentStatus === 'Pending' ? styles.disabledButton : ''}`} onClick={handleOpenModal} disabled={selectedStatus2.paymentStatus === 'Pending'} >Upload Receipt</button>
//         {showModal && (
//           <div className={styles.modalcontainer}>
//             <div className={styles.modalBox}>
//               <h2 className={styles.uploadText}>Upload A File</h2>
//               <button onClick={handleCloseModal} className={styles.closeme}>X</button>

//               <div className={styles.innerBox}>
//                 <p className={styles.firstText}>Drag and drop file here</p>
//                 <p>or</p>
//                 <button className={styles.browseButton}>Browse Computer</button>
//               </div>

//               <div className={styles.twoButtons}>
//                 <button className={styles.cancelBtn} onClick={handleCloseModal} >Cancel</button>
//                 <button className={styles.uploadBtn} onClick={handleOpenModal2} >Upload</button>
//               </div>

//             </div>
//           </div>
//         )}

//         {showModal2 && (
//           <div className={styles.modalcontainer2}>
//             <div className={styles.modalBox2}>
//               <h2 className={styles.uploadConfirm}> Confirm Upload ?</h2>
//               <button onClick={handleCloseModal2} className={styles.closeme2}>X</button>
//             </div>

//             <div className={styles.uploadButtons}>
//               <button className={styles.cancelBtn2} onClick={handleCloseModal2} >Cancel</button>
//               <button className={styles.uploadBtn2} onClick={handleConfirmUpload}>Upload</button>
//             </div>

//           </div>
//         )}

//         {fileDisplay && (
//           <div className={styles.displayReceipt}>
//             <button onClick={handleCloseReceipt} className={styles.closeReceipt}>X</button>

//             <h2>proof of payment / receipt</h2>
//           </div>
//         )}

//         {newStatusPop && (
//           <div className={styles.newStatusBox}>
//             <div className={styles.newStatus}>
//               <h2 className={styles.newStatusText}> Create New Status </h2>
//               <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
//               <form onSubmit={handleSubmit}>
//                 <label htmlFor="statusInput">Enter status name : </label> <br />
//                 <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
//                 <button type="submit" className={styles.createStatusBtn}> Create Status</button>
//               </form>

//             </div>
//           </div>
//         )}


//       </div>

//       <div className={styles.supplierInfo}>
//         <p className={styles.supText}>Supplier Information </p>

//         <hr></hr>

//         <div className={styles.firstRow}>
//           <b className={styles.firstTitle}>Supplier Name </b>
//           <b className={styles.firstTitle}>Contact Person </b>
//           <b className={styles.firstTitle}>Phone Number </b>
//           <b className={styles.firstTitle}>Email </b>
//         </div>

//         <div className={styles.firstRData}>
//           <p className={styles.firstData1}>{supplierInfo.supplierName}</p>
//           <p className={styles.firstData2}>{supplierInfo.contactPersonName}</p>
//           <p className={styles.firstData3}>{supplierInfo.phoneNum} </p>
//           <p className={styles.firstData4}>{supplierInfo.email} </p>
//         </div>

//         <div className={styles.secondRow}>
//           <b className={styles.secondTitle1}>Bank Account Number </b>
//           <b className={styles.secondTitle2}>Category </b>
//           <b className={styles.secondTitle3}>Office Number </b>
//           <b className={styles.secondTitle4}>Address </b>
//         </div>

//         <div className={styles.secondRData}>
//           <p className={styles.secondData1}>{supplierInfo.bankAccountNum}</p>
//           <p className={styles.secondData2}>{supplierInfo.categoryName}</p>
//           <p className={styles.secondData3}>{supplierInfo.officeNum} </p>
//           <p className={styles.secondData4}>{supplierInfo.address} </p>
//         </div>

//         <hr></hr>

//       </div>


//       <div className={styles.remarkSection}>
//         <b className={styles.remarkText}>Remarks </b> <br />
//         <input type="text" className={styles.remarksInput} value={remarks} onChange={handleRemarksChange} />
//       </div>

//       <div className={styles.save}>
//         <button className={styles.saveButton} onClick={handleSave}> Save </button>
//       </div>


//     </>
//   )
// }

// export async function  getServerSideProps(context) {
//   try {
   
//     const response = await axios.get(`${baseUrl}/api/paymentTrack/`);
//     const Data = {
//       status: response.data,
//     };

 
//     const prResponse = await axios.get(`${baseUrl}/api/purchaseOrder/`);
//     const prID = prResponse.data[0].prID;

//     const supplierResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/pr/${prResponse.data[0].prID}`);
//     const supplierID = supplierResponse.data[0].supplierID;

//     const supplierInfoResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/info/${supplierResponse.data[0].supplierID}`);
//     const supplierInfo = supplierInfoResponse.data[0];

//     return {
//       props: {
//         Data,
//         supplierInfo,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         Data: null,
//         supplierInfo: null,
//       },
//     };
//   }
// }

// WORKING VERSION --------------------------------------------------------

// import { useRouter } from "next/router"
// import { useEffect, useState } from "react"
// import axios from "axios";
// import Image from "next/image"
// import styles from '../../styles/viewPO.module.css';
// import arrowIcon from '../../public/arrowIcon.svg';
// import pendingImage from '../../public/redRejectedCircle.svg';
// import paymentSentImage from '../../public/yellowPendingCircle.svg';
// import paymentReceivedImage from '../../public/greenApprovedCircle.svg';

// function isLocalhost(url) {
//   return url.includes('localhost') || url.includes('127.0.0.1');
// }

// // const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// // const baseUrl = API_URL;
// // const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
// const baseUrl = 'http://localhost:3000';
// const baseURL = 'http://localhost:5000';

// export default function ViewPO() {

//   const router = useRouter()
//   const poID = router.query.poID
//   const [supplierName, setSupplierName] = useState([]);
//   const [supplierInfo, setSupplierInfo] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("Pending");
//   const [showModal, setShowModal] = useState(false);
//   const [showModal2, setShowModal2] = useState(false);
//   const [fileUpload, setFileUpload] = useState(false);
//   const [fileDisplay, setFileDisplay] = useState(false);
//   const [prID, setprID] = useState(false);
//   const [supplierID, setsupplierID] = useState(false);
//   //statuses
//   const [status, setStatus] = useState([]);
//   const [selectedStatus2, setSelectedStatus2] = useState('');
//   //create status
//   const [newStatusPop, setNewStatusPop] = useState(false); //status pop up
//   const [statusInput, setStatusInput] = useState([]);
//   const [remarks, setRemarks] = useState([]);


//   const handleRemarksChange = (event) => {
//     setRemarks(event.target.value);
//   }

//   const handleSave = () => {
//     alert(`Status :${selectedStatus2}, Remakrs : ${remarks}`)

//     axios.get(`${baseUrl}/api/paymentTrack/status/${selectedStatus2}`)
//       .then(res => {
//         console.log(res.data[0].PaymentStatusID)
//       })
//       .catch((err) => {
//         console.log(err)
//     })
    
  
//   }


//   const handleOpenReceipt = () => {
//     setFileDisplay(true);
//   }

//   const handleCloseReceipt = () => {
//     setFileDisplay(false);
//   }

//   const handleCloseStatusPop = () => {
//     setNewStatusPop(false);
//   }

//   const handleInputChange = (event) => {
//     setStatusInput(event.target.value);
//   }

//   const handleSubmit = (event) => {
//     // event.preventDefault();
//     alert(statusInput);


//     axios.post(`${baseUrl}/api/paymentTrack/`, {
//       paymentStatus: statusInput
//     })
//       .then(res => {
//         alert(`sucessfully created new status ${statusInput}`)
//         setNewStat(false)
//         console.log(res.data);
//         setStatus((prevStatus) => [...prevStatus, res.data]);
//         onSubmit(statusInput)
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   }

//   // const handleNewStatus = () => {
//   //   setStatusModal(true);
//   // }

//   const handleCloseModal2 = () => {
//     setShowModal2(false);
//   }

//   const handleOpenModal2 = () => {
//     setShowModal2(true);
//   }

//   const handleConfirmUpload = () => {
//     setShowModal(false);
//     setShowModal2(false);
//     setFileUpload(true);
//   }

//   const handleCloseModal = () => {
//     setShowModal(false);
//   }

//   const handleOpenModal = () => {
//     console.log(selectedStatus2.paymentStatus)
//     setShowModal(true);
//   }

//   const handleStatusChange = (e) => {
//     setSelectedStatus(e.target.value);
//   }


//   useEffect(() => {
//     axios.get(`${baseUrl}/api/purchaseOrder/`)
//       .then(res => {
//         console.log(res.data[0].prID);
//         setprID(res.data[0].prID);
//         console.log(res.data[0].prID);

//         axios.get(`${baseUrl}/api/paymentTrack/supplier/pr/${res.data[0].prID}`)
//           .then(res => {
//             console.log(res.data[0].supplierID);
//             setsupplierID(res.data[0].supplierID);

//             axios.get(`${baseUrl}/api/paymentTrack/supplier/info/${res.data[0].supplierID}`)
//               .then(res => {
//                 console.log(res.data[0]);
//                 setSupplierInfo(res.data[0]);
//               })
//               .catch(err => console.log(err));
//           })
//           .catch(err => console.log(err));
//       })
//       .catch(err => console.log(err));
//   }, []);




//   useEffect(() => {
//     axios.get(`${baseUrl}/api/paymentTrack/`)
//       .then(res => {
//         console.log(res.data)
//         setStatus(res.data);
//         setSelectedStatus2(res.data[0]); //initiall selected status -> res.data[0] is pending.
//       })
//       .catch(err => console.log(err));
//   }, []);

//   const handleStatusChange2 = (event) => {
//     setSelectedStatus2(event.target.value);
//     const selectedValue = event.target.value;
//     if (selectedValue === "+ Create New Status") {
//       setNewStatusPop(true);
//     }
//     else {
//       console.log('other options')
//     }
//   };



//   return (
//     <>
//       <div className={styles.poHeader}>
//         <h1>
//           <a href={baseURL + "/TrackPayment"}>
//             <Image src={arrowIcon} className={styles.back} />
//           </a>
//           <p className={styles.title}>Purchase Order #{poID}</p>
//         </h1>
//       </div>

//       <div className={styles.dropContainer}>
//         <div className={styles.dropdown1}>
//           <div className={styles.dropColumn}>
//             <p className={styles.dropTitle}>Payment Status: </p>
//             <select className={styles.dropDown} value={selectedStatus2} onChange={handleStatusChange2}>
//               {status.map((status, index) => (
//                 <option key={index} value={status.paymentStatus}>{status.paymentStatus}</option>
//               ))}
//               <option value="+ Create New Status"> + Create New Status</option>
//             </select>
//           </div>
//         </div>


//         <div className={styles.dropdown2}>
//           <div className={styles.dropColumn}>
//             <p className={styles.dropTitle}>Payment Mode: </p>
//             <select className={styles.dropDown} disabled>
//               <option value="option1">Bank Transfer</option>
//               <option value="option2">Cash on Delivery</option>
//               <option value="option3">+ New Method</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {fileUpload && (
//         <div className={styles.rectangleContainer}>
//           <div className={styles.rectangle} onClick={handleOpenReceipt}>PO #001 Receipt</div>
//         </div>
//       )}

//       <div>

//         <button className={`${styles.uploadButton} ${selectedStatus2.paymentStatus === 'Pending' ? styles.disabledButton : ''}`} onClick={handleOpenModal} disabled={selectedStatus2.paymentStatus === 'Pending'} >Upload Receipt</button>
//         {showModal && (
//           <div className={styles.modalcontainer}>
//             <div className={styles.modalBox}>
//               <h2 className={styles.uploadText}>Upload A File</h2>
//               <button onClick={handleCloseModal} className={styles.closeme}>X</button>

//               <div className={styles.innerBox}>
//                 <p className={styles.firstText}>Drag and drop file here</p>
//                 <p>or</p>
//                 <button className={styles.browseButton}>Browse Computer</button>
//               </div>

//               <div className={styles.twoButtons}>
//                 <button className={styles.cancelBtn} onClick={handleCloseModal} >Cancel</button>
//                 <button className={styles.uploadBtn} onClick={handleOpenModal2} >Upload</button>
//               </div>

//             </div>
//           </div>
//         )}

//         {showModal2 && (
//           <div className={styles.modalcontainer2}>
//             <div className={styles.modalBox2}>
//               <h2 className={styles.uploadConfirm}> Confirm Upload ?</h2>
//               <button onClick={handleCloseModal2} className={styles.closeme2}>X</button>
//             </div>

//             <div className={styles.uploadButtons}>
//               <button className={styles.cancelBtn2} onClick={handleCloseModal2} >Cancel</button>
//               <button className={styles.uploadBtn2} onClick={handleConfirmUpload}>Upload</button>
//             </div>

//           </div>
//         )}

//         {fileDisplay && (
//           <div className={styles.displayReceipt}>
//             <button onClick={handleCloseReceipt} className={styles.closeReceipt}>X</button>

//             <h2>proof of payment / receipt</h2>
//           </div>
//         )}

//         {newStatusPop && (
//           <div className={styles.newStatusBox}>
//             <div className={styles.newStatus}>
//               <h2 className={styles.newStatusText}> Create New Status </h2>
//               <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
//               <form onSubmit={handleSubmit}>
//                 <label htmlFor="statusInput">Enter status name : </label> <br />
//                 <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
//                 <button type="submit" className={styles.createStatusBtn}> Create Status</button>
//               </form>

//             </div>
//           </div>
//         )}


//       </div>

//       <div className={styles.supplierInfo}>
//         <p className={styles.supText}>Supplier Information </p>

//         <hr></hr>

//         <div className={styles.firstRow}>
//           <b className={styles.firstTitle}>Supplier Name </b>
//           <b className={styles.firstTitle}>Contact Person </b>
//           <b className={styles.firstTitle}>Phone Number </b>
//           <b className={styles.firstTitle}>Email </b>
//         </div>

//         <div className={styles.firstRData}>
//           <p className={styles.firstData1}>{supplierInfo.supplierName}</p>
//           <p className={styles.firstData2}>{supplierInfo.contactPersonName}</p>
//           <p className={styles.firstData3}>{supplierInfo.phoneNum} </p>
//           <p className={styles.firstData4}>{supplierInfo.email} </p>
//         </div>

//         <div className={styles.secondRow}>
//           <b className={styles.secondTitle1}>Bank Account Number </b>
//           <b className={styles.secondTitle2}>Category </b>
//           <b className={styles.secondTitle3}>Office Number </b>
//           <b className={styles.secondTitle4}>Address </b>
//         </div>

//         <div className={styles.secondRData}>
//           <p className={styles.secondData1}>{supplierInfo.bankAccountNum}</p>
//           <p className={styles.secondData2}>{supplierInfo.categoryName}</p>
//           <p className={styles.secondData3}>{supplierInfo.officeNum} </p>
//           <p className={styles.secondData4}>{supplierInfo.address} </p>
//         </div>

//         <hr></hr>

//       </div>


//       <div className={styles.remarkSection}>
//         <b className={styles.remarkText}>Remarks </b> <br />
//         <input type="text" className={styles.remarksInput} onChange={handleRemarksChange}/>
//       </div>

//       <div className={styles.save}>
//         <button className={styles.saveButton} onClick={handleSave}> Save </button>
//       </div>


//     </>
//   )
// }
// WORKING VERSION --------------------------------------------------------

// import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Image from 'next/image';
// import styles from '../../styles/viewPO.module.css';
//  import arrowIcon from '../../public/arrowIcon.svg';
// const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
// const baseURL = 'http://localhost:5000';

// export default function ViewPO({ supplierInfo }) {
//   const router = useRouter();
//   const poID = router.query.poID;
//   const [selectedStatus, setSelectedStatus] = useState('Pending');
//   const [showModal, setShowModal] = useState(false);
//   const [showModal2, setShowModal2] = useState(false);
//   const [fileUpload, setFileUpload] = useState(false);
//   const [fileDisplay, setFileDisplay] = useState(false);
//   const [prID, setprID] = useState(false);
//   const [supplierID, setsupplierID] = useState(false);
//   const [status, setStatus] = useState([]);
//   const [selectedStatus2, setSelectedStatus2] = useState('');
//   const [newStatusPop, setNewStatusPop] = useState(false);
//   const [statusInput, setStatusInput] = useState([]);
//   const [remarks, setRemarks] = useState([]);

//   const handleRemarksChange = (event) => {
//     setRemarks(event.target.value);
//   };

//   const handleSave = () => {
//     alert(`Status: ${selectedStatus2}, Remarks: ${remarks}`);
//   };

//   const handleOpenReceipt = () => {
//     setFileDisplay(true);
//   };

//   const handleCloseReceipt = () => {
//     setFileDisplay(false);
//   };

//   const handleCloseStatusPop = () => {
//     setNewStatusPop(false);
//   };

//   const handleInputChange = (event) => {
//     setStatusInput(event.target.value);
//   };

//   const handleSubmit = (event) => {
//     // event.preventDefault();
//     alert(statusInput);
//     axios
//       .post(`${baseUrl}/api/paymentTrack/`, {
//         paymentStatus: statusInput,
//       })
//       .then((res) => {
//         alert(`Successfully created new status ${statusInput}`);
//         setNewStat(false);
//         console.log(res.data);
//         setStatus((prevStatus) => [...prevStatus, res.data]);
//         onSubmit(statusInput);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const handleCloseModal2 = () => {
//     setShowModal2(false);
//   };

//   const handleOpenModal2 = () => {
//     setShowModal2(true);
//   };

//   const handleConfirmUpload = () => {
//     setShowModal(false);
//     setShowModal2(false);
//     setFileUpload(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };

//   const handleOpenModal = () => {
//     console.log(selectedStatus2.paymentStatus);
//     setShowModal(true);
//   };

//   const handleStatusChange = (e) => {
//     setSelectedStatus(e.target.value);
//   };

//   const handleStatusChange2 = (event) => {
//     setSelectedStatus2(event.target.value);
//     const selectedValue = event.target.value;
//     if (selectedValue === '+ Create New Status') {
//       setNewStatusPop(true);
//     } else {
//       console.log('other options');
//     }
//   };

//   useEffect(() => {
//     axios
//       .get(`${baseUrl}/api/paymentTrack/`)
//       .then((res) => {
//         console.log(res.data);
//         setStatus(res.data);
//         setSelectedStatus2(res.data[0]);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   return (
//     <>
//       <div className={styles.poHeader}>
//         <h1>
//           <a href={baseURL + "/PurchaseOrder"}>
//             <Image src={arrowIcon} className={styles.back} />
//           </a>
//           <p className={styles.title}>Purchase Order #{poID}</p>
//         </h1>
//       </div>

//       <div className={styles.dropContainer}>
//         <div className={styles.dropdown1}>
//           <div className={styles.dropColumn}>
//             <p className={styles.dropTitle}>Payment Status: </p>
//             <select className={styles.dropDown} value={selectedStatus2} onChange={handleStatusChange2}>
//               {status.map((status, index) => (
//                 <option key={index} value={status.paymentStatus}>{status.paymentStatus}</option>
//               ))}
//               <option value="+ Create New Status"> + Create New Status</option>
//             </select>
//           </div>
//         </div>


//         <div className={styles.dropdown2}>
//           <div className={styles.dropColumn}>
//             <p className={styles.dropTitle}>Payment Mode: </p>
//             <select className={styles.dropDown} disabled>
//               <option value="option1">Bank Transfer</option>
//               <option value="option2">Cash on Delivery</option>
//               <option value="option3">+ New Method</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {fileUpload && (
//         <div className={styles.rectangleContainer}>
//           <div className={styles.rectangle} onClick={handleOpenReceipt}>PO #001 Receipt</div>
//         </div>
//       )}

//       <div>

//         <button className={`${styles.uploadButton} ${selectedStatus2.paymentStatus === 'Pending' ? styles.disabledButton : ''}`} onClick={handleOpenModal} disabled={selectedStatus2.paymentStatus === 'Pending'} >Upload Receipt</button>
//         {showModal && (
//           <div className={styles.modalcontainer}>
//             <div className={styles.modalBox}>
//               <h2 className={styles.uploadText}>Upload A File</h2>
//               <button onClick={handleCloseModal} className={styles.closeme}>X</button>

//               <div className={styles.innerBox}>
//                 <p className={styles.firstText}>Drag and drop file here</p>
//                 <p>or</p>
//                 <button className={styles.browseButton}>Browse Computer</button>
//               </div>

//               <div className={styles.twoButtons}>
//                 <button className={styles.cancelBtn} onClick={handleCloseModal} >Cancel</button>
//                 <button className={styles.uploadBtn} onClick={handleOpenModal2} >Upload</button>
//               </div>

//             </div>
//           </div>
//         )}

//         {showModal2 && (
//           <div className={styles.modalcontainer2}>
//             <div className={styles.modalBox2}>
//               <h2 className={styles.uploadConfirm}> Confirm Upload ?</h2>
//               <button onClick={handleCloseModal2} className={styles.closeme2}>X</button>
//             </div>

//             <div className={styles.uploadButtons}>
//               <button className={styles.cancelBtn2} onClick={handleCloseModal2} >Cancel</button>
//               <button className={styles.uploadBtn2} onClick={handleConfirmUpload}>Upload</button>
//             </div>

//           </div>
//         )}

//         {fileDisplay && (
//           <div className={styles.displayReceipt}>
//             <button onClick={handleCloseReceipt} className={styles.closeReceipt}>X</button>

//             <h2>proof of payment / receipt</h2>
//           </div>
//         )}

//         {newStatusPop && (
//           <div className={styles.newStatusBox}>
//             <div className={styles.newStatus}>
//               <h2 className={styles.newStatusText}> Create New Status </h2>
//               <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
//               <form onSubmit={handleSubmit}>
//                 <label htmlFor="statusInput">Enter status name : </label> <br />
//                 <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
//                 <button type="submit" className={styles.createStatusBtn}> Create Status</button>
//               </form>

//             </div>
//           </div>
//         )}


//       </div>

//       <div className={styles.supplierInfo}>
//         <p className={styles.supText}>Supplier Information </p>

//         <hr></hr>

//         <div className={styles.firstRow}>
//           <b className={styles.firstTitle}>Supplier Name </b>
//           <b className={styles.firstTitle}>Contact Person </b>
//           <b className={styles.firstTitle}>Phone Number </b>
//           <b className={styles.firstTitle}>Email </b>
//         </div>

//         <div className={styles.firstRData}>
//           <p className={styles.firstData1}>{supplierInfo.supplierName}</p>
//           <p className={styles.firstData2}>{supplierInfo.contactPersonName}</p>
//           <p className={styles.firstData3}>{supplierInfo.phoneNum} </p>
//           <p className={styles.firstData4}>{supplierInfo.email} </p>
//         </div>

//         <div className={styles.secondRow}>
//           <b className={styles.secondTitle1}>Bank Account Number </b>
//           <b className={styles.secondTitle2}>Category </b>
//           <b className={styles.secondTitle3}>Office Number </b>
//           <b className={styles.secondTitle4}>Address </b>
//         </div>

//         <div className={styles.secondRData}>
//           <p className={styles.secondData1}>{supplierInfo.bankAccountNum}</p>
//           <p className={styles.secondData2}>{supplierInfo.categoryName}</p>
//           <p className={styles.secondData3}>{supplierInfo.officeNum} </p>
//           <p className={styles.secondData4}>{supplierInfo.address} </p>
//         </div>

//         <hr></hr>

//       </div>


//       <div className={styles.remarkSection}>
//         <b className={styles.remarkText}>Remarks </b> <br />
//         <input type="text" className={styles.remarksInput} onChange={handleRemarksChange}/>
//       </div>

//       <div className={styles.save}>
//         <button className={styles.saveButton} onClick={handleSave}> Save </button>
//       </div>


//     </>
//   )
// }

// export async function getServerSideProps() {
//   try {
//     const response = await axios.get(`${baseUrl}/api/purchaseOrder/`);
//     const prID = response.data[0].prID;
//     const supplierResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/pr/${response.data[0].prID}`);
//     const supplierID = supplierResponse.data[0].supplierID;
//     const supplierInfoResponse = await axios.get(`${baseUrl}/api/paymentTrack/supplier/info/${supplierResponse.data[0].supplierID}`);
//     const supplierInfo = supplierInfoResponse.data[0];

//     console.log('Response:', response.data);
//     console.log('Supplier Response:', supplierResponse.data);
//     console.log('Supplier Info Response:', supplierInfoResponse.data);
//     console.log('Supplier Info:', supplierInfo);

//     return {
//       props: {
//         supplierInfo,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       props: {
//         supplierInfo: {},
//       },
//     };
//   }
// }

/////// test 

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
    props:{
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

export default function ViewPO({supplierDetail}) {
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

      <div className={styles.dropContainer}>
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
          <div className={styles.rectangle} onClick={handleOpenReceipt}>PO #001 Receipt</div>
        </div>
      )}

      <div>

        <button className={`${styles.uploadButton} ${selectedStatus2.paymentStatus === 'Pending' ? styles.disabledButton : ''}`} onClick={handleOpenModal} disabled={selectedStatus2.paymentStatus === 'Pending'} >Upload Receipt</button>
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
          <p className={styles.firstData1}>{supplierDetails.supplierName}</p>
          <p className={styles.firstData2}>{supplierDetails.contactPersonName}</p>
          <p className={styles.firstData3}>{supplierDetails.phoneNum} </p>
          <p className={styles.firstData4}>{supplierDetails.email} </p>
        </div>

        <div className={styles.secondRow}>
          <b className={styles.secondTitle1}>Bank Account Number </b>
          <b className={styles.secondTitle2}>Category </b>
          <b className={styles.secondTitle3}>Office Number </b>
          <b className={styles.secondTitle4}>Address </b>
        </div>

        <div className={styles.secondRData}>
          <p className={styles.secondData1}>{supplierDetails.bankAccountNum}</p>
          <p className={styles.secondData2}>{supplierDetails.categoryName}</p>
          <p className={styles.secondData3}>{supplierDetails.officeNum} </p>
          <p className={styles.secondData4}>{supplierDetails.address} </p>
        </div>

        <hr></hr>

      </div>


      <div className={styles.remarkSection}>
        <b className={styles.remarkText}>Remarks </b> <br />
        <input type="text" className={styles.remarksInput} onChange={handleRemarksChange}/>
      </div>

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