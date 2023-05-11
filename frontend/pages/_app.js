// this is for common page layouts e.g. website header, navbar, footer 

import "../styles/global.css";
import NavBar from "../components/navbar.js"

export default function App({Component, pageProps}){

    return(
       <div>
            <NavBar></NavBar>
            <Component {...pageProps} />
       </div>
    )
}