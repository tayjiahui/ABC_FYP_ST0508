import axios from 'axios';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from 'next/image';
import arrowIcon from '../../public/arrowIcon.svg';
import plusIcon from '../../public/addLocationIcon.svg';
import styles from '../../styles/trackOrderById.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment-timezone';
import WIP from '../../components/WIP';
import AlertBox from "../../components/alert";

const timezone = 'Asia/Singapore';

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
    }

    return URL;
  }
}

isLocalhost();

const baseUrl = URL[0]

function ItemLines(props) {
  return (
    <div>
      <ul className="list-group list-group-horizontal text-center">
        <li className="list-group-item col-sm-2 border-0">{props.ItemNo}</li>
        <li className="list-group-item col-sm-2 px-2 border-0">{props.ItemName}</li>
        <li className="list-group-item col-sm-2 border-0">{props.Qty}</li>
        <li className="list-group-item col-sm-2 border-0">{props.UnitPrice}</li>
        <li className="list-group-item col-sm-1 border-0">{props.TotalUnitPrice}</li>
        <li className="list-group-item col-sm-2 border-0 ms-5"><input value={props.QtyReceived} disabled /></li>
      </ul>
    </div>
  )
};

// get backend 
export async function getServerSideProps(context) {
  const host = context.req.headers.host;
  // console.log(host);

  const backBaseURL = [];

  if (host == 'localhost:5000') {
    backBaseURL.push('http://localhost:3000');
  }
  else {
    backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
  }

  const { params } = context;
  const { poID } = params;    //PR ID FROM DATABASE DISGUISED AS POID FOR FRONTEND


  const poD = await fetch(`${backBaseURL}/api/trackOrder/purchaseOrderDetails/${poID}`);
  const productD = await fetch(`${backBaseURL}/api/purchaseReq/lineItem/${poID}`);
  const PRDetails = await fetch(`${backBaseURL}/api/purchaseReq/PR/${poID}`);

  const deliveryInfoResponse = await fetch(`${backBaseURL}/api/trackOrder/purchaseDetails/DeliveryTime/${poID}`);
  const deliveryInfo = await deliveryInfoResponse.json();

  const data1 = await poD.json();
  const data2 = await productD.json();
  const data3 = await PRDetails.json();

  console.log(data1);
  // console.log(data2);

  const poid = data1[0].poID;

  const gst = data3[0].GST;

  const qtyReceiveS = [];

  // filter out duplicated data & combine multiple locations
  data1.forEach((item, index) => {
    if (index > 0) {
      data1[0].branchName += `, ${item.branchName}`;
    }
  });

  // GET BASE QTY RECEIVED VALUES
  data2.forEach((item, index) => {
    qtyReceiveS.push({ qtyReceived: item.qtyReceived, id: item.lineItemID });
  });

  return {
    props: {
      host,
      purOrderD: data1,
      productDeets: data2,
      gstDetails: gst,
      QtyReceived: qtyReceiveS,
      POID: poid,
      deliveryDetail: deliveryInfo
    }
  }
}

// main frontend page
export default function Main({ purOrderD, productDeets, gstDetails, QtyReceived, POID, deliveryDetail }) {

  const router = useRouter();

  const prID = router.query.poID;
  const poID = POID;

  const [id, setUserID] = useState();
  const [Token, setToken] = useState();

  const [RequestDate, setTargetDate] = useState();

  const [ProductDetails, setList] = useState();

  const [Subtotal, subtotalCal] = useState();
  const [GST, gstCal] = useState();
  const [Total, totalCal] = useState();

  const [OGStatus, setOGStatus] = useState();
  const [selectedStatus, setSelectedStatus] = useState();
  const [status, setStatus] = useState([]);

  const [changeStatusPop, setChangeStatusPop] = useState();

  const [editQty, allowQtyEdit] = useState(false);
  const [ogQty, setOGQTY] = useState(QtyReceived);
  const [QtyReceivedList, setQtyReceivedList] = useState(QtyReceived);

  //validation for number received for line item
  const [validation, setValidation] = useState('');

  // WIP Pop up
  const [showInProg, setInProg] = useState(false);

  //INVOICE
  const [selectedFile, setSelectedFile] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [PDF, setPDF] = useState([]);
  const [uploadedInvoiceAlert, setUploadedInvoiceAlert] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInvoiceAlert, setDeleteInvoiceAlert] = useState(false);


  //DO
  const [selectedFileDO, setSelectedFileDO] = useState([]);
  const [showModalDO, setShowModalDO] = useState(false);
  const [showModal2DO, setShowModal2DO] = useState(false);
  const [PDFDO, setPDFDO] = useState([]);
  const [uploadedDOAlert, setUploadedDOAlert] = useState(false);
  const [deleteDOConfirm, setDeleteDOConfirm] = useState(false);
  const [deleteDOAlert, setDeleteDOAlert] = useState(false);

  // Alerts
  const [EditQtyAlert, setEditQtyAlert] = useState(false);
  const [UpdatePStatus, setUpdatePStatus] = useState(false);

  // PR Details  
  const PR = purOrderD[0];
  const deliveryDetails = deliveryDetail;

  useEffect(() => {
    // set user id taken from localstorage
    const userID = parseInt(localStorage.getItem("ID"), 10);
    setUserID(userID);

    // set user token
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  // runs only when QtyReceivedList is updated
  useEffect(() => {
    axios.all([
      axios.get(`${baseUrl}/api/purchaseReq/lineItem/${prID}`),
      axios.get(`${baseUrl}/api/trackOrder/purchaseOrderDetails/${prID}`)
    ])
      .then(axios.spread((response1, response2) => {

        // get original product lines
        const PDL = response1.data;
        const lines = [];

        PDL.forEach((item, index) => {
          lines.push({ qtyReceived: item.qtyReceived, id: item.lineItemID });
        });

        setOGQTY(lines);

        // get original PO status
        const POS = response2.data[0];
        setOGStatus(POS.purchaseStatusID);

      })
      )
      .catch((err) => {
        console.log(err);
        console.log(err.response);
      });
  }, [QtyReceivedList, selectedStatus])

  // Onclick Save button for QtY received
  const handleDontAllowQtyEdit = async (e) => {
    e.preventDefault();

    QtyReceivedList.forEach(async (item, index) => {
      const origQTY = ogQty[index];
      const editQTY = QtyReceivedList[index];

      if (editQTY.id === origQTY.id && editQTY.qtyReceived !== origQTY.qtyReceived) {
        await axios.put(`${baseUrl}/api/purchaseReq/lineItem/${item.id}`,
          {
            "qtyReceived": item.qtyReceived
          }
        )
          .then(async (response) => {
            // console.log(response);

            // create audit log
            await axios.post(`${baseUrl}/api/auditTrail/`,
              {
                timestamp: moment().tz(timezone).format(),
                userID: id,
                actionTypeID: 1,
                itemId: origQTY.id,
                newValue: editQTY.qtyReceived,
                oldValue: origQTY.qtyReceived
              },
              {
                headers: {
                  authorization: 'Bearer ' + Token
                }
              }
            )
              .then((response) => {
                // console.log(response.data);

                setEditQtyAlert(true);
                alertTimer();
              });

            allowQtyEdit(false);
          })
          .catch((err) => {
            if (err.response.status === 401 || err.response.status === 403) {
              localStorage.clear();
              signOut({ callbackUrl: '/Unauthorised' });
            }
            else {
              console.log(err);
            };
          });
      }
    });
  };

  // Control Allow QTY Edit
  const handleAllowQtyEdit = () => {
    allowQtyEdit(true);
  };

  // Handling Qty value edit
  const handleQtyChange = (index, e, item) => {
    const newQTY = e.target.value;
    let qty = item.quantity;

    let data = [...QtyReceivedList];
    // Perform validation
    if (newQTY > qty) {
      setValidation("Exceeds Item Quantity!");
      data[index].qtyReceived = "";
    } else {
      data[index].qtyReceived = parseInt(newQTY);
      setQtyReceivedList(data);
    }

    //setQtyReceivedList(data);
  };

  // timer
  function timeFunc() {
    // 2 seconds
    setTimeout(closeWIPModal, 2000);
  };

  const handleOpenWip = () => {
    setInProg(true);
    timeFunc();
  };

  // close WIP Modal
  function closeWIPModal() {
    setInProg(false);
  };

  const handleCloseStatusPop = () => {
    setChangeStatusPop(false);
    setValidation(false);
  };

  useEffect(() => {
    // set user token
    const token = localStorage.getItem("token");

    // Target Delivery Date formatting
    const newDateFormat = moment(PR.requestDate).format('DD MMM YYYY');
    setTargetDate(newDateFormat);

    // get purchase status
    axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`,
      {
        headers: {
          authorization: 'Bearer ' + token
        }
      }
    )
      .then(res => {
        // console.log(res.data)
        setStatus(res.data);
        setSelectedStatus(res.data[0]); //initial selected status
      })
      .catch(err => {
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.clear();
          signOut({ callbackUrl: '/Unauthorised' });
        }
        else {
          console.log(err);
        };
      });

    // Product lines
    const itemLines = [];
    const totalPrices = [];

    productDeets.forEach((item, index) => {
      itemLines.push(
        <div key={index}>
          <ItemLines
            ItemNo={index + 1}
            ItemName={item.itemName}
            Qty={item.quantity}
            UnitPrice={item.unitPrice}
            TotalUnitPrice={item.totalUnitPrice}
            QtyReceived={QtyReceivedList[index].qtyReceived} />
        </div>
      );
      totalPrices.push(item.totalUnitPrice);
    });

    setList(itemLines);

    // Calculate Total
    function CalculateTotal(array) {
      let total = 0;
      for (let i = 0; i < array.length; i++) {
        let num = +array[i]
        total = total + num
      };
      return total;
    };

    const gstPercent = gstDetails.gst;

    // Calculate GST
    function GSTFinder(amt) {
      const gst = (gstPercent / 100) * amt;
      return gst;
    };

    const totalArr = [];

    // Find subtotal
    const subtotal = CalculateTotal(totalPrices);
    subtotalCal(subtotal.toFixed(2));

    // Find GST
    const gst = GSTFinder(subtotal);
    gstCal(gst.toFixed(2));

    // push values into totalArr
    totalArr.push(subtotal, gst);

    // Calculate final total
    const total = CalculateTotal(totalArr).toFixed(2);
    totalCal(total);

  }, []);

  const handleStatusChange = async (event) => {
    setSelectedStatus(event.target.value);
    const selectedValue = event.target.value;

    await axios.put(`${baseUrl}/api/trackOrder/purchaseOrderStatus/${poID}`, {
      purchaseStatusID: selectedValue,
    }, {
      headers: {
        authorization: 'Bearer ' + Token
      }
    }
    )
      .then(async (res) => {
        // console.log(res);

        // create audit log
        await axios.post(`${baseUrl}/api/auditTrail/`,
          {
            timestamp: moment().tz(timezone).format(),
            userID: id,
            actionTypeID: 2,
            itemId: poID,
            newValue: selectedValue,
            oldValue: OGStatus
          },
          {
            headers: {
              authorization: 'Bearer ' + Token
            }
          }
        )
          .then((response) => {
            // console.log(response.data);

            setUpdatePStatus(true);
            alertTimer();
          })
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 403) {
          localStorage.clear();
          signOut({ callbackUrl: '/Unauthorised' });
        }
        else {
          console.log(err);
        };
      });
  };

  useEffect(() => {
    fetchPDFDOData();
    fetchPDFData()
  }, []);

  //delete DO
  const handleDeleteDOConfirmation = () => {
    setDeleteDOConfirm(true);
  }

  const handleCloseDeleteDOConfirmation = () => {
    setDeleteDOConfirm(false);
  }

  const handleDODelete = () => {
    axios.put(`${baseUrl}/api/trackOrder/documents/${prID}/removeDO`, {
      deliveryOrder: null
    }, {
      headers: {
        user: id,
        authorization: 'Bearer ' + Token
      }
    })
      .then(res => {
        console.log('DO Deleted');
        setDeleteDOAlert(true);
        alertTimer();
        fetchPDFDOData();
      })
      .catch(err => {
        console.log('Error deleting DO', err);
      })
  }


  //delete invoice 
  const handleInvoiceDelete = () => {

    axios.put(`${baseUrl}/api/trackOrder/documents/${prID}/removeInvoice`, {
      invoice: null
    }, {
      headers: {
        user: id,
        authorization: 'Bearer ' + Token
      }
    })
      .then(res => {
        console.log('Invoice Deleted');
        setDeleteInvoiceAlert(true);
        alertTimer();
        fetchPDFData();
      })
      .catch(err => {
        console.log('Error deleting Invoice', err);
      })
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirm(true);
  }

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirm(false);
  }

  const handleOpenPDFInNewTab = () => {
    if (PDF) {
      const byteCharacters = atob(PDF);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const newTab = window.open();
      newTab.document.write('<iframe src="' + pdfUrl + '" width="100%" height="100%"></iframe>');
      newTab.document.close();
    }
  }

  const handleOpenPDFDOInNewTab = () => {
    if (PDFDO) {
      const byteCharacters = atob(PDFDO);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: 'application/pdf' });

      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      const newTab = window.open();
      newTab.document.write('<iframe src="' + pdfUrl + '" width="100%" height="100%"></iframe>');
      newTab.document.close();
    }
  }



  const fetchPDFData = () => {
    axios
      .get(`${baseUrl}/api/trackOrder/documents/${prID}/invoice`, {
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

  const fetchPDFDOData = () => {
    axios
      .get(`${baseUrl}/api/trackOrder/documents/${prID}/deliveryOrder`, {
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const base64Data = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        setPDFDO(base64Data);
      })
      .catch((err) => {
        console.log('Error fetching PDF:', err);
        setPDFDO(null);
      });
  };

  //invoice
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.put(`${baseUrl}/api/trackOrder/documents/${prID}/invoice`, formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      })
        .then(() => {
          console.log('Invoice uploaded successfully!!');
          setUploadedInvoiceAlert(true);
          setSelectedFile(null);
          alertTimer();
          fetchPDFData();
        })
        .catch((err) => {
          console.log("Error uploading Invoice", err);
        })
    }
  };

  //delivery order
  const handleFileUploadDO = async (e) => {
    const file = e.target.files[0]
    setSelectedFileDO(file)
  };

  const handleUploadDO = async () => {
    if (selectedFileDO) {
      const formData = new FormData();
      formData.append('file', selectedFileDO);

      axios.put(`${baseUrl}/api/trackOrder/documents/${prID}/deliveryOrder`, formData, {
        headers: {
          'Content-Type': "multipart/form-data"
        }
      })
        .then(() => {
          console.log('Delivery Order uploaded successfully');
          setUploadedDOAlert(true);
          setSelectedFileDO(null);
          alertTimer()
          fetchPDFDOData();
        })
        .catch((err) => {
          console.log('Error uploading Delivery Order', err)
        })
    }
  };

  //invoice
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenModal2 = () => {
    setShowModal2(true);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
  };

  const handleConfirmUpload = () => {
    setShowModal(false);
    setShowModal2(true);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  //delivery order
  const handleCloseModalDO = () => {
    setShowModalDO(false);
  };

  const handleOpenModal2DO = () => {
    setShowModal2DO(true);
  };

  const handleCloseModal2DO = () => {
    setShowModal2DO(false);
  };

  const handleConfirmUploadDO = () => {
    setShowModalDO(false);
    setShowModal2DO(true);
  };

  const handleOpenModalDO = () => {
    setShowModalDO(true);
  };

  // alert box timer
  function alertTimer() {
    // changes all alert useStates to false after 3s
    setTimeout(alertFunc, 3000);
  };

  function alertFunc() {
    // list of alerts useStates in your page
    setEditQtyAlert(false);
    setUpdatePStatus(false);
    setUploadedInvoiceAlert(false);
    setUploadedDOAlert(false);
    setDeleteInvoiceAlert(false);
    setDeleteDOAlert(false);
  };

  return (
    <div>
      <h1 className='firstHeaderTop'>
        <a href={"/TrackOrder"} className='purchaseOrderNo'>
          <Image src={arrowIcon} className="col-sm pr-2 pb-2" alt="Back" />
        </a>Purchase Order #{PR.prID}
      </h1>

      <div className='ms-5 mt-5'>

        <h3 className="col-sm ms-5">Purchase Order Details</h3>

        <hr className="col-11 ms-5"></hr>

        <div className="row">
          <div className="col-sm">
            <h5 className="ms-5 mt-3">Date Request</h5>
            <h7 className="ms-5 pb-0">{RequestDate}</h7>
          </div>
          {deliveryDetail[0].DeliveryDate !== null && (
            <div className={`${styles.nameCol} col-sm`}>
              <h5 className="mt-4 mb-0">Delivery Date</h5>
              <h7 className="mt-0">{moment(deliveryDetail[0].DeliveryDate).format('D MMM YYYY')}</h7>
            </div>
          )}
        </div>

        <div className="row">
          <div className={`${styles.nameCol} col-sm`}>
            <h5 className="mt-4 mb-0 ms-5">Name</h5>
            <h7 className="mt-0 ms-5">{PR.name}</h7>
          </div>
          <div className={`${styles.nameCol} col-sm`}>
            <h5 className="mt-4 mb-0">Supplier</h5>
            <h7 className="mt-0">{PR.supplierName}</h7>
          </div>
        </div>

        <div className="row">
          <div className={`${styles.locCol} col-sm`}>
            <h5 className="mt-4 mb-0 ms-5">Location</h5>
            <h7 className="mt-4 ms-5">{PR.branchName}</h7>
          </div>
          <div className={`${styles.payCol} col-sm`}>
            <h5 className="mt-4 mb-0">Payment Mode</h5>
            <h7 className="mt-0">{PR.paymentMode}</h7>
          </div>
        </div>

        <div>
          <div className="d-flex">
            <h5 className="mt-5 ms-5 fs-2 mb-0">Product Details</h5>
            {
              editQty === false &&
              <button onClick={handleAllowQtyEdit} className="col-sm-md-lg-xl border-0 rounded-3 mt-5 h-25 p-2 ms-5 text-white shadow align-items-end" style={{ backgroundColor: '#486284' }}>Edit Qty Received</button>
            }
            {
              editQty === true &&
              <button onClick={handleDontAllowQtyEdit} className="col-sm-md-lg-xl border-0 rounded-3 mt-5 h-25 p-2 ms-5 text-white shadow align-items-end btn btn-success">Save</button>
            }
          </div>

          <hr className="col-11 ms-5"></hr>

          <div>
            <ul className="col-sm list-group list-group-horizontal text-center">
              <li className="list-group-item col-sm-2 border-0">Item No.</li>
              <li className="list-group-item col-sm-2 px-2 border-0">Description</li>
              <li className="list-group-item col-sm-2 border-0">Quantity</li>
              <li className="list-group-item col-sm-2 border-0">Unit Price</li>
              <li className="list-group-item col-sm-2 border-0">Total Unit Price</li>
              <li className="list-group-item col-sm-2 border-0">No. Received</li>
            </ul>
          </div>

          <hr className="col-11 ms-5"></hr>

          {editQty === false &&
            productDeets.map((item, index) => {
              return (
                <div key={index}>
                  <ul className="list-group list-group-horizontal text-center">
                    <li className="list-group-item col-sm-2 border-0">{index + 1}</li>
                    <li className="list-group-item col-sm-2 px-2 border-0">{item.itemName}</li>
                    <li className="list-group-item col-sm-2 border-0">{item.quantity}</li>
                    <li className="list-group-item col-sm-2 border-0">{item.unitPrice}</li>
                    <li className="list-group-item col-sm-2 border-0">{item.totalUnitPrice}</li>
                    <li className="list-group-item col-sm-2 border-0 ms-2">
                      <input className={styles.inputVal} value={QtyReceivedList[index].qtyReceived} onChange={(e) => handleQtyChange(index, e, item)} disabled />
                    </li>
                  </ul>
                </div>
              );
            })}

          {
            editQty === true &&
            productDeets.map((item, index) => {
              return <div key={index}>
                <ul className="list-group list-group-horizontal text-center">
                  <li className="list-group-item col-sm-2 border-0">{index + 1}</li>
                  <li className="list-group-item col-sm-2 px-2 border-0">{item.itemName}</li>
                  <li className="list-group-item col-sm-2 border-0">{item.quantity}</li>
                  <li className="list-group-item col-sm-2 border-0">{item.unitPrice}</li>
                  <li className="list-group-item col-sm-2 border-0">{item.totalUnitPrice}</li>
                  <li className="list-group-item col-sm-2 border-0 ms-1"><input className={styles.inputVal} type='number' min={0} max={item.quantity} value={QtyReceivedList[index].qtyReceived} onChange={(e) => handleQtyChange(index, e, item)} id={QtyReceivedList[index].id} onkeyup="if(value<0) value=0;" required /></li>
                </ul>
              </div>
            })
          }

          <hr className="col-11 ms-5"></hr>

        </div>

        <div className="col-sm-11 d-flex align-items-end flex-column me-5 ms-0">
          <div className="d-flex mt-3">
            <h3>Subtotal</h3>
            <p className="col-sm ms-4 fs-4">${Subtotal}</p>
          </div>

          <div className="col-sm d-flex mt-3">
            <h3>GST 8%</h3>
            <p className="col-sm ms-4 fs-4">${GST}</p>
          </div>

          <hr className="col-2"></hr>

          <div className="col-sm d-flex mt-2">
            <h2 className="col-sm me-2">Total</h2>
            <p className="col-sm ms-4 fs-4">${Total}</p>
          </div>
        </div>

        <div className="col-sm ms-5">
          <h2>Remarks</h2>
          <h5>{PR.remarks}</h5>
        </div>

        <br></br>
        <h3 className="col-sm ms-5">Purchase Status</h3>

        <hr className="col-11 ms-5"></hr>

        <div className="col-sm d-flex">
          <div className="col-sm ms-5 fs-4 mt-4 p-2" style={{ flex: 1 }}>
            <label for="payStatus" id={styles.purStatus}>Purchase Status</label><br></br>

            <div className={styles.blabla}>
              <select className={styles.dropdownStatus} value={selectedStatus} onChange={handleStatusChange}>
                <option key={1} value={PR.purchaseStatusID} selected="selected">{PR.purchaseStatus}</option>
                {
                  status.map((status, index) => {
                    if (status.purchaseStatusID !== PR.purchaseStatusID) {
                      return <option key={index + 2} value={status.purchaseStatusID}>{status.purchaseStatus}</option>
                    }
                  })
                }
              </select>
            </div>

          </div>

          {changeStatusPop && (
            <div className={styles.newStatusBox}>
              <div className={styles.newStatus}>
                <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
                <h5 className={styles.changedStatusText}> Status has been changed successfully </h5>
              </div>
            </div>
          )}
        </div>

        <br></br>

        <h3 className="col-sm ms-5">Upload Invoice & Delivery Orders</h3>
        <hr className="col-11 ms-5"></hr>

        <div className="col-sm d-flex flex-wrap">
          <div className="col-sm d-flex flex-column">
            <button onClick={handleOpenModal} className="col-sm rounded-4 mt-3 w-55 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284', width: '90%' }}>
              <h4 className="col-sm text-white pt-2">Upload Invoice</h4><br />
            </button>
            <button onClick={handleOpenModalDO} className="col-sm rounded-4 mt-3 w-55 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284', width: '90%' }}>
              <h4 className="col-sm text-white pt-2">Upload Delivery Order</h4><br />
            </button>
          </div>

          <div className="col-sm d-flex flex-column">
            {PDF && (
              <div className="d-flex">
                <button className="col-sm rounded-4 mt-3 w-40 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284' }} onClick={handleOpenPDFInNewTab}>
                  <h4 className="col-sm text-white pt-2">View Invoice</h4><br />
                </button>
                <button className="btn btn-link btn-sm " style={{ textDecoration: 'none', color: 'black', width: '15%' }} onClick={handleDeleteConfirmation}>
                  <span aria-label="Delete" style={{ fontSize: '25px', verticalAlign: 'middle' }}>&times;</span>
                </button>
              </div>
            )}
            {PDFDO && (
              <div className="d-flex">
                <button className="col-sm rounded-4 mt-3 w-40 ms-4 pt-3 me-1 border-0 shadow text-center" style={{ backgroundColor: '#486284' }} onClick={handleOpenPDFDOInNewTab}>
                  <h4 className="col-sm text-white pt-2">View Delivery Order</h4><br />
                </button>
                <button className="btn btn-link btn-sm " style={{ textDecoration: 'none', color: 'black', width: '15%' }} onClick={handleDeleteDOConfirmation}>
                  <span aria-label="Delete" style={{ fontSize: '25px', verticalAlign: 'middle' }}>&times;</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {changeStatusPop && (
          <div className={styles.newStatusBox}>
            <div className={styles.newStatus}>
              <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
              <h5 className='mt-5'> Status has been changed successfully </h5>
            </div>
          </div>
        )}
      </div>

      {validation && (
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
            <h5 className='mt-5'> Please input a valid number. </h5>

          </div>
        </div>
      )}

      {/* INVOICE PDF */}
      {showModal && (
        <div className="modal fade show d-block" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ border: '1px solid black', borderRadius: "20px" }}>
              <div className="modal-body">
                <div className="d-flex flex-column align-items-center">
                  <h5 className="modal-title">Upload A File</h5>
                  <button type="button" className="closeXbtn" onClick={handleCloseModal} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', background: 'transparent' }}>
                    <span aria-hidden="true">&times;</span>
                  </button> <br />
                  <div style={{ width: '80%', border: '1px dashed black', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
        <div className="modal fade show d-block" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex flex-column align-items-center mt-2">
                  <h2 className="modal-title">Confirm Upload ?</h2>
                  <button type="button" className="close" onClick={handleCloseModal2} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', backgroundColor: 'transparent' }}>
                    <span aria-hidden="true">&times;</span>
                  </button> <br />
                </div>
              </div>
              <div className="d-flex justify-content-center text-center mb-5">
                <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px', marginRight: '15px' }} onClick={handleCloseModal2}>Cancel</button>
                <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px' }} onClick={() => { handleConfirmUpload(); handleCloseModal2(); handleUpload(); }}>Upload</button>
              </div>
            </div>
          </div>

        </div>
      )}


      {/* DO PDF */}

      {showModalDO && (
        <div className="modal fade show d-block" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ border: '1px solid black', borderRadius: "20px" }} >
              <div className="modal-body">
                <div className="d-flex flex-column align-items-center">
                  <h5 className="modal-title">Upload A File</h5>
                  <button type="button" className="closeXbtn" onClick={handleCloseModalDO} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', background: 'transparent' }}>
                    <span aria-hidden="true">&times;</span>
                  </button> <br />
                  <div style={{ width: '80%', border: '1px dashed black', padding: '20px', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* <p className="mb-3">Drag and drop file here</p>
                      <p>or</p> */}
                    <input type="file" className="btn btn-custom-primary mt-3" style={{ display: 'none' }} onChange={(e) => { handleFileUploadDO(e); }} id="fileUpload" />

                    <label htmlFor="fileUpload" className="btn btn-custom-primary mt-3" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px', cursor: 'pointer' }}>
                      Browse Computer
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: 'none' }}>


                {selectedFileDO && (
                  <p className="selected-file">{selectedFileDO.name}</p>

                )}

                <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px', marginRight: '10px' }} onClick={handleCloseModalDO}>Cancel</button>
                <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '30px', padding: '7px 30px' }} onClick={() => { handleCloseModalDO(); handleOpenModal2DO(); }}>Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal2DO && (
        <div className="modal fade show d-block" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex flex-column align-items-center mt-2">
                  <h2 className="modal-title">Confirm Upload ?</h2>
                  <button type="button" className="close" onClick={handleCloseModal2DO} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', backgroundColor: 'transparent' }}>
                    <span aria-hidden="true">&times;</span>
                  </button> <br />
                </div>
              </div>
              <div className="d-flex justify-content-center text-center mb-5">
                <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px', marginRight: '15px' }} onClick={handleCloseModal2DO}>Cancel</button>
                <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px' }} onClick={() => { handleConfirmUploadDO(); handleCloseModal2DO(); handleUploadDO(); }}>Upload</button>
              </div>
            </div>
          </div>

        </div>
      )}

      {deleteConfirm && (
        <div className="modal fade show d-block" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ border: '1px solid black', borderRadius: "20px" }}>
              <div className="modal-body">
                <div className="d-flex flex-column align-items-center mt-2">
                  <h2 className="modal-title">Confirm Delete ?</h2>
                  <button type="button" className="close" onClick={handleCloseDeleteConfirmation} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', backgroundColor: 'transparent' }}>
                    <span aria-hidden="true">&times;</span>
                  </button> <br />
                </div>
              </div>
              <div className="d-flex justify-content-center text-center mb-5">
                <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px', marginRight: '15px' }} onClick={handleCloseDeleteConfirmation} >Cancel</button>
                <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px' }} onClick={() => {handleInvoiceDelete(); handleCloseDeleteConfirmation(); }}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteDOConfirm && (
        <div className="modal fade show d-block" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ border: '1px solid black', borderRadius: "20px" }}>
            <div className="modal-body">
              <div className="d-flex flex-column align-items-center mt-2">
                <h2 className="modal-title">Confirm Delete ?</h2>
                <button type="button" className="close" onClick={handleCloseDeleteDOConfirmation} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '24px', color: '#000000', opacity: '0.5', border: 'none', backgroundColor: 'transparent' }}>
                  <span aria-hidden="true">&times;</span>
                </button> <br />
              </div>
            </div>
            <div className="d-flex justify-content-center text-center mb-5">
              <button type="button" className="btn btn-custom-secondary" style={{ backgroundColor: '#93A0B1', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px', marginRight: '15px' }} onClick={handleCloseDeleteDOConfirmation} >Cancel</button>
              <button type="button" className="btn btn-custom-primary" style={{ backgroundColor: '#486284', color: '#FFFFFF', borderRadius: '20px', padding: '10px 30px' }} onClick={() => {handleDODelete(); handleCloseDeleteDOConfirmation(); }}>Delete</button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Alerts */}
      {
        EditQtyAlert &&
        <AlertBox
          Show={EditQtyAlert}
          Message={`Quantity Updated!`}
          Type={'success'}
          Redirect={``} />
      }

      {
        UpdatePStatus &&
        <AlertBox
          Show={UpdatePStatus}
          Message={`Purchase Status Updated!`}
          Type={'success'}
          Redirect={``} />
      }

      {uploadedInvoiceAlert &&
        <AlertBox
          Show={uploadedInvoiceAlert}
          Message={`Invoice Succesfully Uploaded!`}
          Type={'success'} />
      }

      {uploadedDOAlert &&
        <AlertBox
          Show={uploadedDOAlert}
          Message={`Delivery Order Succesfully Uploaded!`}
          Type={'success'}
        />}

      {deleteInvoiceAlert && 
      <AlertBox
      Show={deleteInvoiceAlert}
      Message={`Invoice Successfully Deleted!`}
      Type={`success`}
      Redirect={``} />}

      {deleteDOAlert && 
      <AlertBox
      Show={deleteInvoiceAlert}
      Message={`Delivery Order Successfully Deleted!`}
      Type={`success`}
      Redirect={``} />}

    </div>
  );
};
