import React, { useState, useEffect } from 'react';
import { signOut } from "next-auth/react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from '../../components/Popup';
import styles from '../../styles/calendar.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AlertBox from "../../components/alert";
// Base urls
const URL = [];

function isLocalhost() {
  if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname == 'localhost') {
          URL.push('http://localhost:3000', 'http://localhost:5000');
      }
      else if (hostname == 'abc-cooking-studio.azurewebsites.net') {
          URL.push('https://abc-cooking-studio-backend.azurewebsites.net', 'https://abc-cooking-studio.azurewebsites.net');
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
  const [deleteEventAlert, setDeleteEventAlert] = useState(false);
  const [createEventAlert, setCreateEventAlert] = useState(false);

  const [Token, setToken] = useState();
  const [userId, setUserID] = useState('');

  const handleSelect = (arg) => {
    setSelectedRange(arg);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    // setSelectedRange(null);
  };

  function alertTimer() {
    setTimeout(alertClose, 3000);
  }

  function alertClose() {
    setDeleteEventAlert(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);

    const storedUserId = parseInt(localStorage.getItem("ID"), 10);
    setUserID(storedUserId)
    getEvents(token, storedUserId);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get(`${baseUrl}/api/purchasePlan/viewAccess`, {
      headers: {
        user: userId,
        authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        console.log(res.data)
      });
  }, []);

  const getEvents = async (token, userID) => {
    try {
      const response = await axios.get(`${baseUrl}/api/purchasePlan/`, {
        headers: {
          user: userId,
          authorization: 'Bearer ' + token,
        },
      });
      console.log(response.status);
      if (response.status === 200) {
        console.log("klnf", response.data);
        const formattedEvents = response.data
          .filter((event, index, arr) => {
            console.log(event)
            console.log(index)
            if (event.viewAccessID === 1) {
              console.log("dlfjlwjw", event.userID);
              console.log(userID);
              if (event.userID !== userID) {
                return false;
              } else {
                return true;
              }
              // return event.userID === userId;
            } else {
              return true; // public event
            }
          })
          .map((event) => ({
            id: event.planID,
            title: event.title,
            start: event.start_datetime,
            end: event.end_datetime,
            description: event.description,
          }));
        setEvents(formattedEvents);
      } else {
        console.error('Error fetching events:', response.statusText);
      }
    } catch (error) {
      console.log(error)
      // if (error.response.status === 401 || error.response.status === 403) {
      //   localStorage.clear();
      //   signOut({ callbackUrl: '/Unauthorised' });
      // }
      // else {
      //   console.log(error);
      // };
    }
  };

  const deleteEvent = async (planID) => {
    try {
      const response = await axios.delete(`${baseUrl}/api/purchasePlan/purchasePlan/${planID}`);
      if (response.status === 200) {
        console.log('Event deleted successfully!');
        // getEvents(); // Fetch events again after deletion to update the calendar

      } else {
        console.error('Error deleting event:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      // if (error.response.status === 401 || error.response.status === 403) {
      //   localStorage.clear();
      //   signOut({ callbackUrl: '/Unauthorised' });
      // }
      // else {
      //   console.log(error);
      // };
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <div className={styles.impt}>
        <p className="ms-2 me-3 fw-bold fs-5">{eventInfo.event.title}</p>
        <p className={styles.des}>{eventInfo.event.extendedProps.description}</p>
      </div>
    );
  };

  const handleDeleteConfirmation = (confirmDelete, planID) => {
    if (confirmDelete) {
      deleteEvent(planID);
      setDeleteEventAlert(true);
      alertTimer();
      window.location.reload();
    };
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


      {deleteEventAlert && (
        <AlertBox
          Show={deleteEventAlert}
          Message={`Event Successfully Deleted`}
          Type={`success`}
          Redirect={`/PurchasePlanning/Calendar`} />
      )}



    </div>
  );
};

export default Calendar;
