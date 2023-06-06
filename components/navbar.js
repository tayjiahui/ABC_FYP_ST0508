// this is for common page layouts e.g. website header, navbar, footer 


import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';

import logo from "../public/client_logo.png";
import profPic from "../public/prof_pic.png";
import { useEffect, useState } from 'react';



export default function NavBar(){
    const router = useRouter();

    const [userName, setUserName] = useState("");

    useEffect(() => {
        const username = localStorage.getItem("Name");
        console.log(username);
        setUserName(username);
    }, [])

    return(
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
                            alt="ABC Cooking Studio Company Logo"/>
                        </a>
                    </li>
                    <li>
                        <Link className={router.pathname == "/" ? "active": ""} href="/Home">Home</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/PurchaseRequest" ? "active": ""} href="/PurchaseRequest">Purchase Request</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/TrackOrder" ? "active": ""} href="/TrackOrder">TrackOrder</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/TrackPayment" ? "active": ""} href="/PurchaseOrder">Track Payment</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/Supplier" ? "active": ""} href="/Supplier">Supplier</Link>
                    </li>
                    </ul>
                <ul className="navbar-right">
                    <li id="profPicImage">
                        <a href='/Profile'>
                            <Image src={profPic} width={50} height={50}/>
                        </a>
                    </li>
                    <li>
                        <h3 id="username">{userName}</h3>
                    </li>
                </ul>
            </nav>
            <hr/>
       </div>
    )
}