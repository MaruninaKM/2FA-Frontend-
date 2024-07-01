import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Navigate } from 'react-router-dom'; 
import './photo.css'; 

const Photo = () => {
  // UUID из URL
  const { uuid } = useParams(); 
  // Данные пользователя
  const [userData, setUserData] = useState(null); 
  // Фотография
  const [file, setFile] = useState(null); 
  const [selectedFileUrl, setSelectedFileUrl] = useState(null); 
  // Перенаправление на страницу codeword
  const [redirectToCodeword, setRedirectToCodeword] = useState(false); 
  // Токен
  const [accessToken, setAccessToken] = useState(''); 

  useEffect(() => {
    // Функция для получения cookie 
    const getCookieValue = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    // Получение токена из cookies
    const token = getCookieValue('access_token'); 
    const uuidFromCookie = getCookieValue('uuid'); 

    // Проверка наличия токена иначе вылет на страницу регистрации
    if (!token || uuid !== uuidFromCookie) {
      window.location.href = 'http://localhost:3000/start'; 
      return;
    }

    setAccessToken(token); // Установка токена доступа в состояние

    // Функция для получения данных пользователя
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/photo/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}` // Передача токена в заголовке запроса
          }
        });
        setUserData(response.data); 
      } catch (error) {
        console.error('Ошибка при получении пользовательских данных:', error); 
      }
    };

    fetchUserData(); 
  }, [uuid]); 

  // Выбор файла
  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      const blobUrl = URL.createObjectURL(file); 
      setSelectedFileUrl(blobUrl); 
      setFile(file); 
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file); 
    try {
      const response = await axios.post(`http://localhost:5000/api/photo/${uuid}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}` // Передача токена в заголовке запроса
        }
      });
      alert('Фото успешно загружено'); 
      setRedirectToCodeword(true); 
      console.log(response.data); 
    } catch (error) {
      alert('Ошибка загрузки файла: ' + (error.response?.data?.message || 'Произошла непредвиденная ошибка')); // Вывод сообщения об ошибке при неудачной загрузке
      console.error('Ошибка загрузки файла:', error); 
    }
  };

  useEffect(() => {
    // Функция для удаления cookies при закрытии или обновлении страницы
    const handleBeforeUnload = () => {
      document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'uuid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };
    window.addEventListener('beforeunload', handleBeforeUnload); 

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); 
    };
  }, []);

  if (!userData) {
    return <div>Загрузка...</div>; // Отображение текста загрузки, пока данные пользователя не получены
  }

  if (redirectToCodeword) {
    return <Navigate to={`/codeword/${uuid}`} replace />; // Перенаправление на страницу codeword
  } 

  return (
    <div>
      <div className='shapochka'>
        <h1>Фотография профиля</h1>  <hr></hr>
        <div className='photog'>
          <h2 className='ph'>
            <span className='zag'>Информация профиля:</span> <br/>
            Login: <span className="data">{userData.login}</span> <br/>
            Email: <span className="data">{userData.email}</span> <br/>
            Name:  <span className="data">{userData.name}</span></h2>
          {selectedFileUrl && (
            <div className='pho'>
              <img src={selectedFileUrl} alt="photo" className='tot' />
            </div>
          )}
        </div>
      </div>
      <div className='formt'>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit" className='but'><span>Загрузить</span></button>
        </form>
      </div>
    </div>
  );
};

export default Photo;