import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/calendar.module.css'



const Popup = ({ event }) => {
  const [userId, setUserID] = useState('');
  const [titleName, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [viewAccessId, setViewAccessId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem("ID");
    if (storedUserId) {
      setUserID(parseInt(storedUserId, 10))
    }
  }, [])

  const handleSubmit = async (e) => {
    
   // event.preventDefault();
    
    const formData = {
      userID: userId,
      title: titleName,
      start_datetime: startDate,
      end_datetime: endDate,
      description: description,
      viewAccessID: viewAccessId
    };

    try {
      const response = await axios.post('http://localhost:3000/api/purchasePlan/purchasePlan', formData);


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

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="description"
          required
        /><br></br>
       
        <input
          type="number"
          value={viewAccessId}
          onChange={(e) => setViewAccessId(e.target.value)}
          placeholder="viewAccessId"
          required
        /><br></br>
        <button type="submit">Submit</button>
      </form>

      {/* <style jsx>{}</style> */}
    </div>
  );
};

export default Popup;
