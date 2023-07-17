import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import moment from "moment";
import axios from "axios";

import styles from "../../styles/viewPR.module.css";
import styles2 from "../../styles/createPR.module.css";

// Image
import arrowIcon from "../../public/arrowIcon.svg";
import pendingCircle from "../../public/yellowPendingCircle.svg";
import approvedCircle from "../../public/greenApprovedCircle.svg";
import rejectedCircle from "../../public/redRejectedCircle.svg";
import nextArrow from "../../public/rightArrowWhite.svg";
import addLocIcon from "../../public/addLocationIcon.svg";
import addIcon from "../../public/plusIcon.svg";
import xIcon from "../../public/xIcon.svg";

// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // console.log('hostname   ' + hostname);
    if (hostname == "localhost") {
      URL.push("http://localhost:3000", "http://localhost:5000");
      console.log(URL);
    } else if (hostname == "abc-cooking-studio.azurewebsites.net") {
      URL.push(
        "https://abc-cooking-studio-backend.azurewebsites.net",
        "https://abc-cooking-studio.azurewebsites.net"
      );
      console.log(URL);
    }

    return URL;
  }
};

isLocalhost();

const baseUrl = URL[0];

const isBrowser = () => typeof window !== "undefined"; //The approach recommended by Next.js

function scrollToTop() {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function ItemLines(props) {
  return (
    <div>
      <ul className="list-group list-group-horizontal text-center">
        <li className="list-group-item col-sm-2 border-0">{props.ItemNo}</li>
        <li className="list-group-item col-sm-4 px-2 border-0 text-start">
          {props.ItemName}
        </li>
        <li className="list-group-item col-sm-2 border-0">{props.Qty}</li>
        <li className="list-group-item col-sm-2 border-0">{props.UnitPrice}</li>
        <li className="list-group-item col-sm-2 border-0">
          {props.TotalUnitPrice}
        </li>
      </ul>
    </div>
  );
};

function DropdownOpt(props) {
  return (
    <>
      <option id={props.ID} value={props.Value} />
    </>
  );
};

function ItemDropDown(props) {
  return (
    <>
      <option
        id={props.ID}
        data-unitprice={props.UnitPrice}
        value={props.Value}
      />
    </>
  );
};

function getSelectedOption(e) {
  const selectedValue = e.target.value;
  const selectedOption = Array.from(e.target.list.options).find(
    (option) => option.value === selectedValue
  );
  const selectedID = selectedOption ? selectedOption.getAttribute("id") : "";
  const selectedUnitPrice = selectedOption
    ? selectedOption.getAttribute("data-unitprice")
    : "";

  if (selectedUnitPrice == null) {
    return [selectedValue, selectedID];
  } else {
    return [selectedValue, selectedID, selectedUnitPrice];
  }
};

export async function getServerSideProps(context) {
  const host = context.req.headers.host;
  // console.log(host);

  const backBaseURL = [];

  if (host == "localhost:5000") {
    backBaseURL.push("http://localhost:3000");
  } else {
    backBaseURL.push("https://abc-cooking-studio-backend.azurewebsites.net");
  };

  const { params } = context;
  const { prID } = params;

  const POCheck = [];

  // Normal View PR by ID page
  const getPRDetails = await fetch(`${backBaseURL}/api/purchaseReq/PR/${prID}`);
  const getPRProductLines = await fetch(
    `${backBaseURL}/api/purchaseReq/lineItem/${prID}`
  );

  const prDetails = await getPRDetails.json();
  const prProductLines = await getPRProductLines.json();

  // Reappeal PR Form
  const getSuppliers = await fetch(`${backBaseURL}/api/supplier/all`);
  const getBranches = await fetch(`${backBaseURL}/api/purchaseReq/branch/all`);
  const getPaymentModes = await fetch(
    `${backBaseURL}/api/purchaseReq/paymentMode/all`
  );
  const getInventory = await fetch(`${backBaseURL}/api/inventory/item/all`);

  const suppliers = await getSuppliers.json();
  const locations = await getBranches.json();
  const paymentModes = await getPaymentModes.json();
  const inventory = await getInventory.json();

  const ogLocations = [];
  const ogPL = [];

  // console.log(prDetails);
  // console.log(prProductLines);

  // get gst
  const gstDetails = prDetails[0].GST;

  const PR = prDetails[0];

  // Get Original PR locations Data
  const locArr = PR.branchName.split(",");
  const locIDArr = PR.branchIDs.split(",");

  for (let i = 0; i < locArr.length; i++) {
    ogLocations.push({ location: locArr[i], id: locIDArr[i] });
  };

  // Get Original PR PL Data
  prProductLines.forEach((item, index) => {
    ogPL.push({
      id: item.itemID,
      ItemNo: index + 1,
      ItemName: item.itemName,
      ItemQty: item.quantity,
      UnitPrice: item.unitPrice,
      TotalUnitPrice: item.totalUnitPrice,
    });
  });

  // Check if PO present
  await axios(`${backBaseURL}/api/trackOrder/purchaseOrderDetails/${prID}`)
    .then(() => {
      POCheck.push(true);
    })
    .catch((err) => {
      if (err.response.status === 404) {
        POCheck.push(false);
      } else {
        console.log(err.response);
      }
    });

  return {
    props: {
      host,
      prDetails: prDetails,
      pLDetails: prProductLines,
      gstDetails,
      POCheck,
      suppliers,
      locations,
      paymentModes,
      inventory,
      LocationData: ogLocations,
      PLItemData: ogPL,
      prID,
    },
  };
};

export default function ViewPR({
  prDetails,
  pLDetails,
  gstDetails,
  POCheck,
  suppliers,
  locations,
  paymentModes,
  inventory,
  LocationData,
  PLItemData,
}) {
  const router = useRouter();

  const prID = router.query.prID;

  const [id, setUserID] = useState();
  const [role, setRoleID] = useState();

  //   Normal view PR ID
  const [Circle, testCircle] = useState();

  const [TargetDeliveryDate, setTargetDate] = useState();

  const [ProductDetails, setList] = useState();

  const [Subtotal, subtotalCal] = useState();
  const [GST, gstCal] = useState();
  const [Total, totalCal] = useState();

  const [checkRemark, setRemark] = useState(false);

  // Approver Sections
  const [checkApprComment, setComment] = useState(false);

  const [ApprComment, setApprComment] = useState();

  const [isAdmin, setAdmin] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  const [havePO, checkHavePO] = useState(false);

  const [viewApprComment, setViewApprComment] = useState();

  // Reappeal
  const [Reappeal, allowReappeal] = useState(false);
  // dropdown lists states for Reappeal
  const [Suppliers, supplierList] = useState();
  const [Locations, locationList] = useState();
  const [PaymentModes, pmList] = useState();
  const [Items, itemList] = useState();

  // PR Details
  const PR = prDetails[0];

  // Normal View By ID Page
  useEffect(() => {
    // set user id taken from localstorage
    const userID = parseInt(localStorage.getItem("ID"), 10);
    setUserID(userID);

    // set user role
    const roleID = parseInt(localStorage.getItem("roleID"), 10);
    setRoleID(roleID);

    // set view appr comments
    setViewApprComment(PR.apprRemarks);

    // check if admin/ approver
    if (roleID === 1) {
      setAdmin(true);
    };

    // Chcek if already have PO
    if (POCheck[0] === true) {
      checkHavePO(true);
    };

    // Test for status Circle
    const statusID = PR.prStatusID;

    function circleTest(statusID) {
      if (statusID == 1) {
        setIsPending(true);
        return "/yellowPendingCircle.svg";
      } else if (statusID == 2) {
        setIsApproved(true);
        return "/greenApprovedCircle.svg";
      } else if (statusID == 3) {
        setIsRejected(true);
        return "/redRejectedCircle.svg";
      } else {
        return "/yellowPendingCircle.svg";
      }
    };

    const circle = circleTest(statusID);
    testCircle(circle);

    // Target Delivery Date formatting
    const newDateFormat = moment(PR.targetDeliveryDate).format("D MMM YYYY");
    setTargetDate(newDateFormat);

    // Product lines
    const itemLines = [];
    const totalPrices = [];

    pLDetails.forEach((item, index) => {
      itemLines.push(
        <div key={index}>
          <ItemLines
            ItemNo={index + 1}
            ItemName={item.itemName}
            Qty={item.quantity}
            UnitPrice={item.unitPrice}
            TotalUnitPrice={item.totalUnitPrice}
          />
        </div>
      );

      totalPrices.push(item.totalUnitPrice);
    });

    setList(itemLines);

    // Calculate Total
    function CalculateTotal(array) {
      let total = 0;
      for (let i = 0; i < array.length; i++) {
        let num = +array[i];
        total = total + num;
      }

      return total;
    };

    // get gst by based on PR
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

    // check if there is remarks
    if (PR.remarks !== "" && PR.remarks !== null) {
      setRemark(true);
    };

    // check if there is approver comment
    if (PR.apprRemarks !== "" && PR.apprRemarks !== null) {
      setComment(true);
    };
  }, []);

  // Reappeal Page
  useEffect(() => {
    // Suppliers dropdown
    const SList = [];

    suppliers.forEach((item, index) => {
      SList.push(
        <div key={index}>
          <DropdownOpt ID={item.supplierID} Value={item.supplierName} />
        </div>
      );
    });
    supplierList(SList);

    // Locations Drop down
    const LList = [];

    locations.forEach((item, index) => {
      LList.push(
        <div key={index}>
          <DropdownOpt ID={item.branchID} Value={item.branchName} />
        </div>
      );
    });
    locationList(LList);

    // Payment Mode drop down
    const PMList = [];

    paymentModes.forEach((item, index) => {
      PMList.push(
        <div key={index}>
          <DropdownOpt ID={item.paymentModeID} Value={item.paymentMode} />
        </div>
      );
    });
    pmList(PMList);

    // Items drop down
    const IList = [];

    inventory.forEach((item, index) => {
      IList.push(
        <div key={index}>
          <ItemDropDown
            ID={item.itemID}
            UnitPrice={item.unitPrice}
            Value={item.itemName}
          />
        </div>
      );
    });
    itemList(IList);
  }, []);

  const submitApproval = async (e) => {
    e.preventDefault();

    if (ApprComment !== "") {
      await axios
        .put(`${baseUrl}/api/purchaseReq/PR/${prID}`, {
          comments: ApprComment,
          prStatusID: 2,
          apprUserID: id,
        })
        .then((response) => {
          alert(`Purchase Request #${prID} has been Approved!`);
          router.push("/PurchaseRequest");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .put(`${baseUrl}/api/purchaseReq/PR/${prID}`, {
          prStatusID: 2,
          apprUserID: id,
        })
        .then((response) => {
          alert(`Purchase Request #${prID} has been Approved!`);
          router.push("/PurchaseRequest");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const submitDeny = async (e) => {
    e.preventDefault();

    if (ApprComment !== "") {
      await axios
        .put(`${baseUrl}/api/purchaseReq/PR/${prID}`, {
          comments: ApprComment,
          prStatusID: 3,
          apprUserID: id,
        })
        .then((response) => {
          alert(`Purchase Request #${prID} has been Denied!`);
          router.push("/PurchaseRequest");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axios
        .put(`${baseUrl}/api/purchaseReq/PR/${prID}`, {
          prStatusID: 3,
          apprUserID: id,
        })
        .then((response) => {
          alert(`Purchase Request #${prID} has been Denied!`);
          router.push("/PurchaseRequest");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const convertToPO = async (e) => {
    // e.preventDefault();

    await axios
      .post(`${baseUrl}/api/trackOrder/purchaseOrder`, {
        prID: prID,
      })
      .then((response) => {
        // console.log(response);
        alert(response.data);

        // redirect to track PO
        router.push(`/TrackOrder/${prID}`);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
      });
  };

  // enable reappeal form
  const handleReappealPR = async (e) => {
    e.preventDefault();

    await axios
      .put(`${baseUrl}/api/purchaseReq/PR/ApprComment/${prID}`, {
        comments: viewApprComment,
      })
      .catch((err) => {
        console.log(err);
      });
    allowReappeal(true);
    scrollToTop();
  };

  //   Close reappeal form
  const handleBackReappeal = async (e) => {
    e.preventDefault();

    await axios
      .put(`${baseUrl}/api/purchaseReq/PR/ApprComment/${prID}`, {
        comments: viewApprComment,
      })
      .catch((err) => {
        console.log(err);
      });
    allowReappeal(false);
  };

  // add location input box
  const [LocationsList, setLocations] = useState(LocationData);
  const addLocInput = () => {
    setLocations([...LocationsList, { location: "", id: "" }]);
  };

  const removeLocInput = (index) => {
    const list = [...LocationsList];
    list.splice(index, 1);
    setLocations(list);
  };

  // handle each location input
  const handleLocationChange = (index, e) => {
    const [location, id] = getSelectedOption(e);

    let data = [...LocationsList];

    data[index].location = location;
    data[index].id = id;

    setLocations(data);
  };

  // add item line inputs // currently only max 5 items
  const [ItemLineList, SetItemLineList] = useState(PLItemData);
  const addItemLine = () => {
    // max 5 items
    // if(ItemLineList.length < 5){
    SetItemLineList([
      ...ItemLineList,
      {
        id: "",
        ItemNo: "",
        ItemName: "",
        ItemQty: "",
        UnitPrice: "",
        TotalUnitPrice: "",
      },
    ]);
    // };
  };

  const removeItemLine = (index) => {
    const ItemList = [...ItemLineList];
    ItemList.splice(index, 1);
    SetItemLineList(ItemList);
  };

  // handle each item change
  const handleItemChange = (index, e) => {
    let data = [...ItemLineList];
    let reg = new RegExp("^[1-9]+[0-9]*$");

    if (e.target.name == "ItemQty") {
      if (reg.test(e.target.value)) {
        data[index].ItemQty = e.target.value;
      }
    } else {
      const [itemName, id, unitPrice] = getSelectedOption(e);
      data[index].ItemName = itemName;
      data[index].id = id;
      data[index].UnitPrice = unitPrice;
    }

    // Calculate total unit price
    if (data[index].ItemQty !== "" && data[index].ItemName !== "") {
      let totalPrice = (data[index].ItemQty * data[index].UnitPrice).toFixed(2);
      data[index].TotalUnitPrice = totalPrice;
    }

    SetItemLineList(data);
  };

  const targetDelDate = moment(PR.targetDeliveryDate).format("YYYY-MM-DD");

  // input states
  const [dateReqV, setDateReq] = useState(targetDelDate);
  const [supplierV, setSupplier] = useState({
    value: PR.supplierName,
    id: PR.supplierID,
  });
  const [PMV, setPM] = useState({
    value: PR.paymentMode,
    id: PR.paymentModeID,
  });
  const [Remark, setRemarkR] = useState(PR.remarks);

  const handleSupplierInput = (e) => {
    const [value, id] = getSelectedOption(e);
    setSupplier({ value: value, id: id });
  };

  const handlePMInput = (e) => {
    const [value, id] = getSelectedOption(e);
    setPM({ value: value, id: id });
  };

  // axios to reappeal PR
  const reappealPR = async (e) => {
    e.preventDefault();

    await axios
      .post(`${baseUrl}/api/purchaseReq/`, {
        purchaseTypeID: 1,
        targetDeliveryDate: dateReqV,
        userID: id,
        supplierID: supplierV.id,
        paymentModeID: PMV.id,
        remarks: Remark,
      })
      .then((response) => {
        // console.log(response);
        // console.log(ItemLineList);

        axios
          .get(`${baseUrl}/api/purchaseReq/latestPRID/${id}`)
          .then((response) => {
            // console.log(response);
            const latestPRID = response.data[0].prID;
            // console.log(latestPRID);

            LocationsList.forEach((item, index) => {
              axios.post(`${baseUrl}/api/purchaseReq/deliveryLocation`, {
                prID: latestPRID,
                branchID: item.id,
              });
            });

            ItemLineList.forEach((item, index) => {
              axios.post(`${baseUrl}/api/purchaseReq/lineItem`, {
                prID: latestPRID,
                itemID: item.id,
                quantity: item.ItemQty,
                totalUnitPrice: item.TotalUnitPrice,
              });
            });

            alert(`Reappealed Purchase Request #${latestPRID} Created!`);

            // redirect
            router.push(`/PurchaseRequest/${latestPRID}`);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Reappeal Form reset
  const handleRefresh = async (e) => {
    e.preventDefault();

    // reload page
    router.reload();
    allowReappeal(true);
    // scroll to top
    scrollToTop();
  };

  return (
    <>
      {Reappeal === false && (
        <div className="pb-5">
          <div className="headerRow">
            <div>
              <h1>
                <a href={"/PurchaseRequest"}>
                  <Image src={arrowIcon} id={styles.arrow} alt="Back" />
                </a>
                Purchase Request #{prID}
                <Image
                  src={Circle}
                  alt="PR Status"
                  width={25}
                  height={25}
                  className={styles.statusCircle}
                />
              </h1>
            </div>
          </div>

          <div className={styles.prDetails}>
            <div className="py-3">
              <h4>Target Delivery Date</h4>
              <p>{TargetDeliveryDate}</p>
            </div>

            <div className={styles.viewRow}>
              <div className="py-3">
                <div className={styles.viewCol}>
                  <h4>Name</h4>
                  <p>{PR.name}</p>
                </div>
                <div className={styles.viewCol}>
                  <h4>Supplier</h4>
                  <p>{PR.supplierName}</p>
                </div>
              </div>
            </div>

            <div className={styles.viewRow}>
              <div className="py-3">
                <div className={styles.viewCol}>
                  <h4>Location</h4>
                  <p>{PR.branchName}</p>
                </div>
                <div className={styles.viewCol}>
                  <h4>Payment Mode</h4>
                  <p>{PR.paymentMode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.productDetails}>
            <div className={styles.pDTop}>
              <h4>Product Details</h4>
              <hr />
              <ul className="list-group list-group-horizontal text-center">
                <li className="list-group-item col-sm-2 border-0">Item No.</li>
                <li className="list-group-item col-sm-4 px-2 border-0 text-start">
                  Item
                </li>
                <li className="list-group-item col-sm-2 border-0">Quantity</li>
                <li className="list-group-item col-sm-2 border-0">
                  Unit Price
                </li>
                <li className="list-group-item col-sm-2 border-0">
                  Total Unit Price
                </li>
              </ul>
              <hr />
            </div>
            <div>{ProductDetails}</div>
            <div>
              <hr />
              <ul className="list-group list-group-horizontal text-center">
                <li className="list-group-item col-sm-8 border-0"></li>
                <li className="list-group-item col-sm-2 border-0">
                  <h3>Subtotal</h3>
                </li>
                <li className="list-group-item col-sm-2 pt-3 border-0">
                  ${Subtotal}
                </li>
              </ul>
              <ul className="list-group list-group-horizontal text-center">
                <li className="list-group-item col-sm-8 border-0"></li>
                <li className="list-group-item col-sm-2 border-0">
                  <h3>GST 8%</h3>
                </li>
                <li className="list-group-item col-sm-2 pt-3 border-0">
                  ${GST}
                </li>
              </ul>

              <hr id={styles.totalLine} />

              <ul className="list-group list-group-horizontal text-center pt-1 w-100">
                <li className="list-group-item col-sm-8 border-0"></li>
                <li className="list-group-item col-sm-2 border-0">
                  <h2>Total</h2>
                </li>
                <li className="list-group-item col-sm-2 pt-3 border-0">
                  ${Total}
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.prDetails}>
            {checkRemark && (
              <div className="pt-3">
                <h4>Remarks</h4>
                <p>{PR.remarks}</p>
              </div>
            )}
          </div>

          <div className="px-5">
            <hr className={styles.endLine} />
          </div>

          <div>
            {isPending && isAdmin && (
              <div>
                <div className="px-5 mx-5 pb-5 pt-2">
                  <h2>Approve Purchase Request?</h2>
                  <form>
                    <div className="py-3 mb-3">
                      <p>Comments</p>
                      <textarea
                        value={ApprComment}
                        onChange={(e) => setApprComment(e.target.value)}
                        className={styles.textArea}
                      ></textarea>
                    </div>

                    <div className="py-3">
                      <div className={styles.apprButtons}>
                        <button
                          onClick={submitDeny}
                          className={styles.denyButton}
                        >
                          Reject
                        </button>
                        <div className={styles.divider}></div>
                        <button
                          onClick={submitApproval}
                          className={styles.approveButton}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div>
            {checkApprComment && (
              <div className="px-5 mx-5 pb-5 pt-2">
                <div>
                  {isRejected && (
                    <h2>
                      Purchase Request #{prID} has been{" "}
                      <b className={styles.rejectedB}>Rejected</b>!
                    </h2>
                  )}
                  {isApproved && (
                    <h2>
                      Purchase Request #{prID} has been{" "}
                      <b className={styles.approvedB}>Approved</b>!
                    </h2>
                  )}
                  <div className="pt-5">
                    <h4>Approver's Comments</h4>
                    <div className="py-3 w-70">
                      <div className={styles.apprCommentsBox}>
                        <div className="p-4">
                          {/* <p>{PR.apprRemarks}</p> */}
                          <textarea
                            value={viewApprComment}
                            onChange={(e) => setViewApprComment(e.target.value)}
                            className={styles.apprCommentTextArea}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {isApproved && (
              <div>
                <div className="px-5 mx-5 py-5">
                  <div className={styles.createPO}>
                    {havePO === false && (
                      <div className="pb-5">
                        <div>
                          <a href={baseUrl + `/api/pdf/PurchaseOrder/` + prID}>
                            <button
                              onClick={convertToPO}
                              className={styles.createPOButton}
                            >
                              {/* <div className="ms-5 me-2 ps-2">
                                                                            Next<Image src={nextArrow} width={25} height={25} alt="Next Arrow" className="ms-5"/>
                                                                        </div> */}
                              <div className="px-5">
                                Convert To Purchase Order
                                <Image
                                  src={nextArrow}
                                  width={25}
                                  height={25}
                                  alt="Next Arrow"
                                />
                              </div>
                            </button>
                          </a>
                        </div>
                      </div>
                    )}

                    {havePO === true && (
                      <div className="pb-5 W-100">
                        <div className="pt-2">
                          <a
                            href={
                              baseUrl + `/api/pdf/PurchaseOrder/view/` + prID
                            }
                            target="_blank"
                          >
                            <button className={styles.viewPOButton}>
                              <div className="px-5">
                                View Purchase Order PDF
                              </div>
                            </button>
                          </a>
                        </div>

                        <div className="pt-2">
                          <a href={baseUrl + `/api/pdf/PurchaseOrder/` + prID}>
                            <button className={styles.downloadPOButton}>
                              <div className="px-5">
                                Download Purchase Order
                              </div>
                            </button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {isRejected && (
              <div>
                <div className="px-5 py-3 mx-5 mb-5">
                  <div className={styles.reappealPR}>
                    <button
                      onClick={handleReappealPR}
                      className={styles.reappealPRButton}
                    >
                      Reappeal Purchase Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {Reappeal === true && (
        <div className="pb-5">
          <div className="headerRow">
            <div>
              <h1>
                <a href={"/PurchaseRequest"}>
                  <Image src={arrowIcon} id={styles.arrow} alt="Back" />
                </a>
                Reappeal Purchase Request #{prID}
                {/* <Image src={Circle} alt="PR Status" width={25} height={25} className={styles.statusCircle}/> */}
              </h1>
            </div>
          </div>

          <form onSubmit={reappealPR}>
            <div className={styles2.prDetails}>
              <div className={styles2.viewCol}>
                <h4>Target Delivery Date</h4>
                <input
                  type="date"
                  value={dateReqV}
                  onChange={(e) => setDateReq(e.target.value)}
                  name="dateReq"
                  required
                />
              </div>

              <div className={styles2.viewRow}>
                <div className="pt-4">
                  <div className={styles2.viewCol}>
                    <h4>Supplier</h4>
                    <input
                      list="suppliers"
                      type="text"
                      value={supplierV.value}
                      id={supplierV.id}
                      onChange={handleSupplierInput}
                      name="supplierName"
                      required
                    />
                    <datalist id="suppliers">{Suppliers}</datalist>
                  </div>

                  <div className={styles2.viewCol}>
                    <h4>Payment Mode</h4>
                    <input
                      list="PaymentMode"
                      type="text"
                      value={PMV.value}
                      id={PMV.id}
                      onChange={handlePMInput}
                      name="PaymentMode"
                      required
                    />
                    <datalist id="PaymentMode">{PaymentModes}</datalist>
                  </div>
                </div>
              </div>

              <div className={styles2.viewRow}>
                <div className="pt-4">
                  <div className={styles2.viewCol}>
                    <h4>Location</h4>
                    <div>
                      {LocationsList.map((item, index) => {
                        if (LocationsList.length == 1) {
                          return (
                            <div key={index} className={styles2.locationInputs}>
                              <input
                                list="Branch"
                                type="text"
                                value={item.location}
                                onChange={(e) => handleLocationChange(index, e)}
                                id={item.id}
                                name="branchLocation"
                                required
                              />
                              <datalist id="Branch">{Locations}</datalist>
                            </div>
                          );
                        } else if (LocationsList.length > 1) {
                          return (
                            <div key={index} className={styles2.locationInputs}>
                              <input
                                list="Branch"
                                type="text"
                                value={item.location}
                                onChange={(e) => handleLocationChange(index, e)}
                                id={item.id}
                                name="branchLocation"
                                required
                              />
                              <datalist id="Branch">{Locations}</datalist>

                              <button
                                type="button"
                                onClick={() => {
                                  removeLocInput(index);
                                }}
                                className={styles2.removeLocationButton}
                              >
                                <Image
                                  src={xIcon}
                                  width={25}
                                  height={25}
                                  alt="Cancel"
                                />
                              </button>
                            </div>
                          );
                        }
                      })}
                    </div>

                    <div>
                      <h5 className={styles2.addLocationText}>
                        <button
                          type="button"
                          onClick={addLocInput}
                          className={styles2.addLocationButton}
                        >
                          <Image
                            src={addLocIcon}
                            alt="Add Location"
                            width={20}
                            height={20}
                            className={styles2.addLocIcon}
                          />
                        </button>
                        Add Location
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles2.productDetails}>
              <div className={styles2.pDTop}>
                <div className="py-1 mt-5">
                  <h4>Product Details</h4>
                </div>

                <div className="pe-5">
                  <hr />
                </div>

                <ul className="list-group list-group-horizontal text-center">
                  <li className="list-group-item col-sm-1 border-0">
                    Item No.
                  </li>
                  <li className="list-group-item col-sm-4 px-5 border-0 text-start">
                    Item
                  </li>
                  <li className="list-group-item col-sm-2 border-0">
                    Quantity
                  </li>
                  <li className="list-group-item col-sm-2 border-0">
                    Unit Price
                  </li>
                  <li className="list-group-item col-sm-2 border-0">
                    Total Unit Price
                  </li>
                </ul>

                <div className="pe-5">
                  <hr />
                </div>
              </div>

              <div>
                <div className={styles2.productLines}>
                  <div className={styles2.plRow}>
                    {ItemLineList.map((item, index) => {
                      if (index === ItemLineList.length - 1) {
                        return (
                          <div key={index} className={styles2.plItemRow}>
                            <div className="col-sm-1 text-center">
                              <input
                                type="number"
                                name="ItemNo"
                                id="ItemNo"
                                defaultValue={index + 1}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plItemNo}
                                disabled
                              />
                            </div>
                            <div className="col-sm-4 px-5 text-start">
                              <input
                                list="items"
                                type="text"
                                name="ItemName"
                                id={item.id}
                                data-unitprice={item.UnitPrice}
                                value={item.ItemName}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plItemName}
                                required
                              />
                              <datalist id="items">{Items}</datalist>
                            </div>
                            <div className="col-sm-2 text-center">
                              <input
                                type="number"
                                min={1}
                                name="ItemQty"
                                id="ItemQty"
                                value={item.ItemQty}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plQty}
                                required
                              />
                            </div>
                            <div className="col-sm-2 text-center">
                              <input
                                type="number"
                                min={0}
                                name="UnitPrice"
                                id="UnitPrice"
                                value={item.UnitPrice}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plUnitPrice}
                                disabled
                              />
                            </div>
                            <div className="col-sm-2 text-center">
                              <input
                                type="number"
                                min={0}
                                name="TotalUnitPrice"
                                id="TotalUnitPrice"
                                value={item.TotalUnitPrice}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plTotalUP}
                                disabled
                              />
                            </div>
                            <div className="col-sm-1">
                              <button
                                type="button"
                                onClick={addItemLine}
                                className={styles2.createButton}
                              >
                                <Image
                                  src={addIcon}
                                  alt="Plus Icon"
                                  width={25}
                                  height={25}
                                  className={styles2.addIcon}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      } else if (index < ItemLineList.length - 1) {
                        return (
                          <div key={index} className={styles2.plItemRow}>
                            <div className="col-sm-1 text-center">
                              <input
                                type="number"
                                name="ItemNo"
                                id="ItemNo"
                                defaultValue={index + 1}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plItemNo}
                                disabled
                              />
                            </div>
                            <div className="col-sm-4 px-5 text-start">
                              <input
                                list="items"
                                type="text"
                                name="ItemName"
                                id={item.id}
                                value={item.ItemName}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plItemName}
                                required
                              />
                              <datalist id="items">{Items}</datalist>
                            </div>
                            <div className="col-sm-2 text-center">
                              <input
                                type="number"
                                name="ItemQty"
                                id="ItemQty"
                                value={item.ItemQty}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plQty}
                                required
                              />
                            </div>
                            <div className="col-sm-2 text-center">
                              <input
                                type="number"
                                name="UnitPrice"
                                id="UnitPrice"
                                value={item.UnitPrice}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plUnitPrice}
                                disabled
                              />
                            </div>
                            <div className="col-sm-2 text-center">
                              <input
                                type="number"
                                name="TotalUnitPrice"
                                id="TotalUnitPrice"
                                value={item.TotalUnitPrice}
                                onChange={(e) => handleItemChange(index, e)}
                                className={styles2.plTotalUP}
                                disabled
                              />
                            </div>
                            <div className="col-sm-1">
                              <button
                                type="button"
                                onClick={() => {
                                  removeItemLine(index);
                                }}
                                className={styles2.createButton}
                              >
                                <Image
                                  src={addIcon}
                                  alt="Plus Icon"
                                  width={25}
                                  height={25}
                                  className={styles2.cancelIcon}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 mx-3 py-5">
              <div className={styles2.remarksTestArea}>
                <h4>Remarks</h4>
                <textarea
                  value={Remark}
                  onChange={(e) => setRemarkR(e.target.value)}
                  className={styles2.textArea}
                ></textarea>
              </div>
            </div>

            <div className="d-flex mx-5">
              {/* <div className="col-sm"></div> */}
              <div className="col-sm-9">
                {/* <div className={styles2.submit}>
                                        <button type="button" onClick={handleRefresh} className={styles2.resetReappealButton}>
                                            <div className="px-5">
                                                Reset Reappeal Form
                                            </div>
                                        </button>
                                    </div> */}
              </div>
              <div className="col-sm py-5">
                <div className={styles2.reappeal}>
                  <button type="submit" className={styles2.reappealButton}>
                    <div className="px-5">Reappeal PR</div>
                  </button>
                </div>
              </div>
              {/* <div className="col-sm"></div> */}
            </div>
          </form>

          <div className="px-5">
            <hr className={styles.endLine} />
          </div>

          <div>
            {checkApprComment && (
              <div className="px-5 mx-5 pb-5 pt-2">
                <div>
                  {isRejected && (
                    <h2>
                      Purchase Request #{prID} has been{" "}
                      <b className={styles.rejectedB}>Rejected</b>!
                    </h2>
                  )}
                  {isApproved && (
                    <h2>
                      Purchase Request #{prID} has been{" "}
                      <b className={styles.approvedB}>Approved</b>!
                    </h2>
                  )}
                  <div className="pt-5">
                    <h4>Approver's Comments</h4>
                    <div className="py-3 w-70">
                      <div className={styles.apprCommentsBox}>
                        <div className="p-4">
                          <textarea
                            value={viewApprComment}
                            onChange={(e) => setViewApprComment(e.target.value)}
                            className={styles.apprCommentTextArea}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isRejected && (
                      <div>
                        <div className="px-5 py-3 mx-5 mb-5">
                          <div className={styles.reappealPR}>
                            <button
                              onClick={handleBackReappeal}
                              className={styles.reappealPRButton}
                            >
                              <div className="px-5">Back</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
