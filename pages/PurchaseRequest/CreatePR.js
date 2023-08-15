import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// styles
import styles from "../../styles/createPR.module.css";

// components
import AlertBox from "../../components/alert";

// Image
import arrowIcon from "../../public/arrowIcon.svg";
import addLocIcon from "../../public/addLocationIcon.svg";
import addIcon from "../../public/plusIcon.svg";
import xIcon from "../../public/xIcon.svg";

import axios from "axios";

// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname == 'localhost') {
          URL.push('http://localhost:3000', 'http://localhost:5000');
      }
      else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
          URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
      };
      return URL;
  };
};

isLocalhost();

const baseUrl = URL[0];

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
  const previousURL = context.req.headers.referer;

  const backBaseURL = [];

  if (host == "localhost:5000") {
    backBaseURL.push("http://localhost:5000");
  } else {
    backBaseURL.push("https://abc-cooking-studio.azurewebsites.net");
  };

  const resObj = {};

  // check if previous URL was from homepage
  if (previousURL === `${backBaseURL}/Home`) {
    resObj.fromHome = true;
  } else {
    resObj.fromHome = false;
  };

  return {
    props: {
      from: resObj,
    },
  };
};

export default function CreatePR({ from }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [id, setUserID] = useState();
  const [Token, setToken] = useState();

  const [showAdHoc, setAdHoc] = useState(false);

  // dropdown lists states
  const [Suppliers, supplierList] = useState();
  const [Locations, locationList] = useState();
  const [PaymentModes, pmList] = useState();
  const [Items, itemList] = useState();

  // Adhoc dropdown
  const [Branch, setBranchList] = useState();
  const [AHLocation, setAHLocation] = useState();

  // Alert Box
  const [CreatedPRAlert, setCreatedPRAlert] = useState(false);
  const [CreatedAdhocAlert, setCreatedAdhocAlert] = useState(false);

  //final price for moq
  const [finalPrice, setFinalPrice] = useState(0);

  // get drop down list
  useEffect(() => {
    // set user id
    const userID = parseInt(localStorage.getItem("ID"), 10);
    setUserID(userID);

    // set user token
    const token = localStorage.getItem("token");
    setToken(token);

    // if show adhoc(from home page)
    if (from.fromHome === true) {
      setAdHoc(true);
    };

    axios.all([
      axios.get(`${baseUrl}/api/supplier/all`),
      axios.get(`${baseUrl}/api/purchaseReq/branch/all`),
      axios.get(`${baseUrl}/api/purchaseReq/paymentMode/all`),
      axios.get(`${baseUrl}/api/inventory/item/all`),
    ])
      .then(
        axios.spread((response1, response2, response3, response4) => {
          // get suppliers
          const supplierResult = response1.data;
          const SList = [];

          supplierResult.forEach((item, index) => {
            SList.push(
              <div key={index}>
                <DropdownOpt ID={item.supplierID} Value={item.supplierName} />
              </div>
            );
          });
          supplierList(SList);

          // get Locations
          const locationResult = response2.data;
          const LList = [];
          const LList2 = [];

          // setBranchList(locationResult);
          setAHLocation(locationResult[0].branchID);

          locationResult.forEach((item, index) => {
            LList.push(
              <div key={index}>
                <DropdownOpt ID={item.branchID} Value={item.branchName} />
              </div>
            );
          });

          locationResult.forEach((item, index) => {
            LList2.push(
              <option key={index} value={item.branchID}>{item.branchName}</option>
            );
          });

          locationList(LList);
          setBranchList(LList2);

          // get payment modes
          const PMResult = response3.data;
          const PMList = [];

          PMResult.forEach((item, index) => {
            PMList.push(
              <div key={index}>
                <DropdownOpt ID={item.paymentModeID} Value={item.paymentMode} />
              </div>
            );
          });
          pmList(PMList);

          // get items
          const ItemResult = response4.data;
          const IList = [];

          ItemResult.forEach((item, index) => {
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
        })
      )
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // add location input box
  const [LocationsList, setLocations] = useState([{ location: "", id: "" }]);
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
  const [ItemLineList, SetItemLineList] = useState([
    {
      id: "",
      ItemNo: "",
      ItemName: "",
      ItemQty: "",
      UnitPrice: "",
      TotalUnitPrice: "",
    },
  ]);
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
      };
    } else {
      const [itemName, id, unitPrice] = getSelectedOption(e);
      data[index].ItemName = itemName;
      data[index].id = id;
      data[index].UnitPrice = unitPrice;
    };

    // Calculate total unit price
    if (data[index].ItemQty !== "" && data[index].ItemName !== "") {
      let totalPrice = (data[index].ItemQty * data[index].UnitPrice).toFixed(2);
      data[index].TotalUnitPrice = totalPrice;
    };

    SetItemLineList(data);
  };

  // input states
  const [dateReqV, setDateReq] = useState("");
  const [supplierV, setSupplier] = useState({ value: "", id: "" });
  const [PMV, setPM] = useState({ value: "", id: "" });
  const [Remark, setRemark] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSupplierInput = (e) => {
    const [value, id] = getSelectedOption(e);
    setSupplier({ value: value, id: id });
  };

  const handlePMInput = (e) => {
    const [value, id] = getSelectedOption(e);
    setPM({ value: value, id: id });
  };

  const adHocForm = async (e) => {
    setAdHoc(e.target.checked);
  };

  // axios to create PR
  const createPR = async (e) => {
    e.preventDefault();

    console.log("supplier id: ", supplierV.id);

    let totalPrice = 0;
    ItemLineList.forEach((item) => {
      totalPrice += parseFloat(item.TotalUnitPrice || 0);
    });

    setFinalPrice(totalPrice);

    try {
      const response = await axios.get(`${baseUrl}/api/supplier/supplierPurchaseInfo/${supplierV.id}`, {
        headers: {
          authorization: 'Bearer ' + Token
        }
      });
      const supplierInfo = response.data[0];
      const supplierMOQ = parseFloat(supplierInfo.MOQ);

      if (supplierMOQ === null || totalPrice >= supplierMOQ) {

        await axios.post(`${baseUrl}/api/purchaseReq/`,
          {
            purchaseTypeID: 1,
            targetDeliveryDate: dateReqV,
            userID: id,
            supplierID: supplierV.id,
            paymentModeID: PMV.id,
            remarks: Remark,
          },
          {
            headers: {
              authorization: 'Bearer ' + Token
            }
          }
        )
          .then((response) => {
            axios.get(`${baseUrl}/api/purchaseReq/latestPRID/${id}`,
              {
                headers: {
                  user: id,
                  authorization: 'Bearer ' + Token
                }
              }
            )
              .then((response) => {
                const latestPRID = response.data[0].prID;

                LocationsList.forEach((item, index) => {
                  axios.post(`${baseUrl}/api/purchaseReq/deliveryLocation`,
                    {
                      prID: latestPRID,
                      branchID: item.id,
                    },
                    {
                      headers: {
                        authorization: 'Bearer ' + Token
                      }
                    }
                  );
                });

                ItemLineList.forEach((item, index) => {
                  axios.post(`${baseUrl}/api/purchaseReq/lineItem`,
                    {
                      prID: latestPRID,
                      itemID: item.id,
                      quantity: item.ItemQty,
                      totalUnitPrice: item.TotalUnitPrice,
                    },
                    {
                      headers: {
                        authorization: 'Bearer ' + Token
                      }
                    }
                  );
                });
              });

            setCreatedPRAlert(true);
            // timer to reset to false
            alertTimer();

            // set timer before redirect
            setTimeout(() => { router.push("/PurchaseRequest") }, 3000);
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

      } else {
        const remainingAmount = (supplierMOQ - totalPrice).toFixed(2);
        setErrorMsg(`${supplierV.value} has a minimum order quanity of $${supplierMOQ},\n please add $${remainingAmount} more to purchase from ${supplierV.value}`)
      }

    } catch (err) {
      if (err.response.status === 401 || err.response.status === 403) {
        localStorage.clear();
        signOut({ callbackUrl: '/Unauthorised' });
      }
      else {
        console.log(err);
      };
    };
  };

  // axios to create Ad Hoc
  const createAdHoc = async (e) => {
    e.preventDefault();

    await axios
      .post(`${baseUrl}/api/purchaseReq/`,
        {
          purchaseTypeID: 2,
          userID: id,
          remarks: Remark,
        },
        {
          headers: {
            authorization: 'Bearer ' + Token
          }
        }
      )
      .then((response) => {
        // get latest PR ID by userid
        axios.get(`${baseUrl}/api/purchaseReq/latestPRID/${id}`,
          {
            headers: {
              user: id,
              authorization: 'Bearer ' + Token
            }
          }
        )
          .then((response) => {
            // console.log(response);
            const latestPRID = response.data[0].prID;

            axios.all([
              axios.post(`${baseUrl}/api/purchaseReq/deliveryLocation`,
                {
                  prID: latestPRID,
                  branchID: AHLocation,
                },
                {
                  headers: {
                    authorization: 'Bearer ' + Token
                  }
                }
              ),
              axios.post(`${baseUrl}/api/trackOrder/purchaseOrder`,
                {
                  prID: latestPRID
                },
                {
                  headers: {
                    authorization: 'Bearer ' + Token
                  }
                }
              )
            ]);
          });

        setCreatedAdhocAlert(true);
        // timer to reset to false
        alertTimer();

        // set timer before redirect
        setTimeout(() => { router.push("/PurchaseRequest") }, 3000);
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

  // alert box timer
  function alertTimer() {
    // changes all alert useStates to false after 3s
    setTimeout(alertFunc, 3000);
  };

  function alertFunc() {
    // list of alerts useStates in your page
    setCreatedPRAlert(false);
    setCreatedAdhocAlert(false);
  };

  return (
    <>
      <div className="headerRow">
        {showAdHoc === false && (
          <h1>
            <a href={"/PurchaseRequest"}>
              <Image src={arrowIcon} id={styles.arrow} alt="Back" />
            </a>
            Create Purchase Request
          </h1>
        )}

        {showAdHoc === true && (
          <h1>
            <a href={"/PurchaseRequest"}>
              <Image src={arrowIcon} id={styles.arrow} alt="Back" />
            </a>
            Create Ad-Hoc Purchase
          </h1>
        )}
      </div>

      <div className="px-5 pt-2 pb-4">
        <div className={styles.toggle}>
          <div className="px-3 pt-1">
            <h5>Ad-Hoc</h5>
          </div>

          <label className={styles.switch}>
            <input
              type="checkbox"
              onChange={(e) => {
                adHocForm(e);
              }}
              checked={showAdHoc}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className="w-100 px-5">
        <hr />
      </div>

      {showAdHoc === false && (
        <form onSubmit={createPR}>
          <div className={styles.prDetails}>
            <div className={styles.viewCol}>
              <h4>Target Delivery Date</h4>
              <input
                type="date"
                value={dateReqV}
                onChange={(e) => setDateReq(e.target.value)}
                name="dateReq"
                required
              />
            </div>

            <div className={styles.viewRow}>
              <div className="pt-4">
                <div className={styles.viewCol}>
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

                <div className={styles.viewCol}>
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

            <div className={styles.viewRow}>
              <div className="pt-4">
                <div className={styles.viewCol}>
                  <h4>Location</h4>
                  <div>
                    {LocationsList.map((item, index) => {
                      if (LocationsList.length == 1) {
                        return (
                          <div key={index} className={styles.locationInputs}>
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
                          <div key={index} className={styles.locationInputs}>
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
                              className={styles.removeLocationButton}
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
                    <h5 className={styles.addLocationText}>
                      <button
                        type="button"
                        onClick={addLocInput}
                        className={styles.addLocationButton}
                      >
                        <Image
                          src={addLocIcon}
                          alt="Add Location"
                          width={20}
                          height={20}
                          className={styles.addLocIcon}
                        />
                      </button>
                      Add Location
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.productDetails}>
            <div className={styles.pDTop}>
              <div className="py-1 mt-5">
                <h4>Product Details</h4>
              </div>

              <div className="pe-5">
                <hr />
              </div>

              <ul className="list-group list-group-horizontal text-center">
                <li className="list-group-item col-sm-1 border-0">Item No.</li>
                <li className="list-group-item col-sm-4 px-5 border-0 text-start">
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

              <div className="pe-5">
                <hr />
              </div>
            </div>

            <div>
              <div className={styles.productLines}>
                <div className={styles.plRow}>
                  {ItemLineList.map((item, index) => {
                    if (index === ItemLineList.length - 1) {
                      return (
                        <div key={index} className={styles.plItemRow}>
                          <div className="col-sm-1 text-center">
                            <input
                              type="number"
                              name="ItemNo"
                              id="ItemNo"
                              defaultValue={index + 1}
                              onChange={(e) => handleItemChange(index, e)}
                              className={styles.plItemNo}
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
                              className={styles.plItemName}
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
                              className={styles.plQty}
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
                              className={styles.plUnitPrice}
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
                              className={styles.plTotalUP}
                              disabled
                            />
                          </div>
                          <div className="col-sm-1">
                            <button
                              type="button"
                              onClick={addItemLine}
                              className={styles.createButton}
                            >
                              <Image
                                src={addIcon}
                                alt="Plus Icon"
                                width={25}
                                height={25}
                                className={styles.addIcon}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    } else if (index < ItemLineList.length - 1) {
                      return (
                        <div key={index} className={styles.plItemRow}>
                          <div className="col-sm-1 text-center">
                            <input
                              type="number"
                              name="ItemNo"
                              id="ItemNo"
                              defaultValue={index + 1}
                              onChange={(e) => handleItemChange(index, e)}
                              className={styles.plItemNo}
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
                              className={styles.plItemName}
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
                              className={styles.plQty}
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
                              className={styles.plUnitPrice}
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
                              className={styles.plTotalUP}
                              disabled
                            />
                          </div>
                          <div className="col-sm-1">
                            <button
                              type="button"
                              onClick={() => {
                                removeItemLine(index);
                              }}
                              className={styles.createButton}
                            >
                              <Image
                                src={addIcon}
                                alt="Plus Icon"
                                width={25}
                                height={25}
                                className={styles.cancelIcon}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {errorMsg && <p className="mt-3" style={{ color: 'red' }}>{errorMsg}</p>}

            </div>
          </div>

          <div className="px-5 mx-3 pt-5">
            <div className={styles.remarksTestArea}>
              <h4>Remarks</h4>
              <textarea
                value={Remark}
                onChange={(e) => setRemark(e.target.value)}
                className={styles.textArea}
              ></textarea>
            </div>
          </div>

          <div className="px-5 mx-3 pt-5">
            <div className={styles.submit}>
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      {showAdHoc === true && (
        <form onSubmit={createAdHoc}>
          <div className="px-5 pt-2">
            <div>
              <h4>Location</h4>
              <select onChange={e => setAHLocation(e.target.value)} style={{ width: '25%', height: '40px', borderRadius: '10px', borderColor: '#93A2B7', borderStyle: 'solid', borderWidth: '2px' }}>
                {Branch}
              </select>
            </div>
          </div>

          <div className="px-5 pt-4 pb-2">
            <div>
              <h4>Description</h4>
              <textarea
                value={Remark}
                onChange={(e) => setRemark(e.target.value)}
                className={styles.textArea}
              ></textarea>
            </div>
          </div>

          <div className={styles.viewRow}>
            <div className="pt-4 px-5">
              <div className={styles.submit}>
                <button type="submit" className={styles.submitButton}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {
        CreatedPRAlert &&
        <AlertBox
          Show={CreatedPRAlert}
          Message={`Purchase Request Created!`}
          Type={'success'}
          Redirect={`/PurchaseRequest`} />
      }

      {
        CreatedAdhocAlert &&
        <AlertBox
          Show={CreatedAdhocAlert}
          Message={`Ad-Hoc Purchase Created!`}
          Type={'success'}
          Redirect={`/PurchaseRequest`} />
      }
    </>
  );
}
