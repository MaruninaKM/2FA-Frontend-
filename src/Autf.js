import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './autf.css';

const Autf = () => {
  const [userData, setUserData] = useState(null);
  const [code, setCode] = useState('');
  const { login } = useParams();
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)login\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!cookieValue) {
      window.location.href = 'http://localhost:3000/';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/photo/${login}`); 
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [login]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/autf/${login}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [login]);

const handleSubmitCode = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/api/autf/${login}`, { code });
      if (response.data && response.data.success) {
        alert('Код верный');
        window.location.href = '/other-page';
      } else {
        alert('Ошибка: неверный код');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      alert('Ошибка при отправке запроса');
    }
  };

  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };

  if (!userData) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className='shapochka'>
        <h1>Данные пользователя</h1>
        <h2>Login: {userData.login} <br/> Email: {userData.email} <br/>Name: {userData.name} </h2>
      </div>
      <div className='formt'>
        <div className="codeForm">
          <form onSubmit={handleSubmitCode}>
            <h3 htmlFor="codeInput">Введите код:</h3>
            <input type="text" id="codeInput" name="codeInput" value={code} onChange={handleChangeCode} />
            <button type="submit" className='but'><span>Отправить код</span></button>
          </form>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
    </div>
  );
};

export default Autf;