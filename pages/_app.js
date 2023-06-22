// this is for common page layouts e.g. website header, navbar, footer 
import React from "react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react"

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";

import NavBar from "../components/navbar.js"

export default function App({
    Component, 
    pageProps: { session, ...pageProps}, 
    ...appProps
}){

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const getContent = () => {
        const noNavbar = [`/`, `/Login`];

        if(noNavbar.includes(appProps.router.pathname))
            return <Component {...pageProps} />;
        
        return (
            <>
                <NavBar/>
                <Component {...pageProps} />
            </>
        );
    };

    return(
        <SessionProvider session={session}>
           {getContent()}
        </SessionProvider>
    )
}