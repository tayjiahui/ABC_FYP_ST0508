import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from '../../components/Popup';
import styles from '../../styles/calendar.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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

const Calendar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [events, setEvents] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(false);

  const [Token, setToken] = useState();

  const handleSelect = (arg) => {
    setSelectedRange(arg);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    // setSelectedRange(null);
  };

  useEffect(() => {

    // set user token 
    const token = localStorage.getItem('token');
    setToken(token);

    getEvents(token);
  }, []);

  const getEvents = async (token) => {
    try {
      const response = await axios.get(`${baseUrl}/api/purchasePlan/`,
        {
          headers: {
            authorization: 'Bearer ' + token
          }
        }
      );
      if (response.status === 200) {
        const formattedEvents = response.data.map((event) => ({
          id: event.planID,
          title: event.title,
          start: event.start_datetime,
          end: event.end_datetime,
          description: event.description
        }));
        setEvents(formattedEvents);
      } else {
        console.error('Error fetching events:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteEvent = async (planID) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/purchasePlan/purchasePlan/${planID}`);
      if (response.status === 200) {
        console.log('Event deleted successfully!');
        // getEvents(); // Fetch events again after deletion to update the calendar
        window.location.reload();
      } else {
        console.error('Error deleting event:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <p className="ms-2 me-3 fw-bold">{eventInfo.event.title}</p>
        <p>{eventInfo.event.extendedProps.description}</p>
      </>
    );
  };

  const handleDeleteConfirmation = (confirmDelete, planID) => {
    if (confirmDelete) {
      deleteEvent(planID);
      window.location.reload();
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        displayEventTime={false}
        select={handleSelect}
        events={events}
        eventClick={(info) => {
          setShowDeleteConfirmation(true);
          setDeleteEventId(info.event.id);
        }}
        eventContent={renderEventContent}
      />

      {showPopup && (
        <div className={styles.newStatusBox}>
          <div className={styles.newStatus}>
            <p onClick={closePopup} className={styles.closemeStatus1}>X</p>
            <Popup range={selectedRange} />
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className={styles.deleteConfirmationBox}>
          <h4>Are you sure you want to delete this event?</h4>
          <div className="col-sm text-center mt-4" style={{ flex: 1 }}>
            <button onClick={() => handleDeleteConfirmation(true, deleteEventId)} className="col-sm ms-3 mt-2 w-50 border border-1 p-2 rounded-3 text-white" style={{ backgroundColor: '#486284' }}>Delete</button>
            <button onClick={() => handleDeleteConfirmation(false)} className="col-sm ms-3 mt-3 w-50 border border-1 p-2 rounded-3 text-white" style={{ backgroundColor: '#486284' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
