import React from 'react';
import axios from 'axios';
import moment from 'moment';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// Style Sheet
import styles from '../../styles/trackOrder.module.css';

// Images
import searchIcon from '../../public/searchIcon.svg';
import filterIcon from '../../public/filterIcon.svg';

// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    console.log('hostname   ' + hostname);
    if (hostname == 'localhost') {
      URL.push('http://localhost:3000', 'http://localhost:5000');
      console.log(URL);

    }
    else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
      URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
      console.log(URL);
    };

    return URL;
  };
};

isLocalhost();

const baseUrl = URL[0];
const baseURL = URL[1];

console.log(baseUrl);
console.log(baseURL);

// function OrderRow(props) {

//   const [status, setStatus] = useState([]);
//   const [selectedStatus, setSelectedStatus] = useState("");

//   const [newStatusPop, setNewStatusPop] = useState(false);
//   const [statusInput, setStatusInput] = useState([]);

//   const [changedStatusPop, setChangedStatusPop] = useState(false);

//   const handleCloseStatusPop = () => {
//     setNewStatusPop(false);
//     setChangedStatusPop(false);
//   }

//   const handleInputChange = (event) => {
//     setStatusInput(event.target.value);
//   }

//   const handleSubmit = (event) => {

//     console.log("submitting status");
//     // event.preventDefault();
//     alert(`Sucessfully created new status: ${statusInput}`);

//     axios.post(`${baseUrl}/api/trackOrder/purchaseStatus`, {
//       purchaseStatus: statusInput
//     })
//       .then(res => {
//         alert(`sucessfully created new status ${statusInput}`)
//         setNewStat(false)
//         console.log(res.data);
//         setStatus((prevStatus) => [...prevStatus, res.data]);
//         onSubmit(statusInput)
//       })
//       .catch((err) => {
//         console.log(err);
//       })
//   }

//   console.log(statusInput)

//   useEffect(() => {
//     axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`)
//       .then(res => {
//         console.log(res.data)
//         setStatus(res.data);
//         setSelectedStatus(res.data[0]); //initial selected status
//       })
//       .catch(err => console.log(err));
//   }, []);

//   const poID = props.poID;

//   const handleStatusChange = (event) => {
//     setSelectedStatus(event.target.value);
//     const selectedValue = event.target.value;
//     console.log(event.target)
//     console.log("value", selectedValue)

//     if (selectedValue === "+ Create New Status") {
//       setNewStatusPop(true);
//     }
//     // else if (selectedValue === "Preparing Order") {
//     //   setChangedStatusPop(true);
//     // }
//     else {
//       console.log('other options')
//       axios.put(`${baseUrl}/api/trackOrder/purchaseOrderStatus/${poID}`, {
//         purchaseStatusID: selectedValue,
//       })
//         .then((res) => {
//           console.log(res)
//         })
//         .catch((err) => {
//           console.log(err)
//         })
//       setChangedStatusPop(true);

//     }
//   };

//   return (
//     <div>
//       <div className="d-flex w-5 h-5 rounded-4 mb-3" style={{ backgroundColor: '#C0D8F7' }}>
//         <a href={baseURL + '/TrackOrder/' + props.poID}>
//           <button className="border-0" style={{ backgroundColor: 'transparent' }}>
//             <div className={styles.orderTextRow}>
//               <div className="row ms-4">
//                 <p>{props.poID}</p>
//               </div>
//               <div className="row ms-4">
//                 <p>{props.prID}</p>
//               </div>
//               <div className="row ms-1">
//                 <p>{props.date}</p>
//               </div>
//               <div className="row ms-4">
//                 <p>{props.Name}</p>
//               </div>
//               <div className="row ms-5">
//                 <p>{props.Supplier}</p>
//               </div>
//             </div>
//           </button>
//         </a>
//         {/* <div className={styles.container2}>
//         <select name="status" className={styles.dropdownStatus}>
//           <option value="acceptO">Accept Order</option>
//           <option value="preparingO">Preparing Order</option>
//           <option value="preparingD">Preparing Delivery</option>
//           <option value="shipping">Shipping Item</option>
//           <option value="delivered">Item Delivered</option>
//         </select>
//       </div> */}
//         {/* <div className={styles.container2}>
//           <select className={styles.dropdownStatus} value={selectedStatus} onChange={handleStatusChange}>
//             {status.map((status, index) => (
//               <option key={index} value={status.purchaseStatus}>{status.purchaseStatus}</option>
//             ))}
//             <option value="+ Create New Status"> + Create New Status</option>
//           </select>
//         </div> */}
//         <div className="row ms-3">
//           <div>
//             <select className="mt-4 rounded text-center w-60 h-50" value={selectedStatus} onChange={handleStatusChange}>
//               <option key={1} value={props.PurchaseStatusID} selected="selected">{props.PurchaseStatus}</option>
//               {
//                 status.map((status, index) => {
//                   if (status.purchaseStatusID !== props.PurchaseStatusID) {
//                     return <option key={index + 2} value={status.purchaseStatusID}>{status.purchaseStatus}</option>
//                   }
//                 })
//               }
//               <option key={status.length + 2}> + Create New Status</option>
//             </select>
//           </div>
//         </div>
//       </div>


//       {newStatusPop && (
//         <div className={styles.newStatusBox}>
//           <div className={styles.newStatus}>
//             <h2 className="mb-4"> Create New Status </h2>
//             <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
//             <form onSubmit={handleSubmit}>
//               <label htmlFor="statusInput">Enter status name : </label> <br />
//               <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
//               <button type="submit" className={styles.createStatusBtn}> Create Status</button>
//             </form>

//           </div>
//         </div>
//       )}

//       {changedStatusPop && (
//         <div className={styles.newStatusBox}>
//           <div className={styles.newStatus}>
//             <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
//             <h5 className='mt-5'> Status has been changed successfully </h5>

//           </div>
//         </div>
//       )}
//     </div>

//   )
// };

export default function TrackOrder() {

  function OrderRow(props) {

    const [status, setStatus] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [newStatusPop, setNewStatusPop] = useState(false);
    const [statusInput, setStatusInput] = useState([]);

    const [changedStatusPop, setChangedStatusPop] = useState(false);

    const handleCloseStatusPop = () => {
      setNewStatusPop(false);
      setChangedStatusPop(false);
    }

    const handleInputChange = (event) => {
      setStatusInput(event.target.value);
    }

    const handleSubmit = (event) => {

      console.log("submitting status");
      // event.preventDefault();
      alert(`Sucessfully created new status: ${statusInput}`);

      axios.post(`${baseUrl}/api/trackOrder/purchaseStatus`, {
        purchaseStatus: statusInput
      })
        .then(res => {
          alert(`sucessfully created new status ${statusInput}`)
          setNewStat(false)
          console.log(res.data);
          setStatus((prevStatus) => [...prevStatus, res.data]);
          onSubmit(statusInput)
        })
        .catch((err) => {
          console.log(err);
        })
    }

    console.log(statusInput)

    useEffect(() => {
      axios.get(`${baseUrl}/api/trackOrder/purchaseStatus/all`)
        .then(res => {
          console.log(res.data)
          setStatus(res.data);
          setSelectedStatus(res.data[0]); //initial selected status
        })
        .catch(err => console.log(err));
    }, []);

    const poID = props.poID;

    const handleStatusChange = (event) => {
      setSelectedStatus(event.target.value);
      const selectedValue = event.target.value;
      console.log(event.target)
      console.log("value", selectedValue)

      if (selectedValue === "+ Create New Status") {
        setNewStatusPop(true);
      }
      // else if (selectedValue === "Preparing Order") {
      //   setChangedStatusPop(true);
      // }
      else {
        console.log('other options')
        axios.put(`${baseUrl}/api/trackOrder/purchaseOrderStatus/${poID}`, {
          purchaseStatusID: selectedValue,
        })
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })
        setChangedStatusPop(true);

      }
    };

    return (
      <div>
        <div className="d-flex w-5 h-5 rounded-4 mb-3" style={{ backgroundColor: '#C0D8F7' }}>
          <a href={baseURL + '/TrackOrder/' + props.poID}>
            <button className="border-0" style={{ backgroundColor: 'transparent' }}>
              <div className={styles.orderTextRow}>
                  {/* <div className="row ms-4">
                  <p>{props.poID}</p>
                </div> */}
                  <div className="row ms-4">
                    <p>{props.prID}</p>
                  </div>
                  <div className="row ms-5">
                    <p>{props.date}</p>
                  </div>
                  <div className="row ms-5">
                    <p>{props.Name}</p>
                  </div>
                  <div className="row ms-5">
                    <p>{props.Supplier}</p>
                  </div>
                </div>
            </button>
          </a>
          {/* <div className={styles.container2}>
          <select name="status" className={styles.dropdownStatus}>
            <option value="acceptO">Accept Order</option>
            <option value="preparingO">Preparing Order</option>
            <option value="preparingD">Preparing Delivery</option>
            <option value="shipping">Shipping Item</option>
            <option value="delivered">Item Delivered</option>
          </select>
        </div> */}
          {/* <div className={styles.container2}>
            <select className={styles.dropdownStatus} value={selectedStatus} onChange={handleStatusChange}>
              {status.map((status, index) => (
                <option key={index} value={status.purchaseStatus}>{status.purchaseStatus}</option>
              ))}
              <option value="+ Create New Status"> + Create New Status</option>
            </select>
          </div> */}
          <div className="row ms-2">
            <div>
              <select className="mt-4 rounded text-center w-60 h-50" value={selectedStatus} onChange={handleStatusChange}>
                <option key={1} value={props.PurchaseStatusID} selected="selected">{props.PurchaseStatus}</option>
                {
                  status.map((status, index) => {
                    if (status.purchaseStatusID !== props.PurchaseStatusID) {
                      return <option key={index + 2} value={status.purchaseStatusID}>{status.purchaseStatus}</option>
                    }
                  })
                }
                <option key={status.length + 2}> + Create New Status</option>
              </select>
            </div>
          </div>
        </div>


        {newStatusPop && (
          <div className={styles.newStatusBox}>
            <div className={styles.newStatus}>
              <h2 className="mb-4"> Create New Status </h2>
              <p onClick={handleCloseStatusPop} className={styles.closemeStatus}>X</p>
              <form onSubmit={handleSubmit}>
                <label htmlFor="statusInput">Enter status name : </label> <br />
                <input type="text" id="statusInput" value={statusInput} onChange={handleInputChange} /> <br />
                <button type="submit" className={styles.createStatusBtn}> Create Status</button>
              </form>

            </div>
          </div>
        )}

        {changedStatusPop && (
          <div className={styles.newStatusBox}>
            <div className={styles.newStatus}>
              <p onClick={handleCloseStatusPop} className={styles.closemeStatus1}>X</p>
              <h5 className='mt-5'> Status has been changed successfully </h5>

            </div>
          </div>
        )}
      </div>

    )
  };

  const [TrackOrderResults, orderList] = useState([(<div>Loading...</div>)]);

  // show all Track Order
  useEffect(() => {
    axios.all([
      axios.get(`${baseUrl}/api/trackOrder`, {})
    ])
      .then(axios.spread((response1) => {
        // console.log(response1.data);

        // get track order results
        const orderResult = response1.data;
        const trackOrderList = [];

        console.log(orderResult);
        console.log(orderResult[0].purchaseStatus)

        orderResult.forEach((item, index) => {
          // Time stamp formatting
          const reqDate = moment(orderResult[index].requestDate).format('DD/MM/YYYY');

          trackOrderList.push(
            <div key={index}>
              <OrderRow
                poID={item.poID}
                prID={item.prID}
                date={reqDate}
                Name={item.name}
                Supplier={item.supplierName}
                PurchaseStatus={item.purchaseStatus}
                PurchaseStatusID={item.purchaseStatusID}
              />
            </div>
          )
        });

        orderList(trackOrderList);

      }))
      .catch((err) => {
        console.log(err);
        if (err.response === 404) {
          alert(err.response.data);
        }
        else {
          alert(err.code);
        };
      });
  }, []);

  return (
    <>
      <div className="d-flex">
        <h1 className="w-75">Order Tracking</h1>
        <div>
          <div className={styles.searchContainer}>
            <form>
              <input type="text" placeholder="Search.." name="search" className={styles.searchBox} />
              <button type="submit" className={styles.searchButton}><Image src={searchIcon} /></button>
              <button type="submit" className={styles.searchButton}><Image src={filterIcon} width={20} /></button>
            </form>
          </div>
        </div>
      </div>

      <div>
        <hr />
        <ul className="col-sm-10 list-group list-group-horizontal text-center">
          {/* <li className="list-group-item col-sm-1 border-0">PO No.</li> */}
          <li className="list-group-item col-sm-1 border-0">PR No.</li>
          <li className="list-group-item col-sm-2 border-0">Created</li>
          <li className="list-group-item col-sm-2 border-0">Name</li>
          <li className="list-group-item col-sm-4 border-0">Supplier</li>
          <li className="list-group-item col-sm-5 border-0">Status</li>
        </ul>
        <hr />
      </div>

      <div className="col-sm-12">
        {TrackOrderResults}
      </div>

    </>
  )
};