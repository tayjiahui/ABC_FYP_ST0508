// this is for common page layouts e.g. website header, navbar, footer 
import React from "react";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";

// components
import NavBar from "../components/navbar";
import AdminNavBar from "../components/adminNavBar";

export default function App({
    Component,
    pageProps: { session, ...pageProps },
    ...appProps
}) {

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    const getContent = () => {
        const noNavbar = [`/`, `/Login`, `/Unathorised`, `/fakeLogin`];

        if (noNavbar.includes(appProps.router.pathname)) {
            return <Component {...pageProps} />;
        };
        
        // admin page navbar
        if (appProps.router.pathname.includes('/Admin')) {
            return (
                <>
                    <AdminNavBar />
                    <Component {...pageProps} />
                </>
            );
        };

        return (
            <>
                <NavBar />
                <Component {...pageProps} />
            </>
        );
    };

    return (
        <SessionProvider session={session}>
            {getContent()}
        </SessionProvider>
    )
}