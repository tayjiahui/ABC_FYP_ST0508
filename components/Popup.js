import React, { useState, useEffect } from 'react';
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
  const [viewAccessId, setViewAccessId] = useState('');
  const [showFirstPopup, setShowFirstPopup] = useState(true);
  const [showSecondPopup, setShowSecondPopup] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("ID");
    if (storedUserId) {
      setUserID(parseInt(storedUserId, 10))
    }
  }, [])

  const handleSubmit = async (event) => {

    event.preventDefault();
    // Handle any form submission logic here
    setShowFirstPopup(false);
    setShowSecondPopup(true); // Show the second pop-up after submission

    setTimeout(function(){
      window.location.reload();
   }, 2000);

    const formData = {
      userID: userId,
      title: titleName,
      start_datetime: startDate,
      end_datetime: endDate,
      description: description,
      viewAccessID: viewAccessId
    };

    try {
      const response = await axios.post(`${baseUrl}/api/purchasePlan/purchasePlan`, formData);

      if (response.status === 200) {
        console.log('Data inserted successfully!');
      } else {
        console.error('Error inserting data!');
      }
    } catch (error) {
      console.error('Error:', error);
    }

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

            <input
              type="number"
              value={viewAccessId}
              onChange={(e) => setViewAccessId(e.target.value)}
              placeholder="viewAccessId"
              required
            /><br></br>
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
