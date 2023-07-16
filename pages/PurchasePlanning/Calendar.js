// import { formatDate } from '@fullcalendar/core'
// import FullCalendar from '@fullcalendar/react'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import { INITIAL_EVENTS, createEventId } from '../../components/event-utils'
// import styles from '../../styles/calendar.module.css'
// import axios from 'axios'
// import React, { useState } from "react";
// import Popup from '../../components/Popup'

// const URL = [];

// const [formData, setFormData] = useState({ title: '', startdate:'', endDate:'', description:''});



// export default class CalendarDisplay extends React.Component {



//     state = {
//         weekendsVisible: true,
//         currentEvents: []
//     }

//     render() {
//         const handleClick = (info) => {
//             setEventData(info.event);
//             setShowPopup(true);
//         }
//         return (
//             <div className='d-flex' style={{ textDecoration: 'none' }}>
//                 {this.renderSidebar()}
//                 <div className={styles.demoappmain}>
//                     <FullCalendar
//                         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                         headerToolbar={{
//                             left: 'prev,next today',
//                             center: 'title',
//                             right: 'dayGridMonth,timeGridWeek,timeGridDay'
//                         }}
//                         initialView='dayGridMonth'
//                         editable={true}
//                         selectable={true}
//                         selectMirror={true}
//                         dayMaxEvents={true}
//                         weekends={this.state.weekendsVisible}
//                         initialEvents={INITIAL_EVENTS} // alternatively, use the events setting to fetch from a feed
//                         // select={this.eventAdd}
//                         eventClick={handleClick}
//                         eventContent={renderEventContent} // custom render function
//                         // eventClick={this.handleEventClick}
//                         eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
//                     /* you can update a remote database when these fire:
//                     eventAdd={function(){}}
//                     eventChange={function(){}}
//                     eventRemove={function(){}}
//                     */
//                     eventAdd={this.handleAddEvent}
//                     />
//                 </div>
//             </div>
//         )
//     }





//     renderSidebar() {
//         return (
//             <div className={styles.demoappsidebar}>
//                 <div className={styles.demoappsidebarsection}>
//                     <h2>Instructions</h2>
//                     <ul>
//                         <li>Select dates and you will be prompted to create a new event</li>
//                         <li>Drag, drop, and resize events</li>
//                         <li>Click an event to delete it</li>
//                     </ul>
//                 </div>
//                 <div className={styles.demoappsidebarsection}>
//                     <label>
//                         <input
//                             type='checkbox'
//                             checked={this.state.weekendsVisible}
//                             onChange={this.handleWeekendsToggle}
//                         ></input>
//                         toggle weekends
//                     </label>
//                 </div>
//                 <div className={styles.demoappsidebarsection}>
//                     <h2>All Events ({this.state.currentEvents.length})</h2>
//                     <ul className={styles.list}>
//                         {this.state.currentEvents.map(renderSidebarEvent)}
//                     </ul>
//                 </div>
//             </div>
//         )
//     }

//     handleWeekendsToggle = () => {
//         this.setState({
//             weekendsVisible: !this.state.weekendsVisible
//         })
//     }




//     // handleAddEvent = (data) => {
//     //     // let header = prompt('Please enter a new title for your event')
//     //     const { planId, userId, title, startDate, endDate, description } = data


//     //     // if (header) {
//     //         try {
//     //             let result = axios.post(`${baseUrl}/api/purchasePlanning/purchasePlan`, {
//     //                 planID: planId,
//     //                 userID: userId,
//     //                 title: title,
//     //                 start_datetime: startDate,
//     //                 end_datetime: endDate,
//     //                 description: description
//     //             })
//     //             console.log(result)
//     //             if (result.status == 201) {
//     //                 alertToast({
//     //                     title: "Submitted Successfully",
//     //                     status: "success",
//     //                     duration: 3000,
//     //                     isClosable: true
//     //                 })
//     //             }
//     //         }
//     //         catch (error) {
//     //             console.log(error)
//     //         }
//     //     // }

//     // }

//     // handleDateSelect = (selectInfo) => {
//     //     let title = prompt('Please enter a new title for your event')
//     //     let calendarApi = selectInfo.view.calendar

//     //     calendarApi.unselect() // clear date selection

//     //     if (title) {
//     //         calendarApi.addEvent({
//     //             id: createEventId(),
//     //             title,
//     //             start: selectInfo.startStr,
//     //             end: selectInfo.endStr,
//     //             allDay: selectInfo.allDay
//     //         })
//     //     }
//     // }

//     handleEventClick = (clickInfo) => {
//         if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
//             clickInfo.event.remove()
//         }
//     }

//     handleEvents = (events) => {
//         this.setState({
//             currentEvents: events
//         })
//     }



// }

// function renderEventContent(eventInfo) {
//     return (
//         <>
//             <b className="ms-2">{eventInfo.timeText}</b>
//             <i>{eventInfo.event.title}</i>
//         </>
//     )
// }

// function renderSidebarEvent(event) {
//     return (
//         <li key={event.id}>
//             <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
//             <i>{event.title}</i>
//         </li>
//     )
// }

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

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        // dateClick={handleDateClick}
        selectable={true}
        select={handleSelect}
        events={events}
        eventClick={(info) => {
          if (window.confirm('Are you sure you want to delete this event?')) {
            deleteEvent(info.event.id);
          }
        }}
        
      />

      {showPopup && (
        <div className={styles.popup}>
          <p onClose={closePopup} className={styles.closemeStatus1}>X</p>
          <Popup range={selectedRange} />
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