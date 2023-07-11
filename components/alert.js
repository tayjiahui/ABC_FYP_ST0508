// Alert Component
import {useRouter} from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AlertBox(props){
    // { showModal, handleCloseModal, Body, title, content }
    // const [showAlert, setShowAlert] = useState(props.Show);
    const [showAlert, setShowAlert] = useState(props.Show);
    console.log("ALERT");
    console.log(showAlert);

    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return(
        <>
        {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{content}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
            Close
            </Button>
        </Modal.Footer>
        </Modal> */}
            {
                showAlert === true &&
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
            }

            
        </>
    )
}
