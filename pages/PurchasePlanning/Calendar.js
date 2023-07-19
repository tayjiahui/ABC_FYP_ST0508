import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from '../../components/Popup';
import styles from '../../styles/calendar.module.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Calendar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [events, setEvents] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(false);

  const handleSelect = (arg) => {
    setSelectedRange(arg);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    // setSelectedRange(null);
  };
  

  const getEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/purchasePlan/');
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
      const response = await axios.delete(`http://localhost:3000/api/purchasePlan/purchasePlan/${planID}`);
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

  useEffect(() => {
    getEvents();
  }, []);

  const handleDeleteConfirmation = (confirmDelete, planID) => {
    if (confirmDelete) {
      deleteEvent(planID);
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
          <div className="col-sm text-center mt-4" style={{flex: 1}}>
            <button onClick={() => handleDeleteConfirmation(true, deleteEventId)} className="col-sm ms-3 mt-2 w-50 border border-1 p-2 rounded-3 text-white" style={{backgroundColor: '#486284'}}>Delete</button>
            <button onClick={() => handleDeleteConfirmation(false)} className="col-sm ms-3 mt-3 w-50 border border-1 p-2 rounded-3 text-white" style={{backgroundColor: '#486284'}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
