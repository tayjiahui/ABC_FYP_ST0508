import axios from "axios";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react"; 

// styles & icons
import styles from '../../styles/supplier.module.css';
import searchIcon from '../../public/searchIcon.svg';
import filterIcon from '../../public/filterIcon.svg';
import plusIcon from '../../public/plusIcon.svg';

// WIP component
import WIP from "../../components/WIP";

// Base urls
const URL = [];

function isLocalhost() {
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        console.log("hostname: " + hostname);
        if (hostname == "localhost") {
            URL.push('http://localhost:3000', 'http://localhost:5000');
            console.log(URL);
        } else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
            URL.push(
                'https://abc-cooking-studio-backend.azurewebsites.net',
                'https://abc-cooking-studio.azurewebsites.net'
            );
            console.log("URL: " + URL);
        }

        return URL;
    }
};

isLocalhost();

console.log("url[0]: "+URL[0]);
console.log("url[1]: "+URL[1]);

const baseUrl = URL[0];
const baseURL = URL[1];

// console.log(baseUrl, baseURL);

// main supplier page
export default function Supplier({ suppliers }) {

    // WIP modal for search bar
    const [wip, setWip] = useState(false);

    const wipOpen = async (e) => {
        e.preventDefault()
        setWip(true);
        timer();
    }

    function timer() {
        setTimeout(closeWIP, 2000);
    }

    function closeWIP() {
        setWip(false);
    }

    // search bar
    const [searchInput, setSearchInput] = useState([]);
    const [searchResults, setSearchResults] = useState(suppliers);

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
        searchResult(e.target.value);
    };

    // search by supplierName, category name, contact person name
    const searchResult = (searchValue) => {
        const findSupplier = suppliers.filter(
            (result) =>
                result.supplierName.toLowerCase().includes(searchValue.toLowerCase()) ||
                result.Category.toLowerCase().includes(searchValue.toLowerCase()) ||
                result.contactPersonName.toLowerCase().includes(searchValue.toLowerCase())
        );
        setSearchResults(findSupplier);
    };

    return (
        <>
            <div className="row">
                <div className="col-8 d-inline">
                    <h1 className="">Supplier</h1>
                </div>

                <div className="col-4 pb-2 d-inline">
                    <div className="d-inline-flex py-4 ms-5">
                        <form className="d-inline-flex" style={{marginInlineStart:"100px"}}>
                            <input type="text" placeholder="Search..." name="search" className={styles.searchBox} value={searchInput} onChange={handleSearchInput}/>
                            <button type="submit" className={styles.searchButton}><Image src={searchIcon}/></button>
                            <button type="submit" className={styles.searchButton}><Image src={filterIcon} width={20} onClick={wipOpen}/></button>
                        </form>
                        {wip && <WIP Show={wip} />}
                    </div>
                </div>
            </div>

            <div className="row py-4 border-top border-bottom mx-2 mb-3 px-4">
                <div className="col-1 col-sm-1">No.</div>
                <div className="col-3 col-sm-3" style={{textAlign: "left"}}>Supplier Name</div>
                <div className="col-2 col-sm-2" style={{textAlign: "left"}}>Contact Person</div>
                <div className="col-2 col-sm-2" style={{textAlign: "left"}}>Contact Number</div>
                <div className="col-4 col-sm-4" style={{textAlign: "left"}}>Category</div>
            </div>

            <div>
                {searchResults.map((supplier, index) => (
                    <div className="row py-4 rounded-4 m-1 mb-2" style={{backgroundColor: "#C0D8F7", height: "85px"}}>
                        <div className="row d-flex mx-4">
                            <a href={'/Supplier/' + supplier.supplierID} className="col">
                                <div className="col d-flex">
                                    <div className="col-1 col-sm-1">
                                        <p>{supplier.supplierID}</p>
                                    </div>
                                    <div className="col-3 col-sm-3">
                                        <p style={{ textAlign: "left" }}>{supplier.supplierName}</p>
                                    </div>
                                    <div className="col-2 col-sm-2">
                                        <p style={{ textAlign: "left" }}>{supplier.contactPersonName}</p>
                                    </div>
                                    <div className="col-2 col-sm-2">
                                        <p style={{ textAlign: "left" }}>{supplier.phoneNum}</p>
                                    </div>
                                    <div className="col-4 col-sm-4">
                                        <p style={{ textAlign: "left" }}>{supplier.Category}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                ))}   
            </div>

            <div>
                <a href={'/Supplier/CreateSupplier'}>
                    <button className={styles.createButton}>
                        <Image src={plusIcon} alt="Create Button" width={40} height={40}/>
                    </button>
                </a>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    const backBaseURL = [];

    if(host == 'localhost:5000') {
        backBaseURL.push('http://localhost:3000');
    }
    else {
        backBaseURL.push('https://abc-cooking-studio-backend.azurewebsites.net');
    }

    try {
        const response = await axios.get(`${backBaseURL}/api/supplier/all`);
        const suppliers = await response.data;
        return {
            props: {
                suppliers
            }
        };
    } catch (error) {
        console.log(error);
        return {
            props: {
                suppliers: []
            }
        };
    }
}
