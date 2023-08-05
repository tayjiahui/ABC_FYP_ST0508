import React from "react";
import axios from "axios";
import Image from "next/image";

import { useEffect, useState } from "react";

// Style Sheet
// import styles from "../../../styles/purchaseReq.module.css";
import styles from "../../../styles/adminUsers.module.css";

// components
import AlertBox from "../../../components/alert";

// Images
import xIcon from "../../../public/xIcon.svg";

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
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

// Each User Row
function UserRow(props) {
    // const statusID = props.StatusID;
    const [Token, setToken] = useState();

    const [RolesList, setRoleList] = useState([]);
    const [selectedRole, setSelectRole] = useState();

    const [CreateNewRolePop, setCreateNewRolePop] = useState(false);
    const [newRole, setNewRole] = useState('');

    // Alert Box
    const [UpdateRoleALert, setUpdateRoleALert] = useState(false);

    useEffect(() => {
        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        axios.get(`${baseUrl}/api/user/role/all`,
            {
                headers: {
                    authorization: 'Bearer ' + token
                }
            }
        )
            .then((response) => {
                setRoleList(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [selectedRole]);

    const handleCreatePopUpClose = () => {
        setCreateNewRolePop(false);
        setSelectRole(props.RoleID);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(newRole);

        await axios.post(`${baseUrl}/api/user/role`,
            {
                role: newRole
            }
        )
            .then(async (response) => {
                const newRoleID = response.data.roleID;

                await axios.put(`${baseUrl}/api/user/role/${props.UserID}`,
                    {
                        roleID: newRoleID
                    },
                    {
                        headers: {
                            authorization: 'Bearer ' + Token
                        }
                    }
                )
                    .then((response) => {
                        setCreateNewRolePop(false);
                        setSelectRole(newRoleID);
                        setNewRole('');
                    })

                setUpdateRoleALert(true);
                alertTimer();
            })
            .catch((err) => {
                console.log(err);
            })
    };

    const handleRoleChange = async (e) => {
        e.preventDefault();

        // e.target.value is roleID
        setSelectRole(e.target.value);
        const selectedRole = e.target.value;

        if (selectedRole === "+ Create New Role") {
            setCreateNewRolePop(true);
        } else {
            await axios.put(`${baseUrl}/api/user/role/${props.UserID}`,
                {
                    roleID: selectedRole
                },
                {
                    headers: {
                        authorization: 'Bearer ' + Token
                    }
                }
            )
                .then((response) => {
                    setUpdateRoleALert(true);
                    alertTimer();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    };

    function alertTimer() {
        // changes all alert useStates to false after 3s
        setTimeout(alertFunc, 3000);
    };

    function alertFunc() {
        // list of alerts useStates in your page
        setUpdateRoleALert(false);
    };

    return (
        <div>
            {/* <a> */}
            <div className={styles.prButton}>
                <div className={styles.prRow}>
                    <div className="py-2 row text-start">
                        <div className="col-sm-1 text-center">
                            {props.UserID}
                        </div>
                        <div className="col-sm-1">
                        </div>
                        <div className="col-sm-3">
                            {props.UserName}
                        </div>
                        <div className="col-sm-4 px-1">
                            {props.Email}
                        </div>
                        <div className="col-sm-3 text-center">
                            {/* {props.Role} */}
                            <select className="rounded text-center w-76 h-100" value={selectedRole} onChange={handleRoleChange}>
                                <option key={1} value={props.RoleID} selected="selected">{props.Role}</option>
                                {
                                    RolesList.map((item, index) => {
                                        if (item.roleID !== props.RoleID) {
                                            return <option key={index + 2} value={item.roleID}>{item.role}</option>
                                        }
                                    })
                                }
                                <option key={RolesList.length + 2}> + Create New Role</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {/* </a> */}

            {CreateNewRolePop &&
                <div className={styles.newStatusBox}>
                    <div className={styles.newStatus}>
                        <div className="row pt-1">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <h2 className={styles.newStatusText}>Create New Role</h2>
                            </div>

                            <div className="col-sm-1">
                                <button onClick={handleCreatePopUpClose} className="btn">
                                    <Image src={xIcon} width={35} height={35} alt="Cancel" />
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="py-4 text-center">
                                <label htmlFor="statusInput" className="pb-2">Enter New Role : </label> <br />
                                <input type="text" id="statusInput" value={newRole} onChange={(e) => setNewRole(e.target.value)} /> <br />
                            </div>
                            <div>
                                <button type="submit" className={styles.createStatusBtn}> Create Status</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {
                UpdateRoleALert &&
                <AlertBox
                    Show={UpdateRoleALert}
                    Message={`User ID#${props.UserID} Role Updated!`}
                    Type={'success'}
                    Redirect={''} />
            }
        </div>
    );
};


export default function Users() {

    const [Token, setToken] = useState();

    const [UsersList, setUsersList] = useState([<div>Loading...</div>]);

    useEffect(() => {
        // set user token
        const token = localStorage.getItem("token");
        setToken(token);

        axios.get(`${baseUrl}/api/user/`,
            {
                headers: {
                    authorization: 'Bearer ' + token
                }
            }
        )
            .then((response) => {
                setUsersList(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
            <div className="px-5">
                <h1>Users</h1>
            </div>
            <div>
                <div className="pt-1">
                    <hr />
                </div>
                <ul className="list-group list-group-horizontal">
                    <li className="list-group-item col-sm-1 border-0 text-center">ID No.</li>
                    <li className="list-group-item col-sm-1 border-0"></li>
                    <li className="list-group-item col-sm-3 px-1 border-0">Name</li>
                    <li className="list-group-item col-sm-4 px-1 border-0">Email</li>
                    <li className="list-group-item col-sm-3 border-0 text-center">Role</li>
                </ul>
                <hr />
            </div>

            <div className="overflow-scroll w-100 h-75 position-absolute">
                {
                    UsersList.map((item, index) => {
                        return <div>
                            <UserRow
                                UserID={item.userID}
                                UserName={item.name}
                                Email={item.email}
                                Role={item.role}
                                RoleID={item.roleID} />
                        </div>
                    })
                }
            </div>
        </div>
    );
};