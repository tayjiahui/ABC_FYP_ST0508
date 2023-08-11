// this is for common page layouts e.g. website header, navbar, footer 
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";


import logo from "../public/client_logo.png";
import profPic from "../public/prof_pic.png";


export default function AdminNavBar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [userName, setUserName] = useState("");

    console.log({session})

    // insert data into localStorage
    useEffect(() => {
        // ? after removing development login
        // if(!session){
        //     router.push('/login');
        // };

        if (status === 'authenticated' && session) {
            const userD = session.userDetails
            // TODO validate if userD is Null
            // console.log(userD);

            // removes non-admin users
            if(userD.role !== 5){
                router.push('/Unauthorised');
            };

            // add to localStorage
            localStorage.setItem("ID", userD.userID);
            localStorage.setItem("roleID", userD.role);
            localStorage.setItem("Name", userD.name);
            localStorage.setItem("FName", session.user.name);
            localStorage.setItem("token", userD.token)
        };

        const username = localStorage.getItem("FName");
        setUserName(username);

        // !status may be undefined not caught
    }, [status, session]);

    return (
        <div>
            <div>
                <nav className="header-nav">
                    <ul className="navbar-left">
                        <li id="logoImage">
                            <a href='/Admin/Home'>
                                <Image
                                    src={logo}
                                    width={100}
                                    height={50}
                                    id="ABClogo"
                                    alt="ABC Cooking Studio Company Logo" />
                            </a>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Admin/Home" ? "active" : ""} href="/Admin/Home">Home</Link>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Admin/Users" ? "active" : ""} href="/Admin/Users">Users</Link>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Admin/Transactions" ? "active" : ""} href="/Admin/Transactions">Transactions</Link>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Admin/AuditTrail" ? "active" : ""} href="/Admin/AuditTrail">Audit Trail</Link>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Admin/Configurations" ? "active" : ""} href="/Admin/Configurations">Configurations</Link>
                        </li>
                    </ul>
                    <ul className="navbar-right">
                        <li id="profPicImage" className='py-1'>
                            <a href='/Admin/Profile'>
                                <Image src={profPic} alt='Profile Picture' width={50} height={50} />
                            </a>
                        </li>
                        <li className='py-3'>
                            <h5 id="username">{userName}</h5>
                        </li>
                    </ul>
                </nav>
                <hr />
            </div>
        </div>
    )
}