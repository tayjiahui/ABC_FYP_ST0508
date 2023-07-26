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

    /* COMBINED SEARCH BAR AND SEARCH FILTER RESULTS */
    const [searchTerm, setSearchTerm] = useState('');
    const [checkedOptions, setCheckedOptions] = useState([]);
    const [filteredItems, setFilteredItems] = useState(suppliers);
    const [category, setCategory] = useState([]);

    // fetch category names for filter options
    useEffect(() => {
        axios.get(`${baseUrl}/api/supplier/category/all`,{})
            .then((res) => {
                setCategory(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
    }, []);

    // update filtered items when searchterm or checkedOptions change
    useEffect(() => {
        filterItems(searchTerm, checkedOptions);
    }, [searchTerm, checkedOptions]);

    // inputs change handler
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        filterItems(event.target.value, checkedOptions);
    };

    // checkbox value change handler
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        const updatedChecked = checked
            ?[...checkedOptions, value]
            :checkedOptions.filter((option) => option !== value);

        setCheckedOptions(updatedChecked);
        filterItems(searchTerm, checkedOptions);
    };

    const filterItems = (term, selectedOptions) => {
        const filtered = suppliers.filter((item) => {
            const hasMatch = item.Category.toLowerCase().includes(term.toLowerCase()) ||
                            item.supplierName.toLowerCase().includes(term.toLowerCase()) ||
                            item.contactPersonName.toLowerCase().includes(term.toLowerCase());

            if (selectedOptions.length === 0) {
                return hasMatch;
            } else {
                return (
                    hasMatch &&
                    selectedOptions.every((selectedOptions) =>
                        item.Category.includes(selectedOptions)
                    )
                    
                    // item.Category &&
                    // item.Category.some((categoryName) => selectedOptions.includes(categoryName))
                );
            }
        });

        setFilteredItems(filtered);
    };

    // filter popup box
    const [filterPopup, setFilterPopup] = useState(false);

    const handleClosePopup = () => {
        setFilterPopup(false);
    }

    const handleOpenPopup = () => {
        setFilterPopup(true);
    }

    return (
        <>
            <div className="row">
                <div className="col-8 d-inline">
                    <h1 className="">Supplier</h1>
                </div>

                <div className="col-4 pb-2 d-inline">
                    <div className="d-inline-flex py-4 ms-5">
                        <div className="d-inline-flex" style={{marginInlineStart:"100px"}}>
                            <input type="text" placeholder="Search..." name="search" className={styles.searchBox} value={searchTerm} onChange={handleInputChange}/>
                            <button type="button" className={styles.searchButton}><Image src={searchIcon} width={25} height={25}/></button>
                        </div>

                        <button type="button" className={styles.searchButton}><Image src={filterIcon} width={20} onClick={handleOpenPopup}/></button>

                        {/* filter popup */}
                        {filterPopup && (
                            <div className={styles.filterPopup}>
                                <div className={styles.popupContent}>
                                    <div className="row pt-1">
                                        <div className="col-sm-1"></div>
                                        <div className="col-sm-10">
                                            <h2>Search Filters</h2>
                                        </div>

                                        <div className="col-sm-1 pt-1">
                                            <button className={styles.closePopUpButton} onClick={handleClosePopup}>
                                                <Image src={xIcon} width={35} height={35} alt="Cancel" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="container p-3">
                                        <div className="row">
                                            <label>Search By ...</label>
                                        </div>

                                        <div className="row row-cols-2 mt-3">
                                            <div className="col">
                                                {/* checkboxes */}
                                                {category.map((checkbox) => (
                                                    <label key={checkbox.categoryID}>
                                                        <input
                                                            type="checkbox"
                                                            value={checkbox.categoryName}
                                                            onChange={handleCheckboxChange}
                                                            checked={checkedOptions.includes(checkbox.categoryName)}
                                                        />
                                                        {checkbox.categoryName}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                {filteredItems.map((supplier) => (
                    <div className="row py-4 rounded-4 m-1 mb-2" style={{backgroundColor: "#C0D8F7", height: "85px", cursor: "pointer"}}>
                        <div className="row d-flex mx-4">   
                            <a href={'/Supplier/' + supplier.supplierID} className="col">
                                <div key={supplier.supplierID} className="col d-flex">
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
