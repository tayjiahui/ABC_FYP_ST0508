// WIP Modal Component
import Image from "next/image";
import { useState } from "react";

import styles from "../styles/WIP.module.css"

import xIcon from '../public/xIcon.svg';

export default function WIPModal(props){
    const [showInProg, setInProg] = useState(props.Show);
    console.log(showInProg, "atfirst")

    //   Filter Pop Up Close
    const handleFilterPopUpClose = async() => {
        setInProg(false);
        console.log(showInProg,"modale kfkf");
    };

    return(
        <>  
            {showInProg &&
                <div className={styles.inProgressBox}>
                    <div className={styles.inProgBox}>
                        <div className="d-flex pt-1 text-center">
                            <div className="col-sm-11">
                                <h2 className={styles.newStatusText}>Oops!</h2>
                            </div>

                            <div className="col-sm-1 pt-1 ps-5">
                                <button onClick={handleFilterPopUpClose} className={styles.closePopUpButton}>
                                    <Image src={xIcon} width={35} height={35} alt="Cancel"/>
                                </button>
                            </div>
                        </div>

                        <div class="container p-3">
                            <div className="row text-center">
                                <label><strong>Work In Progress</strong></label>
                                <p>We will be back soon!</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            
        </>
    );
};