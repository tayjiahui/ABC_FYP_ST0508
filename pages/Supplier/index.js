import axios from "axios";
import React from "react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

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
        // set user token
        const token = localStorage.getItem("token");

        axios.get(`${baseUrl}/api/supplier/category/all`,
            {
                headers: {
                    authorization: 'Bearer ' + token
                }
            }
        )
            .then((res) => {
                setCategory(res.data);
            })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
                    localStorage.clear();
                    signOut({ callbackUrl: '/Unauthorised' });
                  }
                  else {
                    console.log(err);
                  };
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
            ? [...checkedOptions, value]
            : checkedOptions.filter((option) => option !== value);

        setCheckedOptions(updatedChecked);
        filterItems(searchTerm, checkedOptions);
    };

    const filterItems = (term, selectedOptions) => {
        const filtered = suppliers.filter((item) => {
            // search value checking
            const hasMatch = item.Category.toLowerCase().includes(term.toLowerCase()) ||
                item.supplierName.toLowerCase().includes(term.toLowerCase()) ||
                item.contactPersonName.toLowerCase().includes(term.toLowerCase());

            if (selectedOptions.length === 0) { // no checkbox checked
                return hasMatch;
            }
            else { // checkbox checked
                return (
                    hasMatch &&
                    // checked options checking with existing suppliers category
                    selectedOptions.every((selectedOptions) =>
                        item.Category.includes(selectedOptions)
                    )
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
            <h1>Supplier</h1>

            <div className="pb-5">
                <div className={styles.rightFloater}>
                    <div className="d-inline-flex" style={{ marginInlineStart: "100px" }}>
                        <input type="text" placeholder="  Search..." name="search" className={styles.searchBox} value={searchTerm} onChange={handleInputChange} />
                        <button type="button" className={styles.searchButton}>
                            <Image src={searchIcon} width={25} height={25} />
                        </button>
                        <button type="button" className={styles.searchButton}>
                            <Image src={filterIcon} width={25} height={25} onClick={handleOpenPopup} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="row py-4 border-top border-bottom mx-2 mb-3 px-4">
                <div className="col-1 col-sm-1">No.</div>
                <div className="col-3 col-sm-3" style={{ textAlign: "left" }}>Supplier Name</div>
                <div className="col-2 col-sm-2" style={{ textAlign: "left" }}>Contact Person</div>
                <div className="col-2 col-sm-2" style={{ textAlign: "left" }}>Contact Number</div>
                <div className="col-4 col-sm-4" style={{ textAlign: "left" }}>Category</div>
            </div>

            <div className="overflow-scroll w-100 h-75 position-absolute">
                {filteredItems.map((supplier) => (
                    <div className="pt-1 mb-1">
                        <div className={`py-1 ${styles['hover-box-shadow']}`} style={{ backgroundColor: "#C0D8F7", cursor: "pointer", borderRadius: '10px' }}>
                            <div className="d-flex pt-1">
                                <a href={'/Supplier/' + supplier.supplierID} className="col">
                                    <div key={supplier.supplierID} className="col d-flex ps-5">
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
                    </div>
                ))}
            </div>

            <div>
                <a href={'/Supplier/CreateSupplier'}>
                    <button className={styles.createButton}>
                        <Image src={plusIcon} alt="Create Button" width={40} height={40} />
                    </button>
                </a>
            </div>

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
                                    {category.map((option) => (
                                        <div key={option.categoryID} className={styles.checkboxItem}>
                                            <label>
                                                <span className="me-2">
                                                    <input
                                                        id={option.categoryID}
                                                        type="checkbox"
                                                        value={option.categoryName}
                                                        onChange={handleCheckboxChange}
                                                        checked={checkedOptions.includes(option.categoryName)}
                                                    />
                                                </span>
                                                {option.categoryName}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export async function getServerSideProps(context) {
    const host = context.req.headers.host;
    const backBaseURL = [];

    if (host == 'localhost:5000') {
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
