// Codeword.js
// Компонент установки логина для android-приложения
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom'; 
import './codeword.css'; 

const Codeword = () => {
  const { uuid } = useParams(); 
  const [userData, setUserData] = useState(null); 
  const [codeword, setCodeword] = useState(''); 
  const [notification, setNotification] = useState(''); 
  const [redirectToCodeword, setRedirectToCodeword] = useState(false); 

  useEffect(() => {
    // Получение значения cookie по имени
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)uuid\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!cookieValue) {
      // Перенаправление на сглавную при отсутствии cookie
      window.location.href = 'http://localhost:3000/start'; 
      return;
    }

    // Функция для получения данных пользователя
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Получение токена из localStorage
        if (!token) {
          console.error('Access token not found in localStorage');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/codeword/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}` // Передача токена в заголовке запроса
          }
        }); 
        setUserData(response.data); // Установка данных пользователя 
      } catch (error) {
        console.error('Ошибка при получении пользовательских данных:', error); 
      }
    };

    fetchUserData(); 
  }, [uuid]); 

  // Обработчик отправки формы
  const handleSubmitCodeword = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      console.error('Access token not found in localStorage'); 
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/codeword/${uuid}`, { codeword }, {
        headers: {
          Authorization: `Bearer ${token}` // Передача токена в заголовке запроса
        }
      });
      if (response.status === 200) {
        alert('Логин для android-приложения установлен успешно');
        setRedirectToCodeword(true); 
        window.location.href = 'http://localhost:3000/start'; 
      } else {
        alert('Ошибка: не удалось установить логин для android-приложения.'); 
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Ошибка на сервере: ${error.response.data.message}`); 
      } else {
        alert('Ошибка при отправке запроса'); 
      }
      setNotification('Ошибка при отправке запроса'); 
    }
  };

  // Обработчик изменения кодового слова
  const handleChangeCodeword = (event) => {
    setCodeword(event.target.value); 
  };

  if (!userData) {
    return <div>Загрузка...</div>; 
  }

  return (
    <div>
      <div className='shapochka'>
        <h1>Логин для android</h1> <hr></hr>
        <div className='photog'>
            <h2 className='ph'>
                <span className='zag'>Информация профиля: </span> <br/> 
                Login: <span className="data">{userData.login} </span> <br/> 
                Email: <span className="data">{userData.email} </span> <br/> 
                Name: <span className="data">{userData.name} </span></h2>
            {userData.photo_path && (
            <div className="pho">
                <img src={`${process.env.PUBLIC_URL}/images/${userData.photo_path}`} alt="photo" className="tot" />
            </div>
            )}
        </div>
     
      </div>
      <div className='formt'>
        <div className="codeForm">
          <form onSubmit={handleSubmitCodeword}>
            <h3 htmlFor="codewordInput">Придумайте логин для android-приложения:</h3>
            <input type="text" id="codewordInput" name="codewordInput" value={codeword} onChange={handleChangeCodeword} />
            <button type="submit" className='but'><span>Зарегистрироваться</span></button>
          </form>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
    </div>
  );
};

export default Codeword;