import LoggedHeader from "./LoggedHeader";
import GuestHeader from "./GuestHeader";
import React, { useState,useEffect } from 'react';
import '../App.css.old';
import Navbar from "../global/Navbar";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [])

  const formatDate = (date) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${month}/${day}/${year}  ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div>
      <t1>
        Uniq-Quiz
      </t1>

      <footer>{formatDate(currentTime)}</footer>
    </div>
  );
}

export default App;