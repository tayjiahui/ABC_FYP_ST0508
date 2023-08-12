import React from "react";
import axios from "axios";
import moment from 'moment-timezone';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";

// Component
import WIP from "../../components/WIP";

// Style Sheet
import styles from "../../styles/purchaseReq.module.css";

// Images
import searchIcon from "../../public/searchIcon.svg";
import filterIcon from "../../public/filterIcon.svg";
import plusIcon from "../../public/plusIcon.svg";
import pendingCircle from "../../public/yellowPendingCircle.svg";
import approvedCircle from "../../public/greenApprovedCircle.svg";
import rejectedCircle from "../../public/redRejectedCircle.svg";
import xIcon from "../../public/xIcon.svg";
import eyeCon from "../../public/eyeCon.svg";
import closeEyeCon from "../../public/closeEyeCon.svg";

// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    console.log("hostname   " + hostname);
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
const baseURL = URL[1];

// result sorting system
function dynamicSort(property) {
  return function (a, b) {
    return (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
  };
};

// check for row status for status indicator
function circleTest(statusID) {
  if (statusID == 1) {
    return "/yellowPendingCircle.svg";
  } else if (statusID == 2 || statusID == 4) {
    return "/greenApprovedCircle.svg";
  } else if (statusID == 3) {
    return "/redRejectedCircle.svg";
  } else {
    return "/yellowPendingCircle.svg";
  };
};

// Status icon for each PR row
function Icon(props) {
  return (
    <Image
      src={baseURL + props.item}
      width={25}
      height={25}
      id={styles.statusCircle}
      alt="status indicator"
    />
  );
};

// Each PR Row
function PRRow(props) {
  const statusID = props.StatusID;

  const [ROLE, setROLE] = useState(props.RoleID);

  const [isAdHoc, setIsAdHoc] = useState(false);

  const [showPL, setShowPL] = useState(false);

  const [plRows, setPLRows] = useState([]);

  const circle = circleTest(statusID);

  useEffect(() => {
    if (props.RoleID === 3) {
      setROLE(1);
    };

    if (props.PTypeID === 2) {
      setIsAdHoc(true);
    };
  }, []);

  const viewProductLines = async (e) => {
    e.preventDefault();

    if (props.PTypeID === 2) {
      setShowPL(true);
    } else {
      await axios
        .get(`${baseUrl}/api/purchaseReq/lineItem/${props.prID}`)
        .then((response) => {
          const plResult = response.data;
          setPLRows(plResult);
          setShowPL(true);
        })
        .catch((err) => {
          console.log(err);
        });
    };
  };

  const closeViewProductLines = async (e) => {
    e.preventDefault();
    setShowPL(false);
  };

  return (
    <div className="pt-1">
      {/* PURCHASER */}
      {ROLE === 2 &&
        <div>
          {
            isAdHoc === false &&
            <a href={baseURL + "/PurchaseRequest/" + props.prID}>
              <button className={styles.prButton}>
                <div className={styles.prRow}>
                  <div className="pt-2 row">
                    <div className={styles.prTextRow}>
                      <div className="px-4 ms-3 col-sm-1">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                      </div>

                      <div className="mx-2 col-sm-1">
                        <p>{props.PType}</p>
                      </div>

                      <div className="mx-3 col-sm-1">
                        <p>{props.ReqDate}</p>
                      </div>

                      <div className="mx-3 col-sm-2">
                        <p>{props.Location}</p>
                      </div>

                      <div className="px-3 col-sm-2">
                        <p>{props.Supplier}</p>
                      </div>

                      <div className="col-sm-1">
                        <p>{props.TargetDate}</p>
                      </div>

                      <div className="px-5 col-sm-2">
                        <div className="row">
                          <div className="col-sm-1">
                            <p className={styles.prTextStatus}>{props.Status}</p>
                          </div>
                          <div className="ps-5 ms-4 col-sm-2">
                            <Icon item={circle} />
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-1 px-0">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={eyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={closeEyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {
                    isAdHoc === false && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Product Lines</u>
                        </h5>

                        <div className="py-3">
                          <div className="ps-4">
                            <ul className="list-group list-group-horizontal text-center">
                              <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                Item No.
                              </li>
                              <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                Item Name
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Quantity
                              </li>
                              <li className="list-group-item col-sm-1 border-0 bg-transparent"></li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Unit Price
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Total Unit Price
                              </li>
                            </ul>
                          </div>

                          {plRows.map((item, index) => {
                            return (
                              <div key={index}>
                                <div className="ps-4">
                                  <ul className="list-group list-group-horizontal">
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      {index + 1}
                                    </li>
                                    <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                      {item.itemName}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      {item.quantity}
                                    </li>
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      X
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.unitPrice}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.totalUnitPrice}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  }

                  {
                    isAdHoc === true && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Description</u>
                        </h5>

                        <div className="py-2 ps-5 text-start">
                          <p>{props.Description}</p>
                        </div>
                      </div>
                    )
                  }


                </div>
              </button>
            </a>
          }

          {
            isAdHoc === true &&
            <a href={baseURL + "/PurchaseRequest/AdHoc/" + props.prID}>
              <button className={styles.prButton}>
                <div className={styles.ahRow}>
                  <div className="pt-2 row">
                    <div className={styles.prTextRow}>
                      <div className="px-4 ms-3 col-sm-1">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                      </div>

                      <div className="mx-2 col-sm-1">
                        <p>{props.PType}</p>
                      </div>

                      <div className="mx-3 col-sm-1">
                        <p>{props.ReqDate}</p>
                      </div>

                      <div className="mx-3 col-sm-2">
                        <p>{props.Location}</p>
                      </div>

                      <div className="px-3 col-sm-2">
                        <p>{props.Supplier}</p>
                      </div>

                      <div className="col-sm-1">
                        <p>{props.TargetDate}</p>
                      </div>

                      <div className="px-5 col-sm-2">
                        <div className="row">
                          <div className="col-sm-1">
                            <p className={styles.prTextStatus}>{props.Status}</p>
                          </div>
                          <div className="ps-5 ms-4 col-sm-2">
                            <Icon item={circle} />
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-1 px-0">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={eyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={closeEyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {
                    isAdHoc === false && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Product Lines</u>
                        </h5>

                        <div className="py-3">
                          <div className="ps-4">
                            <ul className="list-group list-group-horizontal text-center">
                              <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                Item No.
                              </li>
                              <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                Item Name
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Quantity
                              </li>
                              <li className="list-group-item col-sm-1 border-0 bg-transparent"></li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Unit Price
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Total Unit Price
                              </li>
                            </ul>
                          </div>

                          {plRows.map((item, index) => {
                            return (
                              <div key={index}>
                                <div className="ps-4">
                                  <ul className="list-group list-group-horizontal">
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      {index + 1}
                                    </li>
                                    <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                      {item.itemName}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      {item.quantity}
                                    </li>
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      X
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.unitPrice}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.totalUnitPrice}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  }

                  {
                    isAdHoc === true && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Description</u>
                        </h5>

                        <div className="py-2 ps-5 text-start">
                          <p>{props.Description}</p>
                        </div>
                      </div>
                    )
                  }

                </div>
              </button>
            </a>
          }
        </div>
      }

      {/* APPROVERS */}
      {ROLE === 1 &&
        <div>
          {
            isAdHoc === false &&
            <a href={baseURL + "/PurchaseRequest/" + props.prID}>
              <button className={styles.prButton}>
                <div className={styles.prRow}>
                  <div className="pt-2 row">
                    <div className={styles.prTextRow}>
                      <div className="px-4 mx-2 col-sm-1">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                      </div>

                      <div className="col-sm-1">
                        <p>{props.PType}</p>
                      </div>

                      <div className="col-sm-1">
                        <p>{props.ReqDate}</p>
                      </div>

                      <div className="px-1 ms-4 col-sm-1">
                        <p>{props.Name}</p>
                      </div>

                      <div className="px-3 col-sm-2">
                        <p>{props.Location}</p>
                      </div>

                      <div className="col-sm-1 px-3">
                        <p>{props.Supplier}</p>
                      </div>

                      <div className="px-0 mx-4 col-sm-1 text-center">
                        <p>{props.TargetDate}</p>
                      </div>

                      <div className="px-5 col-sm-2">
                        <div className="row">
                          <div className="col-sm-1">
                            <p className={styles.prTextStatus}>{props.Status}</p>
                          </div>
                          <div className="ps-5 ms-4 col-sm-2">
                            <Icon item={circle} />
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-1">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={eyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={closeEyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {
                    isAdHoc === false && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Product Lines</u>
                        </h5>

                        <div className="py-3">
                          <div className="ps-4">
                            <ul className="list-group list-group-horizontal text-center">
                              <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                Item No.
                              </li>
                              <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                Item Name
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Quantity
                              </li>
                              <li className="list-group-item col-sm-1 border-0 bg-transparent"></li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Unit Price
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Total Unit Price
                              </li>
                            </ul>
                          </div>

                          {plRows.map((item, index) => {
                            return (
                              <div key={index}>
                                <div className="ps-4">
                                  <ul className="list-group list-group-horizontal">
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      {index + 1}
                                    </li>
                                    <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                      {item.itemName}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      {item.quantity}
                                    </li>
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      X
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.unitPrice}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.totalUnitPrice}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  }

                  {
                    isAdHoc === true && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Description</u>
                        </h5>

                        <div className="py-2 ps-5 text-start">
                          <p>{props.Description}</p>
                        </div>
                      </div>
                    )
                  }
                </div>
              </button>
            </a>
          }

          {
            isAdHoc === true &&
            <a href={baseURL + "/PurchaseRequest/AdHoc/" + props.prID}>
              <button className={styles.prButton}>
                <div className={styles.ahRow}>
                  <div className="pt-2 row">
                    <div className={styles.prTextRow}>
                      <div className="px-4 mx-2 col-sm-1">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <p>#{props.prID}</p>
                          </button>
                        )}
                      </div>

                      <div className="col-sm-1">
                        <p>{props.PType}</p>
                      </div>

                      <div className="col-sm-1">
                        <p>{props.ReqDate}</p>
                      </div>

                      <div className="px-1 ms-4 col-sm-1">
                        <p>{props.Name}</p>
                      </div>

                      <div className="px-3 col-sm-2">
                        <p>{props.Location}</p>
                      </div>

                      <div className="col-sm-1 px-3">
                        <p>{props.Supplier}</p>
                      </div>

                      <div className="px-0 mx-4 col-sm-1 text-center">
                        <p>{props.TargetDate}</p>
                      </div>

                      <div className="px-5 col-sm-2">
                        <div className="row">
                          <div className="col-sm-1">
                            <p className={styles.prTextStatus}>{props.Status}</p>
                          </div>
                          <div className="ps-5 ms-4 col-sm-2">
                            <Icon item={circle} />
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-1">
                        {showPL === false && (
                          <button
                            onClick={viewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={eyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                        {showPL === true && (
                          <button
                            onClick={closeViewProductLines}
                            type="button"
                            className={styles.viewIconButton}
                          >
                            <Image
                              src={closeEyeCon}
                              width={30}
                              height={30}
                              alt="Eye Icon"
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {
                    isAdHoc === false && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Product Lines</u>
                        </h5>

                        <div className="py-3">
                          <div className="ps-4">
                            <ul className="list-group list-group-horizontal text-center">
                              <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                Item No.
                              </li>
                              <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                Item Name
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Quantity
                              </li>
                              <li className="list-group-item col-sm-1 border-0 bg-transparent"></li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Unit Price
                              </li>
                              <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                Total Unit Price
                              </li>
                            </ul>
                          </div>

                          {plRows.map((item, index) => {
                            return (
                              <div key={index}>
                                <div className="ps-4">
                                  <ul className="list-group list-group-horizontal">
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      {index + 1}
                                    </li>
                                    <li className="list-group-item col-sm-3 border-0 bg-transparent text-start">
                                      {item.itemName}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      {item.quantity}
                                    </li>
                                    <li className="list-group-item col-sm-1 border-0 bg-transparent">
                                      X
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.unitPrice}
                                    </li>
                                    <li className="list-group-item col-sm-2 border-0 bg-transparent">
                                      ${item.totalUnitPrice}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  }

                  {
                    isAdHoc === true && showPL && (
                      <div className={styles.plRow}>
                        <h5 className="ps-5 pt-3 text-start">
                          <u>Description</u>
                        </h5>

                        <div className="py-2 ps-5 text-start">
                          <p>{props.Description}</p>
                        </div>
                      </div>
                    )
                  }
                </div>
              </button>
            </a>
          }
        </div>
      }
    </div>
  );
};

// Each Ad Hoc Row
function AdHocRow(props) {
  const statusID = props.StatusID;

  const [showDescript, setShowDescript] = useState(false);

  // in progress modal
  const [showInProg, setInProg] = useState(false);

  const circle = circleTest(statusID);

  const viewDescription = async (e) => {
    e.preventDefault();
    setShowDescript(true);
  };

  const closeViewDescription = async (e) => {
    e.preventDefault();
    setShowDescript(false);
  };

  // open WIP Modal & Set timer to close
  const WipModalOpen = async (e) => {
    e.preventDefault();
    setInProg(true);
    timeFunc();
  };

  // timer
  function timeFunc() {
    // 2 seconds
    setTimeout(closeWIPModal, 2000);
  };

  // close WIP Modal
  function closeWIPModal() {
    setInProg(false);
  };

  return (
    <div>
      <div className="py-1">
        <a>
          <button className={styles.prButton}>
            {props.RoleID === 2 && (
              <div className={styles.prRow}>
                <div className="pt-2 row text-start">
                  <div className={styles.prTextRow}>
                    <div className="col-sm ps-4">
                      {showDescript === false && (
                        <button
                          onClick={viewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <p>#{props.prID}</p>
                        </button>
                      )}
                      {showDescript === true && (
                        <button
                          onClick={closeViewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <p>#{props.prID}</p>
                        </button>
                      )}
                    </div>

                    <div className="col-sm">
                      <p>{props.ReqDate}</p>
                    </div>

                    <div className="col-sm ps-3">
                      <p>{props.TargetDate}</p>
                    </div>

                    <div className="col-sm">
                      <div className="row">
                        <div className="col-sm-1">
                          <p className={styles.prTextStatus}>{props.Status}</p>
                        </div>
                        <div className="ps-5 ms-4 col-sm-2">
                          <Icon item={circle} />
                        </div>
                      </div>
                    </div>

                    <div className="col-sm">
                      {showDescript === false && (
                        <button
                          onClick={e => { viewDescription(e) }}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <Image
                            src={eyeCon}
                            width={30}
                            height={30}
                            alt="Eye Icon"
                          />
                        </button>
                      )}
                      {showDescript === true && (
                        <button
                          onClick={closeViewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <Image
                            src={closeEyeCon}
                            width={30}
                            height={30}
                            alt="Eye Icon"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {showDescript && (
                  <div className={styles.plRow}>
                    <h5 className="ps-5 pt-3 text-start">
                      <u>Description</u>
                    </h5>

                    <div className="py-2 ps-5 text-start">
                      <p>{props.Description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {props.RoleID === 1 && (
              <div className={styles.prRow}>
                <div className="pt-2 row">
                  <div className={styles.prTextRow}>
                    <div className="col-sm">
                      {showDescript === false && (
                        <button
                          onClick={viewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <p>#{props.prID}</p>
                        </button>
                      )}
                      {showDescript === true && (
                        <button
                          onClick={closeViewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <p>#{props.prID}</p>
                        </button>
                      )}
                    </div>

                    <div className="col-sm">
                      <p>{props.ReqDate}</p>
                    </div>

                    <div className="col-sm">
                      <p>{props.Name}</p>
                    </div>

                    <div className="col-sm">
                      <p>{props.TargetDate}</p>
                    </div>

                    <div className="col-sm">
                      <div className="row">
                        <div className="col-sm-1">
                          <p className={styles.prTextStatus}>{props.Status}</p>
                        </div>
                        <div className="ps-5 ms-4 col-sm-2">
                          <Icon item={circle} />
                        </div>
                      </div>
                    </div>

                    <div className="col-sm">
                      {showDescript === false && (
                        <button
                          onClick={viewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <Image
                            src={eyeCon}
                            width={30}
                            height={30}
                            alt="Eye Icon"
                          />
                        </button>
                      )}
                      {showDescript === true && (
                        <button
                          onClick={closeViewDescription}
                          type="button"
                          className={styles.viewIconButton}
                        >
                          <Image
                            src={closeEyeCon}
                            width={30}
                            height={30}
                            alt="Eye Icon"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {showDescript && (
                  <div className={styles.plRow}>
                    <h5 className="ps-5 pt-3 text-start">
                      <u>Description</u>
                    </h5>

                    <div className="py-2 ps-5 text-start">
                      <p>{props.Description}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </button>
        </a>
      </div>
      {showInProg && <WIP Show={showInProg} />}
    </div>
  );
};

export default function PurchaseRequest() {
  const router = useRouter();

  const [id, setUserID] = useState();
  const [role, setRoleID] = useState();
  const [Token, setToken] = useState();

  const [PRResults, setlist1] = useState([<div>Loading...</div>]);
  const [AdHocResults, setAdHocResults] = useState([<div>Loading...</div>]);

  // store original view by id list
  const [ogPRlist, setOGPRList] = useState();

  const [showAdHoc, setShowAdHoc] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [showFilterPopUp, setShowFilter] = useState(false);

  const [viewAllPR, setViewType] = useState(false);
  const [byName, setByName] = useState(true);
  const [byReqDate, setByReqDate] = useState(true);
  const [byTargetDate, setByTargetDate] = useState(true);
  const [byBranchName, setByBranchName] = useState(true);
  const [bySupplierName, setBySupplierName] = useState(true);
  const [byPaymentMode, setByPaymentMode] = useState(true);
  const [byRemarks, setByRemarks] = useState(true);
  const [byPRStatus, setByPRStatus] = useState(true);

  // show all PR
  useEffect(() => {
    // set user id taken from localstorage
    const userID = parseInt(localStorage.getItem("ID"), 10);
    setUserID(userID);

    // set user role
    const roleID = parseInt(localStorage.getItem("roleID"), 10);
    // filter out approver roles & finance to be under approvers
    if (roleID === 3) {
      setRoleID(1);
    } else {
      setRoleID(roleID);
    };

    // set user token
    const token = localStorage.getItem("token");
    setToken(token);

    // Purchaser View
    if (roleID === 2) {
      axios.all([
        axios.get(`${baseUrl}/api/purchaseReq/${userID}`, {
          headers: {
            user: userID,
            authorization: 'Bearer ' + token
          }
        }),
        axios.get(`${baseUrl}/api/purchaseReq/adhoc/${userID}`, {
          headers: {
            user: userID,
            authorization: 'Bearer ' + token
          }
        }),
      ])
        .then(
          axios.spread((response1, response2) => {
            const prResult = response1.data;
            const adHocResult = response2.data;

            // JOINING RESULT ARRAYS
            const allResults = prResult.concat(adHocResult);
            const sortedResults = allResults.sort((a, b) => b.prID - a.prID);

            const resultsList = [];

            sortedResults.forEach((item, index) => {
              let PTID = item.purchaseTypeID;
              let PT = item.purchaseType;

              // Time stamp formatting
              const reqDate = moment(item.requestDate).format("D MMM YYYY");
              const targetDeliveryDate = moment(item.targetDeliveryDate).format("D MMM YYYY");

              const extraData = {
                Supplier: 'N/A',
                TargetD: 'N/A',
                Descript: 'N/A'
              };

              if (PTID === 1) {
                extraData.Supplier = item.supplierName;
                extraData.TargetD = targetDeliveryDate;
              } else if (PTID === 2) {
                extraData.Descript = item.remarks;
              };

              resultsList.push(
                <div key={index}>
                  <PRRow
                    RoleID={roleID}
                    PTypeID={PTID}
                    PType={PT}
                    prID={item.prID}
                    ReqDate={reqDate}
                    Name={item.name}
                    Location={item.branchName}
                    Supplier={extraData.Supplier}
                    TargetDate={extraData.TargetD}
                    Status={item.prStatus}
                    StatusID={item.prStatusID}
                    Description={extraData.Descript}
                  />
                </div>
              );
            });

            setOGPRList(resultsList);
            setlist1(resultsList);
          })
        )
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
            localStorage.clear();
            signOut({ callbackUrl: '/Unauthorised' });
          }
          else {
            console.log(err);
          };
        });
    }
    // Approver View
    else if (roleID === 1 || roleID === 3) {
      // setting default filter view
      setViewType(true);

      // admin/approver
      axios.all([
        axios.get(`${baseUrl}/api/purchaseReq/PR/AH/all`, {
          headers: {
            authorization: 'Bearer ' + token
          }
        })
      ])
        .then(
          axios.spread((response1) => {
            // sorts data before showing
            const allResult = response1.data.sort(dynamicSort('prID')).sort(dynamicSort('prStatusID'));

            const resultList = [];

            allResult.forEach((item, index) => {
              let PTID = item.purchaseTypeID;
              let PT = item.purchaseType;

              // Time stamp formatting
              const reqDate = moment(item.requestDate).format("D MMM YYYY");
              const targetDeliveryDate = moment(item.targetDeliveryDate).format("D MMM YYYY");

              const extraData = {
                Supplier: 'N/A',
                TargetD: 'N/A',
                Descript: 'N/A'
              };

              if (PTID === 1) {
                extraData.Supplier = item.supplierName;
                extraData.TargetD = targetDeliveryDate;
              } else if (PTID === 2) {
                extraData.Descript = item.remarks;
              };

              resultList.push(
                <div key={index}>
                  <PRRow
                    RoleID={roleID}
                    PTypeID={PTID}
                    PType={PT}
                    prID={item.prID}
                    ReqDate={reqDate}
                    Name={item.name}
                    Location={item.branchName}
                    Supplier={extraData.Supplier}
                    TargetDate={extraData.TargetD}
                    Status={item.prStatus}
                    StatusID={item.prStatusID}
                    Description={extraData.Descript}
                  />
                </div>
              );
            });

            setOGPRList(resultList);
            setlist1(resultList);
          })
        )
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
            localStorage.clear();
            signOut({ callbackUrl: '/Unauthorised' });
          }
          else {
            console.log(err);
          };
        });
    };
  }, []);

  // View ALL Toggle
  const ViewAllToggle = async (e) => {
    const showAllPR = e.target.checked;

    // set view all for filter options
    filterChecker(e);

    if (showAllPR === true) {
      await axios.get(`${baseUrl}/api/purchaseReq/PR/AH/all`, {
        headers: {
          authorization: 'Bearer ' + Token
        }
      })
        .then((response) => {
          const allResult = response.data.sort((a, b) => b.prID - a.prID);
          const resultsList = [];

          allResult.forEach((item, index) => {
            let PTID = item.purchaseTypeID;
            let PT = item.purchaseType;

            console.log(PT)

            // Time stamp formatting
            const reqDate = moment(item.requestDate).format("D MMM YYYY");
            const targetDeliveryDate = moment(item.targetDeliveryDate).format("D MMM YYYY");

            const extraData = {
              Supplier: 'N/A',
              TargetD: 'N/A',
              Descript: 'N/A'
            };

            if (PTID === 1) {
              extraData.Supplier = item.supplierName;
              extraData.TargetD = targetDeliveryDate;
            } else if (PTID === 2) {
              extraData.Descript = item.remarks;
            };

            resultsList.push(
              <div key={index}>
                <PRRow
                  RoleID={role}
                  PTypeID={PTID}
                  PType={PT}
                  prID={item.prID}
                  ReqDate={reqDate}
                  Name={item.name}
                  Location={item.branchName}
                  Supplier={extraData.Supplier}
                  TargetDate={extraData.TargetD}
                  Status={item.prStatus}
                  StatusID={item.prStatusID}
                  Description={extraData.Descript}
                />
              </div>
            );
          });

          setlist1(resultsList);
        })
        .catch((err) => {
          if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
            localStorage.clear();
            signOut({ callbackUrl: '/Unauthorised' });
          }
          else {
            console.log(err);
          };
        });
    }
    else {
      setlist1(ogPRlist);
    };
  };

  // Filter Pop Up Open
  const handleFilterPopUp = () => {
    setShowFilter(true);
  };

  //   Filter Pop Up Close
  const handleFilterPopUpClose = () => {
    setShowFilter(false);
  };

  //   filter checker
  const filterChecker = async (e) => {
    const id = e.target.id;
    const checked = e.target.checked;

    if (id === "username") {
      setByName(checked);
    } else if (id === "date") {
      setByReqDate(checked);
    } else if (id === "targetDate") {
      setByTargetDate(checked);
    } else if (id === "branch") {
      setByBranchName(checked);
    } else if (id === "supplier") {
      setBySupplierName(checked);
    } else if (id === "paymentMode") {
      setByPaymentMode(checked);
    } else if (id === "description") {
      setByRemarks(checked);
    } else if (id === "status") {
      setByPRStatus(checked);
    } else if (id === "viewAll") {
      setViewType(checked);
    };

    // currently beacuse of e gives error because searchValue Changes to "on" => from checkbox e.target.value
    // handlePRSearch(e);
  };

  //   search PR
  const handlePRSearch = async (e) => {
    e.preventDefault();

    // setSearchValue(e.target.value);

    // purchaser
    if (role === 2) {
      if (showAdHoc === false) {
        await axios
          .post(`${baseUrl}/api/purchaseReq/DynamicSearch`,
            {
              searchValue: searchValue,
              ByUserID: !viewAllPR,
              UserID: id,
              PurchaseType: true,
              PTID: 1,
              ByUserName: byName,
              ByReqDate: byReqDate,
              ByTargetDate: byTargetDate,
              ByBranchName: byBranchName,
              BySupplierName: bySupplierName,
              ByPaymentMode: byPaymentMode,
              ByRemarks: false,
              ByPRStatus: byPRStatus,
            },
            {
              headers: {
                authorization: 'Bearer ' + Token
              }
            }
          )
          .then((response) => {
            // console.log(searchValue);
            // console.log(response.data);
            // console.log(response.config.data);

            const searchResult = response.data;

            // Show List of Searched PR results
            const resultsList = [];

            searchResult.forEach((item, index) => {
              // Time stamp formatting
              const reqDate = moment(searchResult[index].requestDate).format(
                "D MMM YYYY"
              );
              const targetDeliveryDate = moment(
                searchResult[index].targetDeliveryDate
              ).format("D MMM YYYY");

              resultsList.push(
                <div key={index}>
                  <PRRow
                    RoleID={role}
                    prID={item.prID}
                    ReqDate={reqDate}
                    Name={item.name}
                    Location={item.branchName}
                    Supplier={item.supplierName}
                    TargetDate={targetDeliveryDate}
                    Status={item.prStatus}
                    StatusID={item.prStatusID}
                  />
                </div>
              );
            });

            setlist1(resultsList);
          })
          .catch((err) => {
            console.log(err);
            console.log(err.config.data);
            if (err.code === "ERR_NETWORK") {
              alert(err.message);
            } else if (err.response.status === 404) {
              setlist1(
                <div className="p-5 mx-5">
                  No Purchase Requests Results Found!
                </div>
              );
            } else {
              alert(err.response.data);
            }
          });
      } else if (showAdHoc === true) {
        await axios
          .post(`${baseUrl}/api/purchaseReq/DynamicSearch`,
            {
              searchValue: searchValue,
              ByUserID: !viewAllPR,
              UserID: id,
              PurchaseType: true,
              PTID: 2,
              ByUserName: byName,
              ByReqDate: byReqDate,
              ByTargetDate: byTargetDate,
              ByBranchName: false,
              BySupplierName: false,
              ByPaymentMode: false,
              ByRemarks: byRemarks,
              ByPRStatus: byPRStatus,
            },
            {
              headers: {
                authorization: 'Bearer ' + Token
              }
            }
          )
          .then((response) => {
            const searchResult = response.data;

            const resultsList = [];

            searchResult.forEach((item, index) => {
              // Time stamp formatting
              const reqDate = moment(searchResult[index].requestDate).format(
                "D MMM YYYY"
              );
              const targetDeliveryDate = moment(
                searchResult[index].targetDeliveryDate
              ).format("D MMM YYYY");

              resultsList.push(
                <div key={index}>
                  <AdHocRow
                    RoleID={role}
                    prID={item.prID}
                    ReqDate={reqDate}
                    Name={item.name}
                    TargetDate={targetDeliveryDate}
                    Status={item.prStatus}
                    StatusID={item.prStatusID}
                    Description={item.remarks}
                  />
                </div>
              );
            });

            setAdHocResults(resultsList);
          })
          .catch((err) => {
            if (err.code === "ERR_NETWORK") {
              alert(err.message);
            } else if (err.response.status === 404) {
              setAdHocResults(
                <div className="p-5 mx-5">No Ad Hoc Purchases Found!</div>
              );
            } else {
              alert(err.response.data);
            };
          });
      }
    }
    // approver
    else if (role === 1) {
      if (showAdHoc === false) {
        await axios
          .post(`${baseUrl}/api/purchaseReq/DynamicSearch`,
            {
              searchValue: searchValue,
              ByUserID: !viewAllPR,
              UserID: id,
              PurchaseType: true,
              PTID: 1,
              ByUserName: byName,
              ByReqDate: byReqDate,
              ByTargetDate: byTargetDate,
              ByBranchName: byBranchName,
              BySupplierName: bySupplierName,
              ByPaymentMode: byPaymentMode,
              ByRemarks: false,
              ByPRStatus: byPRStatus,
            },
            {
              headers: {
                authorization: 'Bearer ' + Token
              }
            }
          )
          .then((response) => {
            // console.log(response.config.data);
            const searchResult = response.data;

            // Show List of Searched PR results
            const resultsList = [];

            searchResult.forEach((item, index) => {
              // Time stamp formatting
              const reqDate = moment(searchResult[index].requestDate).format("D MMM YYYY");
              const targetDeliveryDate = moment(searchResult[index].targetDeliveryDate).format("D MMM YYYY");

              resultsList.push(
                <div key={index}>
                  <PRRow
                    RoleID={role}
                    PTypeID={item.purchaseTypeID}
                    PType={item.purchaseType}
                    prID={item.prID}
                    ReqDate={reqDate}
                    Name={item.name}
                    Location={item.branchName}
                    Supplier={item.supplierName}
                    TargetDate={targetDeliveryDate}
                    Status={item.prStatus}
                    StatusID={item.prStatusID}
                  />
                </div>
              );
            });

            setlist1(resultsList);
          })
          .catch((err) => {
            console.log(err);
            if (err.code === "ERR_NETWORK") {
              alert(err.message);
            } else if (err.response.status === 404) {
              setlist1(
                <div className="p-5 mx-5">
                  No Purchase Requests Results Found!
                </div>
              );
            } else {
              alert(err.response.data);
            }
          });
      } else if (showAdHoc === true) {
        await axios
          .post(`${baseUrl}/api/purchaseReq/DynamicSearch`,
            {
              searchValue: searchValue,
              ByUserID: !viewAllPR,
              UserID: id,
              PurchaseType: true,
              PTID: 2,
              ByUserName: byName,
              ByReqDate: byReqDate,
              ByTargetDate: byTargetDate,
              ByBranchName: false,
              BySupplierName: false,
              ByPaymentMode: false,
              ByRemarks: byRemarks,
              ByPRStatus: byPRStatus,
            },
            {
              headers: {
                authorization: 'Bearer ' + Token
              }
            }
          )
          .then((response) => {
            const searchResult = response.data;

            // Show List of Searched PR results
            const resultsList = [];

            searchResult.forEach((item, index) => {
              // Time stamp formatting
              const reqDate = moment(searchResult[index].requestDate).format(
                "D MMM YYYY"
              );
              const targetDeliveryDate = moment(
                searchResult[index].targetDeliveryDate
              ).format("D MMM YYYY");

              resultsList.push(
                <div key={index}>
                  <AdHocRow
                    RoleID={role}
                    prID={item.prID}
                    ReqDate={reqDate}
                    Name={item.name}
                    TargetDate={targetDeliveryDate}
                    Status={item.prStatus}
                    StatusID={item.prStatusID}
                    Description={item.remarks}
                  />
                </div>
              );
            });

            setAdHocResults(resultsList);
          })
          .catch((err) => {
            console.log(err);
            if (err.code === "ERR_NETWORK") {
              alert(err.message);
            } else if (err.response.status === 404) {
              setAdHocResults(
                <div className="p-5 mx-5">No Ad Hoc Purchases Found!</div>
              );
            } else {
              alert(err.response.data);
            }
          });
      }
    };
  };

  // set value for search input
  const PRSearch = async (e) => {
    e.preventDefault();

    setSearchValue(e.target.value);
    console.log(e.target.value)

    if (e.target.value === '') {
      setlist1(ogPRlist);
    }

    // handlePRSearch(e);
  };

  return (
    <>
      <h1 className={styles.header}>Purchase Request</h1>

      <div className="pb-5">
        <div className={styles.rightFloater}>
          {
            role === 2 &&
            <div className="px-3 pb-4">
              <div className={styles.toggle}>
                <div className="px-3 pt-1">
                  <h5>View All</h5>
                </div>

                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="viewAll"
                    onChange={ViewAllToggle}
                    checked={viewAllPR}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          }

          <div>
            <form onSubmit={handlePRSearch}>
              <div className="d-inline-flex">
                <input type="text" placeholder="  Search.." value={searchValue} onChange={(e) => { PRSearch(e) }} name="search" className={styles.searchBox} />
                <button type="submit" className={styles.searchButton}>
                  <Image src={searchIcon} width={25} alt="Search" />
                </button>
                <button type="button" onClick={handleFilterPopUp} className={styles.searchButton}>
                  <Image src={filterIcon} width={25} alt="Filter" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <div>
          <div className="pt-1">
            <hr />
          </div>

          {role === 2 && showAdHoc === false && (
            <ul className="list-group list-group-horizontal">
              <li className="list-group-item col-sm-1 px-4 ms-3 border-0">PR No.</li>
              <li className="list-group-item col-sm-1 mx-2 border-0">Type</li>
              <li className="list-group-item col-sm-1 mx-3 border-0">Date</li>
              <li className="list-group-item col-sm-2 mx-3 border-0">Location</li>
              <li className="list-group-item col-sm-2 px-3 border-0">Supplier</li>
              <li className="list-group-item col-sm-1 ps-0 border-0">Target Date</li>
              <li className="list-group-item col-sm-2 px-5 border-0">Status</li>
              <li className="list-group-item col-sm-1 px-0 border-0"></li>
            </ul>
          )}

          {role === 1 && showAdHoc === false && (
            <ul className="list-group list-group-horizontal">
              <li className="list-group-item col-sm-1 px-3 mx-2 border-0">PR No.</li>
              <li className="list-group-item col-sm-1 border-0">Type</li>
              <li className="list-group-item col-sm-1 px-1 border-0">Date</li>
              <li className="list-group-item col-sm-1 px-1 ms-4 border-0">Name</li>
              <li className="list-group-item col-sm-2 px-3 border-0">Location</li>
              <li className="list-group-item col-sm-1 px-0 border-0">Supplier</li>
              <li className="list-group-item col-sm-1 px-1 mx-4 border-0 text-center">Target Date</li>
              <li className="list-group-item col-sm-2 px-5 mx-2 border-0">Status</li>
              <li className="list-group-item col-sm-1 border-0"></li>
            </ul>
          )}

          <hr />
        </div>
      </div>

      <div className="overflow-scroll w-100 h-75 position-absolute">
        {PRResults}
      </div>

      <div>
        <a href={"/PurchaseRequest/CreatePR"}>
          <button className={styles.createButton}>
            <Image src={plusIcon} alt="Plus Icon" width={40} height={40} />
          </button>
        </a>
      </div>

      {showFilterPopUp && (
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <div className="row pt-1">
              <div className="col-sm-1"></div>
              <div className="col-sm-10">
                <h2 className={styles.newStatusText}>Search Filters</h2>
              </div>

              <div className="col-sm-1 pt-1">
                <button
                  onClick={handleFilterPopUpClose}
                  className={styles.closePopUpButton}
                >
                  <Image src={xIcon} width={35} height={35} alt="Cancel" />
                </button>
              </div>
            </div>

            <div class="container p-3">
              <div className="row">
                <label>Search By ...</label>
              </div>
              <div class="row row-cols-2 mt-3">
                <div class="col">
                  <label className={styles.materialCheckbox}>
                    <input
                      type="checkbox"
                      id="username"
                      onChange={(e) => {
                        filterChecker(e);
                      }}
                      checked={byName}
                    />
                    <span className={styles.checkmark}></span>
                    Username
                  </label>
                </div>
                <div class="col">
                  <label className={styles.materialCheckbox}>
                    <input
                      type="checkbox"
                      id="date"
                      onChange={(e) => {
                        filterChecker(e);
                      }}
                      checked={byReqDate}
                    />
                    <span className={styles.checkmark}></span>
                    Date
                  </label>
                </div>
                <div class="col">
                  <label className={styles.materialCheckbox}>
                    <input
                      type="checkbox"
                      id="targetDate"
                      onChange={(e) => {
                        filterChecker(e);
                      }}
                      checked={byTargetDate}
                    />
                    <span className={styles.checkmark}></span>
                    Target Date
                  </label>
                </div>
                {showAdHoc === false && (
                  <>
                    <div class="col">
                      <label className={styles.materialCheckbox}>
                        <input
                          type="checkbox"
                          id="branch"
                          onChange={(e) => {
                            filterChecker(e);
                          }}
                          checked={byBranchName}
                        />
                        <span className={styles.checkmark}></span>
                        Branch
                      </label>
                    </div>
                    <div class="col">
                      <label className={styles.materialCheckbox}>
                        <input
                          type="checkbox"
                          id="supplier"
                          onChange={(e) => {
                            filterChecker(e);
                          }}
                          checked={bySupplierName}
                        />
                        <span className={styles.checkmark}></span>
                        Supplier
                      </label>
                    </div>
                    <div class="col">
                      <label className={styles.materialCheckbox}>
                        <input
                          type="checkbox"
                          id="paymentMode"
                          onChange={(e) => {
                            filterChecker(e);
                          }}
                          checked={byPaymentMode}
                        />
                        <span className={styles.checkmark}></span>
                        Payment Mode
                      </label>
                    </div>
                  </>
                )}

                {showAdHoc === true && (
                  <div class="col">
                    <label className={styles.materialCheckbox}>
                      <input
                        type="checkbox"
                        id="description"
                        onChange={(e) => {
                          filterChecker(e);
                        }}
                        checked={byRemarks}
                      />
                      <span className={styles.checkmark}></span>
                      Description
                    </label>
                  </div>
                )}

                <div class="col">
                  <label className={styles.materialCheckbox}>
                    <input
                      type="checkbox"
                      id="status"
                      onChange={(e) => {
                        filterChecker(e);
                      }}
                      checked={byPRStatus}
                    />
                    <span className={styles.checkmark}></span>
                    Status
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
