
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Popup from '../../components/Popup';
import styles from '../../styles/calendar.module.css';
import axios from 'axios';

const Calendar = () => {
  const [showPopup, setShowPopup] = useState();
  const [selectedRange, setSelectedRange] = useState(null);
  const [events, setEvents] = useState([]);

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
          id: event.userID,
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
        getEvents(); // Fetch events again after deletion to update the calendar
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

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <h6>{eventInfo.event.title}</h6>
        <h8>{eventInfo.event.extendedProps.description}</h8>
      </>
    );
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // dateClick={handleDateClick}
        selectable={true}
        displayEventTime={false}
        select={handleSelect}
        events={events}
        eventContent={renderEventContent} // Custom event rendering function
        eventClick={(info) => {
          if (window.confirm('Are you sure you want to delete this event?')) {
            deleteEvent(info.event.id);
          }
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
    </div>
  );
};

export default Calendar;




// sub for deployment build

// export default function Index() {
//     return (
//         <div></div>
//     );
// };