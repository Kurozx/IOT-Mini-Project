"use client"; // This makes the component a Client Component

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from '../app/nav.module.css';

const notifyUser = (command) => {
  alert(`Command ${command} sent to the board successfully.`);
};

const updateLEDStatus = async (command, setStatus) => {
  try {
    const response = await fetch('/api/getControlCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await response.json();

    if (data.success) {
      setStatus(command !== 'OFF'); // Update the status based on the command
      notifyUser(command); // Notify the user of the successful command
    }
  } catch (error) {
    console.error('Error updating Command:', error);
    alert('Failed to send command to the board.');
  }
};

const fetchLEDStatus = async (setStatus) => {
  try {
    const response = await fetch('/api/getCurrentStatus', {
      method: 'GET',
    });

    const data = await response.json();

    if (data.success) {
      setStatus(data.isOn); // Assume the response has an `isOn` boolean property
    }
  } catch (error) {
    console.error('Error fetching current status:', error);
  }
};

const Navbar = () => {
  const [ledStatus, setLEDStatus] = useState(false);

  useEffect(() => {
    // Fetch the current LED status when the component loads
    fetchLEDStatus(setLEDStatus);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg ${styles.navbarCustom}`}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" href="./">
            <img src="img/logo.png" alt="LOGO" width="100" height="80"></img>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="./">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} href="/History">History</Link>
            </li>
          </ul>
          <form className="d-flex align-items-center">
            <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('RGB_ON', setLEDStatus)}>RGB ON</button>
            <button type="button" className={`btn ${styles.btnCustom} me-2`} onClick={() => updateLEDStatus('BUZZER_ON', setLEDStatus)}>On Buzzer</button>
            <button type="button" className={`btn ${styles.btnDanger}`} onClick={() => updateLEDStatus('OFF RGB AND BUZZER', setLEDStatus)}>Off Buzzer</button>
            
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
