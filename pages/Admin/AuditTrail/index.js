import React from "react";
import axios from "axios";
import Image from "next/image";
import moment from 'moment-timezone';

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// Style Sheet
import styles from "../../../styles/auditLog.module.css";

// Images 
import leftArrowIcon from "../../../public/leftArrow.svg"

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

// Each Audit Row
function AuditRow(props) {
    const [Token, setToken] = useState();

    const [ALDate, setALDate] = useState();
    const [ALTime, setALTime] = useState();

    const [showAction, setShowAction] = useState(false);

    const auditLog = props.AuditLogData;

    useEffect(() => {
        // timestamp re formatting
        setALDate(moment(auditLog.timestamp).format('D MMM YYYY'));
        setALTime(moment(auditLog.timestamp).format('h:mm:ss A'));
    }, []);

    const handleMoreClick = () => {
        if (showAction === false) {
            setShowAction(true);
        } else {
            setShowAction(false);
        };
    };

    return (
        <div>
            <div className={styles.prButton}>
                <div className={styles.prRow}>
                    <div className="py-2 row text-start px-4">
                        <div className="col-sm-2">
                            {ALDate}
                        </div>
                        <div className="col-sm-2">
                            {ALTime}
                        </div>
                        <div className="col-sm-2">
                            {auditLog.role}
                        </div>
                        <div className="col-sm-2">
                            {auditLog.name}
                        </div>
                        <div className="col-sm-2">
                            {auditLog.actionType}
                        </div>
                        <div className="col-sm-2">
                            <a onClick={handleMoreClick} className={styles.seeMoreLink}>
                                {
                                    showAction ? (
                                        <div>See Less</div>
                                    ) : (
                                        <div>See More</div>
                                    )
                                }
                            </a>
                        </div>
                    </div>
                </div>

                {
                    showAction &&
                    <div className="pb-1 pt-0">
                        <div className={styles.plRow}>
                            <h5 className="ps-5 pt-3 text-start">
                                <u>Action</u>
                            </h5>

                            <div className="py-3 px-5 text-start">
                                <div>
                                    <div className="d-flex">
                                        <div className="col-sm-2">
                                            <h6>Column ID Type</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{auditLog.itemIDType}</p>
                                        </div>
                                        <div className="col-sm-2">
                                            <h6>Table Affected:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{auditLog.tableName}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="col-sm-2">
                                            <h6>Item ID:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{auditLog.itemId}</p>
                                        </div>
                                        <div className="col-sm-2">
                                            <h6>Column Affected:</h6>
                                        </div>
                                        <div className="col-sm">
                                            <p>{auditLog.valueChanged_fieldName}</p>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="col-sm-2">
                                            <h6>Changes:</h6>
                                        </div>
                                        <div className="col-sm d-flex">
                                            <p>{auditLog.oldValue}</p>
                                            <div className="px-4">
                                                <Image src={leftArrowIcon} width={20} height={25} alt="Right arrow" className={styles.invertArrow} />
                                            </div>
                                            <p>{auditLog.newValue}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default function AuditLogs() {

    const [Token, setToken] = useState();

    const [AuditLogsList, setAuditLogsList] = useState([<div>Loading...</div>]);

    useEffect(() => {
        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        axios.get(`${baseUrl}/api/auditTrail/`,
            {
                headers: {
                    authorization: 'Bearer ' + token
                }
            }
        )
            .then((response) => {
                setAuditLogsList(response.data);
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

    }, []);

    return (
        <div>
            <div className="px-2">
                <h1>Audit Trail</h1>
            </div>

            <div>
                <div className="pt-1">
                    <hr />
                </div>
                <ul className="list-group list-group-horizontal">
                    <li className="list-group-item col-sm-2 border-0">Date</li>
                    <li className="list-group-item col-sm-2 border-0">Time</li>
                    <li className="list-group-item col-sm-2 border-0">Role</li>
                    <li className="list-group-item col-sm-2 border-0">Username</li>
                    <li className="list-group-item col-sm-2 border-0">Event Type</li>
                    <li className="list-group-item col-sm-2 border-0">Action</li>
                </ul>
                <hr />
            </div>

            <div className="overflow-scroll w-100 h-75 position-absolute">
                {
                    AuditLogsList.map((item, index) => {
                        return <div key={index}>
                            <AuditRow
                                AuditLogData={item}
                            />
                        </div>
                    })
                }
            </div>
        </div>
    );
};