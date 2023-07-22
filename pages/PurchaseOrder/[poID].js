import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"
import axios from "axios";
import Image from "next/image"
import styles from '../../styles/viewPO.module.css';
import arrowIcon from '../../public/arrowIcon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';




//component
import WIP from "../../components/WIP";

// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log("hostname", hostname)
    // console.log('hostname   ' + hostname);
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
const frontendBaseUrl = URL[1]


// const API_URL = (isLocalhost(window.location.hostname) !== true ? 'https://'+ window.location.hostname : 'http://localhost:3000');
// const baseUrl = API_URL;
// const baseUrl = 'https://abc-cooking-studio-backend.azurewebsites.net';
// const baseUrl = 'http://localhost:3000';
// const baseURL = 'http://localhost:5000';




export async function getServerSideProps(context) {

  const host = context.req.headers.host;
  // console.log(host);

  const backBaseURL = [];

  if (host == 'localhost:5000') {
    backBaseURL.push('http://localhost:3000');
  }
  else {
    backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
  };

  const { params } = context;
  const { poID } = params;


  const paymentTrackResponse = await fetch(`${backBaseURL}/api/paymentTrack/supplier/pr/${poID}`);

  const response1 = await paymentTrackResponse.json();
  const supplierID = response1[0].supplierID;

  // console.log(response1);
  // console.log(supplierID);

  //supplier info
  const supplierInfoResponse = await fetch(`${backBaseURL}/api/paymentTrack/supplier/info/${supplierID}`);
  const supplierInfo = await supplierInfoResponse.json();

  //product details
  const productInfoResponse = await fetch(`${backBaseURL}/api/purchaseReq/lineItem/${poID}`);
  const productInfo = await productInfoResponse.json();

  const remarksInfoResponse = await fetch(`${backBaseURL}/api/purchaseReq/PR/${poID}`);
  const remarksInfo = await remarksInfoResponse.json();

  //purchase order details 


  // console.log(response2);

  return {
    props: {
      poID,
      supplierDetail: supplierInfo,
      productDetail: productInfo,
      remarkDetail: remarksInfo,
    }
  }

}

export default function ViewPO({ supplierDetail, productDetail, remarkDetail }) {
  const router = useRouter()
  const poID = router.query.poID
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [fileDisplay, setFileDisplay] = useState(false);
  const [status, setStatus] = useState([]);
  const [selectedStatus2, setSelectedStatus2] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState([])
  const [paymentStatuses, setPaymentStatuses] = useState([])
  const [updateStatusPop, setUpdateStatusPop] = useState(false);
  const [updateRemarksPop, setUpdateRemarksPop] = useState(false);
  const [newStatusPop, setNewStatusPop] = useState(false);
  const [statusInput, setStatusInput] = useState([]);
  const [remarks, setRemarks] = useState('');
  const [selectedFile, setSelectedFile] = useState([]);
  const [PDF, setPDF] = useState([]);
  const [wip, setWip] = useState(false);

  //saving paymentstatus, need to get ID from status first. 
  const handlePaymentStatusChange = (event) => {
    setPaymentStatusID(event.target.value);
  };

  //saving the remarks section 
  const handleRemarksChange = (event) => {
    setRemarks(event.target.value);
  };

  const handleSave = () => {
    axios.put(`${baseUrl}/api/purchaseOrder/remarks/${poID}`, {
      ptRemarks: remarks
    })
      .then(res => {
        console.log("succesfully updated remarks.")
        setUpdateRemarksPop(true);
      })
      .catch(err => {
        console.log(err);
      })
  }

  const fetchRemarks = () => {
    axios.get(`${baseUrl}/api/purchaseOrder/remarks/${poID}`)
      .then(res => {
        const remarksData = res.data[0].ptRemarks;
        setRemarks(remarksData);
      })
      .catch(err => {
        console.log(err)
      })
  }

  //load remarks when page load
  useEffect(() => {
    fetchRemarks();
  }, [])

 
  //wip 
  const wipOpen = async (e) => {
    e.preventDefault()
    setWip(true);
    timer()
  }

  function timer() {
    setTimeout(closeWIP, 2000);
  }

  function closeWIP() {
    setWip(false);
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    console.log("file name", file)
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.put(`${baseUrl}/api/paymentTrack/productDetails/${poID}/receipt`, formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      })
        .then(() => {
          console.log('receipt uploaded..');
          fetchPDFData();
        })
        .catch((err) => {
          console.log("error uploading receipt", err);
        })
    }
  }


  const supplierDetails = supplierDetail[0];
  const productDetails = productDetail
  const remarksDetails = remarkDetail[0]
  const requestDetails = remarkDetail[0].requestDate

  //product details 


  //calculating subtotal 
  let subtotal = 0;
  productDetails.forEach((item) => {
    subtotal += parseFloat(item.totalUnitPrice);
  })

  const gstPercent = remarkDetail[0].GST.gst;

  //calculating gst 8%
  const gst = subtotal * (gstPercent / 100);

  //total price 
  let total = subtotal + gst


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
    setShowModal2(true);
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

  const handleStatusUpdateClose = () => {
    setUpdateStatusPop(false);
  };

  const handleRemarksUpateClose = () => {
    setUpdateRemarksPop(false);
  }

  useEffect(() => {
    fetchPDFData();
  }, []);

  const fetchPDFData = () => {
    axios
      .get(`${baseUrl}/api/paymentTrack/productDetails/${poID}/receipt`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const base64Data = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        setPDF(base64Data);
      })
      .catch((err) => {
        console.log('Error fetching PDF:', err);
        setPDF(null); 
      });
  };


  useEffect(() => {
    //fetches all the statuses to populate the dropdown. 
    axios.get(`${baseUrl}/api/paymentTrack/`)
      .then(res => {
        console.log(res.data);
        setPaymentStatuses(res.data);
        //fetch po's payment status to preselect the dropdown. 
        axios.get(`${baseUrl}/api/purchaseOrder/${poID}`)
          .then(poRes => {
            setSelectedPaymentStatus(poRes.data[0].Status);
            console.log("po res ", poRes.data[0].Status)
          })
          .catch(poErr => console.log(poErr));
      })
      .catch(err => console.log(err));
  }, [])

  const handleStatusChange2 = (event) => {
    setSelectedStatus2(event.target.value);
    const selectedValue = event.target.value;

    //fetching id from status  
    axios.get(`${baseUrl}/api/paymentTrack/status/${selectedValue}`)
      .then(res => {
        console.log(res.data[0].PaymentStatusID);
        const ID = (res.data[0].PaymentStatusID)

        //updating payment status in db
        axios.put(`${baseUrl}/api/purchaseOrder/${poID}`, {
          paymentStatusID: ID
        })
          .then(res => {
            console.log('payment status updated sucessfully')
            setUpdateStatusPop(true);
            setSelectedPaymentStatus(selectedValue);
          })
          .catch(err => {
            console.log(err);
          })

      })
      .catch(err => {
        console.log(err);
      })


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
          Purchase Order #{poID}
        </h1>
      </div>



      <div className="containersupplier mt-5 m-auto col-11">
        <div className="row row-cols-4">
          <h4 className="col-12">Supplier Information</h4>
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
              <b>Bank Name</b>
            </div>
            <div>
              <p>{supplierDetails.bankNamee}</p>
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
            <br />
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
            <hr className="mt-3" />
          </div>


          <div className="container mt-3">
            <div className="row">
              <div className="col-12">
                <h4 className="col-12 mt-5">Purchase Order Details</h4>
              </div>
            </div>
            <hr className="mb-4"></hr>

            <div className="row">
              <div className="col-3">
                <b>Date of Request:</b> <br />
                {moment(remarkDetail[0].requestDate).format('DD MMM YYYY')}
              </div>
              <div className="col-3">
                <b>Name of Purchaser:</b> <br />
                {remarkDetail[0].name}
              </div>
              <div className="col-3">
                <b>Location: </b> <br />
                {remarkDetail[0].branchName}
              </div>
            </div>

            <hr className="mt-4"></hr>

          </div>


          <div className="container mt-3">
            <div className="row">
              <div className="col-12">
                <h4 className="col-12 mt-5">Product Details</h4>
              </div>
            </div>

            <div className="row py-3 mt-1 mb-2 col-12 m-auto">
              <hr></hr>
              <div className="col text-center mt-1">Item No.</div>
              <div className="col text-start">Description</div>
              <div className="col text-center">Quantity</div>
              <div className="col text-center">Unit Price</div>
              <div className="col text-center">Total Unit Price</div>
              <hr className="mt-4"></hr>
            </div>

            <div className="row col-12 m-auto">
              {productDetails && productDetails.map((item, index) => (
                <div className="row py-3 mt-2 mb-1 col-12 m-auto" key={index}>
                  <div className="col text-center">{index + 1}</div>
                  <div className="col text-start">{item.itemName}</div>
                  <div className="col text-center">{item.quantity}</div>
                  <div className="col text-center">{item.unitPrice}</div>
                  <div className="col text-center">{item.totalUnitPrice}</div>
                </div>
              ))}

              {!productDetails || productDetails.length === 0 && (
                <p className="col-12 text-center">No product details available</p>
              )}

              <hr className="mt-4"></hr>

              <div className="row col-12 m-auto">
                <div className="col"></div>
                <div className="col"></div>
                <div className="col"></div>
                <h4 className="col text-center">Subtotal</h4>
                <div className="col text-center">{subtotal.toFixed(2)}</div>
              </div>

              <br />
              <br />
              <br />

              <div className="row col-12 m-auto">
                <div className="col"></div>
                <div className="col"></div>
                <div className="col"></div>
                <h4 className="col text-center font-weight-bold">GST 8%</h4>
                <div className="col text-center">{gst.toFixed(2)}</div>
              </div>


              <hr className="col-4 offset-8 mt-4"></hr>

              <div className="row col-12 m-auto">
                <div className="col"></div>
                <div className="col"></div>
                <div className="col"></div>
                <h4 className="col text-center font-weight-bold">Total</h4>
                <div className="col text-center">{total.toFixed(2)}</div>
              </div>

              <br />


              <div className="containersupplier mt-5 col-11">
                <h4>Remarks</h4> <br />
                <p>{remarkDetail[0].remarks}</p>
              </div>

            </div>


            {/* payment */}
            <div className="mt-5 col-12">
              <div className="row">
                <div className="col-md-6" >
                  <div className="form-group">
                    <label htmlFor="paymentStatus">Payment Status:</label>
                    <select className="form-control" id="paymentStatus" value={selectedPaymentStatus} onChange={handleStatusChange2}>
                      {paymentStatuses.map((status, index) => (
                        <option key={index} value={status.paymentStatus}>{status.paymentStatus}</option>
                      ))}
                      <option value="+ Create New Status"> + Create New Status</option>
                    </select>

                  </div>
                </div>

                <div className="col-md-6">
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
            {/* 
            <div className="mt-5">
              <div className="col-md-6">
                <button className={`btn ${selectedStatus2.paymentStatus === 'Pending' ? 'disabled' : ''} `} style={{ backgroundColor: '#486284', borderRadius: '50px', color: 'white', padding: '15px' }} onClick={wipOpen} disabled={selectedStatus2.paymentStatus === 'Pending'}>Upload Receipt</button>
              </div>
            </div> */}

            <div className="mt-4">
              <button className={`btn ${selectedPaymentStatus === 'Pending' ? 'disabled' : ''} `} style={{ backgroundColor: '#486284', borderRadius: '50px', color: 'white', padding: '15px' }} onClick={handleOpenModal}>Upload Receipt</button>
            </div>

            {wip && <WIP Show={wip} />}



            <div className="mt-5">
              {PDF ? (
                <iframe src={`data:application/pdf;base64,${PDF}`} width="70%" height="500px" />
              ) : (
                <p>No receipt uploaded currently.</p>
              )}
            </div>







            <div className="row">
              <div className="col-md-12">
                <div className="mb-4 mt-5">
                  <b className="d-inline-block">Remarks</b> <br />
                  <textarea
                    type="text"
                    className="form-control mt-2"
                    style={{
                      height: '200px',
                      width: '100%',
                      maxWidth: '2000px'
                    }}
                    value={remarks} //so user can see exising remarks.

                    onChange={handleRemarksChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 ">
                <div className="text-end">
                  <button className="btn" style={{ backgroundColor: '#486284', borderRadius: '50px', color: 'white', padding: '10px 50px 10px 50px' }} onClick={handleSave}>
                    Save Remarks
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>





      <div>




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
                      {/* <p className="mb-3">Drag and drop file here</p>
                      <p>or</p> */}
                      <input type="file" className="btn btn-custom-primary mt-3" style={{ display: 'none' }} onChange={(e) => { handleFileUpload(e); }} id="fileUpload" />

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
                  <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px' }} onClick={() => { handleCloseModal(); handleOpenModal2(); }}>Upload</button>
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
              <button className={styles.uploadBtn2} onClick={() => { handleConfirmUpload(); handleCloseModal2(); handleUpload(); }}>Upload</button>
            </div>

          </div>
        )}

        {fileDisplay && (
          <div className={styles.displayReceipt}>
            <button onClick={handleCloseReceipt} className={styles.closeReceipt}>X</button>

            <h2>{selectedFile.name}</h2>
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

        {updateStatusPop && (
          <div className="modal fade show d-block" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="d-flex flex-column align-items-center">
                    <button type="button" className="closeXbtn" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', background: 'transparent' }} onClick={handleStatusUpdateClose}>
                      <span>&times;</span>
                    </button> <br /> <br />

                    <div>
                      <h5>Status has been updated!</h5>
                    </div>  <br />

                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none' }}>
                  <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px' }} onClick={handleStatusUpdateClose} >Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {updateRemarksPop && (
          <div className="modal fade show d-block" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="d-flex flex-column align-items-center">
                    <button type="button" className="closeXbtn" style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', background: 'transparent' }} onClick={handleRemarksUpateClose}>
                      <span>&times;</span>
                    </button> <br /> <br />

                    <div>
                      <h5>Remarks has been updated!</h5>
                    </div>  <br />

                  </div>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none' }}>
                  <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px' }} onClick={handleRemarksUpateClose} >Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>


    </>
  )
}