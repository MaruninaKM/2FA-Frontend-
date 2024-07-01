// Autf.js
// Компонент для аутентификации
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom'; 
import './autf.css'; 

const Autf = () => {
  const [userData, setUserData] = useState(null); 
  const [code, setCode] = useState(Array(6).fill('')); 
  // Количество попыток
  const [attempts, setAttempts] = useState(0); 
  // Блокировка ввода после неудач
  const [isBlocked, setIsBlocked] = useState(false); 
  const { uuid } = useParams(); 
  const [notification, setNotification] = useState(''); 
  const [isLoading, setIsLoading] = useState(true); 
  const [redirectToCodeword, setRedirectToCodeword] = useState(false); 
  const [redirectToStart, setRedirectToStart] = useState(false); 
  const inputsRef = useRef([]); // Реф для хранения ссылок на input элементы

  useEffect(() => {
    // Функция для получения значения cookie по имени
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const cookieUuid = document.cookie.replace(/(?:(?:^|.*;\s*)uuid\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    // Перенаправление на начальную страницу, если токен или uuid не совпадают
    if (!token || cookieUuid !== uuid) {
      setRedirectToStart(true);
      return;
    }

    // Функция для получения данных пользователя
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/autf/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}` // Передача токена в заголовке запроса
          }
        });
        setUserData(response.data); 
      } catch (error) {
        console.error('Ошибка при получении пользовательских данных:', error); 
      } finally {
        setIsLoading(false); 
      }
    };

    if (isLoading) {
      fetchUserData(); 
    }
  }, [uuid, isLoading]); 

  // Обработчик отправки кода
  const handleSubmitCode = async (event) => {
    event.preventDefault();
    if (isBlocked) return; // Если блокировка активна, отправка формы невозможна

    const fullCode = code.join(''); 
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    try {
      const response = await axios.post(`http://localhost:5000/api/autf/${uuid}`, { code: fullCode }, {
        headers: {
          Authorization: `Bearer ${token}` // Передача токена в заголовке запроса
        }
      });
      if (response.data && response.data.success) {
        alert('Код верный');
        setRedirectToCodeword(true); 
      } else {
        alert('Ошибка: неверный код'); 
        setAttempts(prevAttempts => prevAttempts + 1); // Увеличение счетчика
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Ошибка на сервере: ${error.response.data.message}`); 
      } else {
        alert('Ошибка при отправке запроса'); 
      }
      setAttempts(prevAttempts => prevAttempts + 1); // Увеличение счетчика
    }
  };

  useEffect(() => {
    if (attempts > 0) {
      const blockDuration = attempts * 5; // Время блокировки 
      setIsBlocked(true);
      setNotification(`Повторите попытку через ${blockDuration} секунд`);

      const timer = setTimeout(() => {
        setIsBlocked(false);
        setNotification('');
      }, blockDuration * 1000);

      return () => clearTimeout(timer); // Очистка таймера 
    }
  }, [attempts]); 

  // Обработчик изменения кода
  const handleChangeCode = (index, value) => {
    if (/^[0-9]?$/.test(value)) { // Проверка, что введенное значение - цифра
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== '' && index < 5) {
        inputsRef.current[index + 1].focus(); // Переход к следующему input при вводе цифры
      }
    }
  };

  if (isLoading) {
    return <h1>Загрузка...</h1>; 
  }

  if (redirectToStart) {
    return <Navigate to="/start" />; 
  }

  if (!userData) {
    return <h1>Нет данных пользователя...</h1>; 
  }
  if (redirectToCodeword) {
    return <Navigate to={`/other/${uuid}`} />; 
  }


  return (
    <div>
      <div className='shapochka'>
        <h1>Введите проверочный код</h1> <hr></hr>
        <div className='photog'>
          <h2 className='ph'>
            <span className='zag'>Информация профиля: </span> <br/>
            Логин: <span className="data">{userData.login} </span> <br/>
            Email: <span className="data">{userData.email} </span> <br/>
            Имя: <span className="data">{userData.name} </span></h2>
            {userData.photo_path && (
              <div className="pho">
                <img src={`${process.env.PUBLIC_URL}/images/${userData.photo_path}`} alt="photo" className="tot"/>
              </div>
            )}
          </div>
      </div>
      <div className='formt'>
        <div className="codeForm">
          <form onSubmit={handleSubmitCode}>
            <h3>Введите код:</h3>
            <div className="codeInputs">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  maxLength="1"
                  onChange={(e) => handleChangeCode(index, e.target.value)}
                  disabled={isBlocked}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className="codeInput"
                />
              ))}
            </div>
            <button type="submit" className='but' disabled={isBlocked}><span>Отправить код</span></button>
          </form>
          {notification && <div className="notification">{notification}</div>}
        </div>
      </div>
    </div>
  );
};

export default Autf;