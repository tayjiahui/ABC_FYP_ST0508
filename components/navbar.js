// this is for common page layouts e.g. website header, navbar, footer 
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { signOut, useSession } from "next-auth/react";


import logo from "../public/client_logo.png";
import profPic from "../public/prof_pic.png";


export default function NavBar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [userName, setUserName] = useState("");
    const [allowPRView, setAllowPRView] = useState(false);
    const [allowTransactionView, setAllowTransactionView] = useState(false);

    console.log({ session })

    // insert data into localStorage
    useEffect(() => {
        // ? after removing development login
        // if(!session){
        //     router.push('/login');
        // };

        if (status === 'authenticated' && session) {
            const userD = session.userDetails
            // TODO validate if userD is Null

            // add to localStorage
            localStorage.setItem("ID", userD.userID);
            localStorage.setItem("roleID", userD.role);
            localStorage.setItem("Name", userD.name);
            localStorage.setItem("FName", session.user.name);
            localStorage.setItem("token", userD.token)
        };

        if (!localStorage.getItem("token")) {
            localStorage.clear();
            signOut({ callbackUrl: '/Unauthorised' });
        };

        // set user name
        const username = localStorage.getItem("FName");
        setUserName(username);

        // set user role
        const roleID = parseInt(localStorage.getItem("roleID"), 10);
        if (roleID !== 4) {
            setAllowPRView(true);
        };

        if (roleID === 1 || roleID === 3) {
            setAllowTransactionView(true);
        };

        // !status may be undefined not caught
    }, [status, session]);

    return (
        <div>
            <div>
                <nav className="header-nav">
                    <ul className="navbar-left">
                        <li id="logoImage">
                            <a href='/Home'>
                                <Image
                                    src={logo}
                                    width={100}
                                    height={50}
                                    id="ABClogo"
                                    alt="ABC Cooking Studio Company Logo" />
                            </a>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Home" ? "active" : ""} href="/Home">Home</Link>
                        </li>

                        {
                            allowPRView &&
                            <li>
                                <Link className={router.pathname == "/PurchaseRequest" ? "active" : ""} href="/PurchaseRequest">Purchase Request</Link>
                            </li>
                        }

                        <li>
                            <Link className={router.pathname == "/TrackOrder" ? "active" : ""} href="/TrackOrder">Track Order</Link>
                        </li>
                        <li>
                            <Link className={router.pathname == "/TrackPayment" ? "active" : ""} href="/PurchaseOrder">Track Payment</Link>
                        </li>
                        <li>
                            <Link className={router.pathname == "/Supplier" ? "active" : ""} href="/Supplier">Supplier</Link>
                        </li>
                        {
                            allowTransactionView &&
                            <li>
                                <Link className={router.pathname == "/Transactions" ? "active" : ""} href="/Transactions">Transactions</Link>
                            </li>
                        }
                    </ul>
                    <ul className="navbar-right">
                        <li id="profPicImage" className='py-1'>
                            <a href='/Profile'>
                                <Image src={profPic} alt='Profile Picture' width={50} height={50} />
                            </a>
                        </li>
                        <li className='py-3'>
                            {/* <h3 id="username">{session.user.name}</h3> */}
                            <h5 id="username">{userName}</h5>
                        </li>
                    </ul>
                </nav>
                <hr />
            </div>
        </div>
    )
}