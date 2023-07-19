import React, { useState } from 'react';
import axios from 'axios';
import styles from '../styles/calendar.module.css'

// function isLocalhost() {
//     if (typeof window !== 'undefined') {
//         const hostname = window.location.hostname;
//         console.log('hostname   ' + hostname);
//         if (hostname == 'localhost') {
//             URL.push('http://localhost:3000', 'http://localhost:5000');
//             console.log(URL);

//         }
//         else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
//             URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
//             console.log(URL);
//         }

//         return URL;
//     }
// }

// isLocalhost();

// const baseUrl = URL[0]

// import React, { useState } from 'react';
// import axios from 'axios';

const Popup = ({ event }) => {
  const [userId, setUserID] = useState('');
  const [titleName, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [viewAccessId, setViewAccessId] = useState('');

  const handleSubmit = async (e) => {
    
    console.log("submitting status");
    // event.preventDefault();
    alert(`Sucessfully created new status: ${statusInput}`);

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
          type="number"
          value={userId}
          onChange={(e) => setUserID(e.target.value)}
          placeholder="userid"
          required
        /><br></br>
      
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
