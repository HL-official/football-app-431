// UserDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';

const UserDashboard = () => {
  const { user, token } = useContext(UserContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://your-api-endpoint/user/${user.id}/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUserData(data); // data contains favorite teams, players, etc.
    };

    if (user && token) fetchData();
  }, [user, token]);

  // ... render user data
};
