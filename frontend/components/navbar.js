// this is for common page layouts e.g. website header, navbar, footer 


import Link from 'next/link';
import Image from 'next/image';
import {useRouter} from 'next/router';

import logo from "../public/client_logo.png";
import profPic from "../public/prof_pic.png";

export default function App({Component, pageProps}){
    const router = useRouter()

    return(
       <div>
            <nav className="header-nav">
                <ul className="navbar-left">
                    <li id="logoImage">
                        <Image 
                            src={logo}
                            href="/"
                            width={100}
                            height={50}
                            id="ABClogo"
                            alt="ABC Cooking Studio Company Logo"/>
                    </li>
                    <li>
                        <Link className={router.pathname == "/" ? "active": ""} href="/">Home</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/PurchaseRequest" ? "active": ""} href="/PurchaseRequest">Purchase Request</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/TrackOrder" ? "active": ""} href="/TrackOrder">TrackOrder</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/TrackPayment" ? "active": ""} href="/TrackPayment">Track Payment</Link>
                    </li>
                    <li>
                        <Link className={router.pathname == "/Supplier" ? "active": ""} href="/Supplier">Supplier</Link>
                    </li>
                    </ul>
                <ul className="navbar-right">
                    <li id="profPicImage">
                        <Image src={profPic} width={50} height={50}/>
                    </li>
                    <li>
                        <h3 id="username">username</h3>
                    </li>
                </ul>
            </nav>
            <hr/>
       </div>
    )
}