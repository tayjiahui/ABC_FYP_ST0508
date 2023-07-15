import axios from 'axios';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from 'next/image';
import arrowIcon from '../../public/arrowIcon.svg';
import plusIcon from '../../public/addLocationIcon.svg';
// import greenCircle from '../../public/greenApprovedCircle.svg'
import styles from '../../styles/trackOrderById.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import WIP from '../../components/WIP'

//----------------------function name has to be uppercase

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
  // const productD = await fetch(`${backBaseURL}/api/trackOrder/productDetails/${poID}`);
  const productD = await fetch(`${backBaseURL}/api/purchaseReq/lineItem/${poID}`);
  const PRDetails = await fetch(`${backBaseURL}/api/purchaseReq/PR/${poID}`);

  const data1 = await poD.json();
  const data2 = await productD.json();
  const data3 = await PRDetails.json();

  // console.log(data1);
  // console.log(data2);

  const gst = data3[0].GST;

  const qtyReceiveS = [];

  // filter out duplicated data & combine multiple locations
  data1.forEach((item, index) => {
    if (index > 0) {
      data1[0].branchName += `, ${item.branchName}`;
    }
  });

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
      poID
    }
  }
}

// main frontend page
export default function Main({ purOrderD, productDeets, gstDetails, QtyReceived }) {

  const router = useRouter();

  // const prID = router.query.prID;
  const poID = router.query.poID;
  const [RequestDate, setTargetDate] = useState();

  const [ProductDetails, setList] = useState();

  const [Subtotal, subtotalCal] = useState();
  const [GST, gstCal] = useState();
  const [Total, totalCal] = useState();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [status, setStatus] = useState([]);

  const [changeStatusPop, setChangeStatusPop] = useState();
  const [changeStatusPop2, setChangeStatusPop2] = useState();
  const [amount, setAmount] = useState('');

  const [editQty, allowQtyEdit] = useState(false);
  const [QtyReceivedList, setQtyReceivedList] = useState(QtyReceived);
  const [showInProg, setInProg] = useState(false);
  // const [checkRemark, setRemark] = useState();
  const [selectedValue, setSelectedValue] = useState('');
  // console.log("purchase status id", selectedValue);
  // console.log("po id", poID);

  //validation for number received for line item
  const [validation, setValidation] = useState('');

  // Control Allow QTY Edit
  const handleAllowQtyEdit = () => {
    allowQtyEdit(true);
  };

  // Onclick Save button for QtY received
  const handleDontAllowQtyEdit = async (e) => {
    e.preventDefault();

    QtyReceivedList.forEach(async (item, index) => {
      await axios.put(`${baseUrl}/api/purchaseReq/lineItem/${item.id}`,
        {
          "qtyReceived": item.qtyReceived
        }
      )
        .then((response) => {
          console.log(response);
          allowQtyEdit(false);
        })
        .catch((err) => {
          console.log(err);
        });
    });

  };

  // Handling Qty value edit
  const handleQtyChange = (index, e, item) => {
    const newQTY = e.target.value;
    let qty = item.quantity;

    let data = [...QtyReceivedList];

    data[index].qtyReceived = newQTY;

    // Perform validation
    if (newQTY > qty) {
      setValidation("Invalid quantity.");
      data[index].qtyReceived = "NIL";
    } else {
      setValidation('');
      setQtyReceivedList(data);
    }

    //setQtyReceivedList(data);
  };

  // const handleClick = async (e) => {

  // const { value } = e.target;
  // setSelectedValue(value);
  //     e.preventDefault();

  //     try {
  //         // Send the selected option to the server using Axios PUT request
  //         const response = await axios.put(`${baseUrl}/api/trackOrder/purchaseOrderStatus/${poID}`, {
  //             purchaseStatusID: selectedValue,
  //         });
  //         console.log(response.data); // Handle the response as needed

  //     } catch (error) {
  //         console.error(error);
  //     }

  // }

  // const handleAmountChange = (event) => {
  //     setAmount(event.target.value);
  // };

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

  const handleCloseStatusPop2 = () => {
    setChangeStatusPop2(false);
  };

  const handleChange = (event) => {
    // console.log(event.target.value);

    setSelectedValue(event.target.value);
    // localStorage.setItem('selectedValue', event.target.value);
    const selectednewValue = event.target.value;
    if (selectednewValue === "1" || "2" || "3" || "4" || "5") {
      setChangeStatusPop(true)
    }
    else {
      // console.log("other options")
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (amount == "") {
    //     alert("Please put in an amount to update!")
    // }
    // else if (amount < 0) {
    //     alert("Please put in a valid number!")
    // }
    // else if (isNaN(amount)) {
    //     alert("Please put in a valid number!")
    // } else {
    await axios.put(`${baseUrl}/api/trackOrder/purchaseOrder/qty/${poID}`,
      {
        "qtyReceived": amount
      }
    )
      .then((response) => {
        alert(`Quantity has been changed!`);
      })
      .catch((err) => {
        console.log(err);
      });
    //}
  };

  useEffect(() => {
    const storedOption = localStorage.getItem('selectedValue');
    if (storedOption) {
      setSelectedValue(storedOption);
    }

    axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`)
      .then(res => {
        // console.log(res.data)
        setStatus(res.data);
        setSelectedStatus(res.data[0]); //initial selected status
      })
      .catch(err => console.log(err));
  }, []);

  // PR Details  
  const PR = purOrderD[0];

  useEffect(() => {

    // Target Delivery Date formatting
    const newDateFormat = moment(PR.requestDate).format('DD/MM/YYYY');
    setTargetDate(newDateFormat);

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

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    const selectedValue = event.target.value;
    // console.log(event.target);
    // console.log("value", selectedValue);

    // else if (selectedValue === "Preparing Order") {
    //   setChangedStatusPop(true);
    // }

    // console.log('other options')
    axios.put(`${baseUrl}/api/trackOrder/purchaseOrderStatus/${poID}`, {
      purchaseStatusID: selectedValue,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setChangeStatusPop(true);
  };

  return (
    <div>
      <h1 className='firstHeaderTop'>
        <a href={"/TrackOrder"} className='purchaseOrderNo'>
          <Image src={arrowIcon} className="col-sm pr-2 pb-2" alt="Back" />
        </a>Purchase Order #{PR.prID}
      </h1>

      <div>

        <h3 className="col-sm ms-5">Purchase Order Details</h3>

        <div className={styles.lineContainer}>
          <hr className={styles.lineDivider}></hr>
        </div>

        <h5 className="col-sm ms-5 mt-3">Date Request</h5>
        <h7 className="col-sm ms-5 pb-0">{RequestDate}</h7><br></br>

        <div className="d-flex">
          <div className={styles.nameCol}>
            <h5 className="col-sm mt-4 ms-5 mb-0">Name</h5>
            <h7 className="col-sm mt-0 ms-5">{PR.name}</h7>
          </div>

          <div className={styles.supCol}>
            <h5 className="col-sm mt-4 mb-0">Supplier</h5>
            <h7 className="col-sm mt-0">{PR.supplierName}</h7>
          </div>

        </div><br></br>

        <div className="d-flex">
          <div className={styles.locCol}>
            <h5 className="col-sm mt-4 ms-5 mb-0">Location</h5>
            <h7 className="col-sm mt-4 ms-5">{PR.branchName}</h7><br></br>
            {/* <h7 className={styles.locInfo}>Takashimaya</h7> */}
          </div><br></br>

          <div className={styles.payCol}>
            <h5 className="col-sm mt-4 mb-0">Payment Mode</h5>
            <h7 className="col-sm mt-0">{PR.paymentMode}</h7>
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

          <div className={styles.lineContainer}>
            <hr className={styles.lineDivider}></hr>
          </div>

          <div>
            <ul className="col-sm list-group list-group-horizontal text-center">
              <li className="col-sm list-group-item col-sm-2 border-0">Item No.</li>
              <li className="col-sm list-group-item col-sm-1 ms-1 me-1 border-0">Description</li>
              <li className="col-sm list-group-item col-sm-3 ms-5 border-0">Quantity</li>
              <li className="col-sm list-group-item col-sm-1 border-0">Unit Price</li>
              <li className="col-sm list-group-item col-sm-2 border-0">Total Unit Price</li>
              <li className="col-sm list-group-item col-sm-2 border-0">No. Received</li>
            </ul>
          </div>

          <div className={styles.lineContainer}>
            <hr className={styles.lineDivider}></hr>
          </div>

          {
            editQty === false &&
            productDeets.map((item, index) => {
              return <div key={index}>
                <ul className="list-group list-group-horizontal text-center">
                  <li className="list-group-item col-sm-2 border-0">{index + 1}</li>
                  <li className="list-group-item col-sm-2 px-2 border-0">{item.itemName}</li>
                  <li className="list-group-item col-sm-2 border-0">{item.quantity}</li>
                  <li className="list-group-item col-sm-2 border-0">{item.unitPrice}</li>
                  <li className="list-group-item col-sm-1 border-0">{item.totalUnitPrice}</li>
                  <li className="list-group-item col-sm-2 border-0 ms-5"><input value={QtyReceivedList[index].qtyReceived} onChange={(e) => handleQtyChange(index, e, item)} disabled /></li>
                </ul>
              </div>
            })
          }

          {
            editQty === true &&
            productDeets.map((item, index) => {
              return <div key={index}>
                <div>
                  <ul className="list-group list-group-horizontal text-center">
                    <li className="list-group-item col-sm-2 border-0">{index + 1}</li>
                    <li className="list-group-item col-sm-2 px-2 border-0">{item.itemName}</li>
                    <li className="list-group-item col-sm-2 border-0">{item.quantity}</li>
                    <li className="list-group-item col-sm-2 border-0">{item.unitPrice}</li>
                    <li className="list-group-item col-sm-1 border-0">{item.totalUnitPrice}</li>
                    <li className="list-group-item col-sm-2 border-0 ms-5"><input type='number' min={0} max={item.quantity} value={QtyReceivedList[index].qtyReceived} onChange={(e) => handleQtyChange(index, e, item)} id={QtyReceivedList[index].id} onkeyup="if(value<0) value=0;" required /></li>
                  </ul>
                </div>
              </div>
            })
          }

          {/* {ProductDetails} */}

          <div className={styles.lineContainer}>
            <hr className={styles.lineDivider}></hr>
          </div>

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

          <div className={styles.lineContainer2}>
            <hr className={styles.lineDivider2}></hr>
          </div>

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
        <br></br>
        <h3 className="col-sm ms-5">Purchase & Payment Status</h3>

        <div className={styles.lineContainer}>
          <hr className={styles.lineDivider}></hr>
        </div>


        <div className="col-sm d-flex">

          {/* <div className="col-sm ms-5 fs-4 mt-4 p-2" style={{flex: 1}}>
                        <label for="payStatus" id={styles.payStatus}>Payment Status</label><br></br>

                        <select name="status" id={styles.words1}>
                            <option value="pending">Pending</option>
                            <option value="sent">Payment Sent</option>
                            <option value="received">Payment Received</option>
                            <option value="create">Create New Status</option>
                        </select>
                    </div> */}

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
                <h5 className='mt-5'> Status has been changed successfully </h5>

              </div>
            </div>
          )}
        </div>

        <br></br>

        <h3 className="col-sm ms-5">Upload Invoice & Delivery Orders</h3>
        <div className={styles.lineContainer}>
          <hr className={styles.lineDivider}></hr>
        </div>


        {changeStatusPop2 && (
          <div className={styles.updateQty2} >
            <div className={styles.updateQtyInfo} >
              <p onClick={handleCloseStatusPop2} className={styles.closemeStatus1}>X</p>
              <h5 className={styles.changedQty}>Please input the amount received!</h5>
              <form onSubmit={handleSubmit}>
                <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} id={styles.noRecInfo}></input><br></br>
                <button type="submit" >Update Amount</button>
              </form>

            </div>
          </div>
        )}

        {validation && (
          <div className={styles.newStatusBox}>
            <div className={styles.newStatus}>
              <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
              <h5 className='mt-5'> Please input a valid number. </h5>

            </div>
          </div>
        )}

        <div className="col-sm d-flex">
          <button onClick={handleOpenWip} className="col-sm rounded-4 mt-3 w-50 ms-4 pt-3 me-1 shadow border-0 text-center" style={{ backgroundColor: '#486284' }}>
            <h4 className="col-sm text-white pt-2">Upload Invoice</h4><br></br>
            {showInProg && <WIP Show={showInProg} />}
          </button>


          <button onClick={handleOpenWip} className="col-sm rounded-4 mt-3 w-50 ms-1 me-5 pt-3 shadow border-0 text-center" style={{ backgroundColor: '#486284' }}>
            <h4 className="col-sm text-white pt-2">Upload Delivery Order</h4><br></br>
            {showInProg && <WIP Show={showInProg} />}
          </button>
        </div>

        <div className="col-sm d-flex mt-2">
          <div style={{ flex: 1 }}>
            <Image src={plusIcon} className="col-sm img-responsive ms-5" alt="plus" />
            <h7 className="col-sm ms-2">Add Invoice</h7>
          </div>

          <div style={{ flex: 1 }}>
            <Image src={plusIcon} className="col-sm img-responsive" alt="plus" />
            <h7 className="col-sm ms-2">Add Delivery Order</h7>
          </div>
        </div>
      </div>
    </div>
  );
};