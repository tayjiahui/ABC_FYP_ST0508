import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import axios from 'axios';
import styles from '../styles/calendar.module.css'

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



const Popup = ({ event }) => {
  const [userId, setUserID] = useState('');
  const [titleName, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [viewAccess, setViewAccess] = useState('');
  // const [viewAccessID, setViewAccessID] = useState([]);
  const [showFirstPopup, setShowFirstPopup] = useState(true);
  const [showSecondPopup, setShowSecondPopup] = useState(false);
  const [Token, setToken] = useState();
  const [viewAccessOptions, setViewAccessOptions] = useState([]);

  useEffect(() => {

    // set user token 
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("ID");
    if (storedUserId) {
      setUserID(parseInt(storedUserId, 10))
    }
  }, [])

  useEffect(() => {
    //fetch view access options 
    axios.get(`${baseUrl}/api/purchasePlan/viewAccess`, {
      headers: {
        authorization: 'Bearer ' + Token,
      },
    })
      .then(res => {
        setViewAccessOptions(res.data); //store in statea
      })
      .catch(err => {
        console.log('error fetching options: ', err);
        if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
          localStorage.clear();
          signOut({ callbackUrl: '/Unauthorised' });
        }
        else {
          console.log(err);
        };
      })
  })



  const handleSubmit = async (event) => {

    event.preventDefault();
    // Handle any form submission logic here
    setShowFirstPopup(false);
    setShowSecondPopup(true); // Show the second pop-up after submission

    console.log('selected view access: ', viewAccess)

    axios.get(`${baseUrl}/api/purchasePlan/access/${viewAccess}`, {
      headers: {
        authorization: 'Bearer ' + Token,
      },
    })
      .then(res => {
        console.log('View Access ID: ', res.data[0].viewAccessID);
        const viewAccessID = res.data[0].viewAccessID

        axios.post(`${baseUrl}/api/purchasePlan/purchasePlan`, {
          userID: userId,
          title: titleName,
          start_datetime: startDate,
          end_datetime: endDate,
          description: description,
          viewAccessID: viewAccessID
        })
          .then(res => {
            console.log('data inserted!');
          })
          .catch(err => {
            console.log('data insert error!');
            if (err.response.status === 400 || err.response.status === 401 || err.response.status === 403) {
              localStorage.clear();
              signOut({ callbackUrl: '/Unauthorised' });
            }
            else {
              console.log(err);
            };
          })

      })

    setTimeout(function () {
      window.location.reload();
    }, 2000);
  };

  return (
    <div>
      {showFirstPopup && (
        <div>
          <h4 className="mb-4">Add your new event here!</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={titleName}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
              required
            /><br></br>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="startdate"
              required
            /><br></br>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="enddate"
              required
            /><br></br>

            <textarea
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="description"
              required
            ></textarea><br></br>

            <label htmlFor="viewAccess">Select View Access:</label>
            <select
              id="viewAccess"
              value={viewAccess}
              onChange={(e) => setViewAccess(e.target.value)}
              required
              className={styles.viewAccessSelect}
            >
              <option value="">Select View</option>
              {viewAccessOptions.map(option => (
                <option key={option.viewAccess} value={option.viewAccess}>
                  {option.viewAccess}
                </option>
              ))}
            </select>
            <br />

            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {showSecondPopup && (
        <div className={styles.newStatusBox}>
          <h5 className={styles.secondPopUp}> Purchase plan submitted successfully! </h5>
        </div>
      )}

      {/* <style jsx>{}</style> */}
    </div>
  );
};

export default Popup;
