import axios from "axios";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react"; 

// styles & icons
import styles from '../../styles/supplier.module.css';
import searchIcon from '../../public/searchIcon.svg';
import filterIcon from '../../public/filterIcon.svg';
import plusIcon from '../../public/plusIcon.svg';
import xIcon from '../../public/xIcon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    // get category names for search filter 
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/api/supplier/category/all`,{})
            .then((res) => {
                const categories = res.data.map(filterOptions => {
                    value: filterOptions.categoryID;
                    label: filterOptions.categoryName;
                });
            setCategoryOptions(categories);
            })
    })

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

    // filter popup
    const [filterPopup, setFilterPopup] = useState(false);

    const handleClosePopup = () => {
        setFilterPopup(false);
    }

    const handleOpenPopup = () => {
        setFilterPopup(true);
    }

    // search filter by category type
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);

    // handle and update selected checkbox state
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setSelectedCategories((prevSelectedFilters) => [
                ...prevSelectedFilters,
                value,
            ]);
        } else {
            setSelectedCategories((prevSelectedFilters) =>
                prevSelectedFilters.filter((filter) => filter !== value)
            );
        }
    };

    // filter function
    const filterSuppliers = () => {
        if (selectedCategories.length === 0) {
            setSelectedCategories(suppliers);
        } else {
            const filtered = suppliers.filter((supplier) =>
                selectedCategories.includes(supplier.Category)
            );
            setSelectedCategories(filtered);
        }
    };

    // show filtered results


    return (
        <>
            <div className="row">
                <div className="col-8 d-inline">
                    <h1 className="">Supplier</h1>
                </div>

                <div className="col-4 pb-2 d-inline">
                    <div className="d-inline-flex py-4 ms-5">
                        <div className="d-inline-flex" style={{marginInlineStart:"100px"}}>
                            <input type="text" placeholder="Search..." name="search" className={styles.searchBox} value={searchInput} onChange={handleSearchInput}/>
                            <button type="button" className={styles.searchButton}><Image src={searchIcon} width={25} height={25}/></button>
                        </div>

                        <button type="button" className={styles.searchButton}><Image src={filterIcon} width={20} onClick={handleOpenPopup}/></button>

                        {/* popup box */}
                        {filterPopup && (
                            <>
                    
                            </>
                        )}

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
                    <div className="row py-4 rounded-4 m-1 mb-2" style={{backgroundColor: "#C0D8F7", height: "85px", cursor: "pointer"}}>
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

                {/* filter results */}

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
