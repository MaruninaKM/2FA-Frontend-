// Start.js
// Компонент регистрации и авторизации
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; 
import axios from 'axios'; 
import './App.css'; 

function Start() {
  // Состояние для формы в фокусе
  const [activeForm, setActiveForm] = useState('reg'); 
  // Данные формы
  const [formData, setFormData] = useState({ 
    name: '',
    login: '',
    pass: '',
    email: ''
  });
  // Состояние для перенаправления пользователя
  const [redirect, setRedirect] = useState(false); 
  // UUID пользователя при регистрации
  const [redirectUUID, setRedirectUUID] = useState(null); 
  // Перенаправление авторизованного пользователя
  const [redirectAuth, setRedirectAuth] = useState(false); 
  // UUID пользователя при авторизации
  const [redirectAuthUUID, setRedirectAuthUUID] = useState(null); 

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Определение URL в зависимости от формы в фокусе
    const url = activeForm === 'reg' ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/authenticate';
    try {
      // Отправка POST-запроса на сервер с данными 
      const response = await axios.post(url, formData);
      alert(response.data.message); // Вывод сообщения 
      const { uuid, access_token, refresh_token } = response.data;

      // Сохранение токенов и UUID пользователя в cookies
      document.cookie = `access_token=${access_token}; path=/`;
      document.cookie = `refresh_token=${refresh_token}; path=/`;
      document.cookie = `uuid=${uuid}; path=/`;

      // Сохранение токенов в localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('uuid', uuid);

      // Установка состояний в зависимости от формы в фокусе
      if (activeForm === 'reg') {
        setRedirectUUID(uuid);
        setRedirect(true);
      } else {
        setRedirectAuthUUID(uuid);
        setRedirectAuth(true);
      }
    } catch (error) {
      console.log(error);
      // Вывод сообщения об ошибке
      alert('Ошибка: ' + (error.response?.data?.message || 'Необработанное исключение.'));
    }
  };

  // Обработчик изменения значений в форме
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      {/* Шапка формы - переключение между регистрацией и авторизацией */}
      <div className="shapka">
        <div className={`reg${activeForm === 'reg' ? '-active' : ''}`} onClick={() => setActiveForm('reg')}>
          <div className="tab">Регистрация</div>
        </div>
        <div className={`auth${activeForm === 'auth' ? '-active' : ''}`} onClick={() => setActiveForm('auth')}>
          <div className="tab">Авторизация</div>
        </div>
      </div>
      {/* Авторизация */}
      <div className="form-wrap">
        {activeForm === 'auth' && (
          <div className="form" id="form1">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="login">Логин</label>
                <input type="text" id="login" name="login" onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="pass">Пароль</label>
                <input type="password" id="pass" name="pass" onChange={handleChange} />
              </div>
              <button type="submit" className="but"><span>Авторизоваться</span></button>
            </form>
          </div>
        )}
        {/* Регистрация */}
        {activeForm === 'reg' && (
          <div className="form" id="form2">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">Имя</label>
                <input type="text" id="name" name="name" onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="login">Логин</label>
                <input type="text" id="login" name="login" onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="pass">Пароль</label>
                <input type="password" id="pass" name="pass" onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" onChange={handleChange} />
              </div>
              <button type="submit" className="but"><span>Регистрация</span></button>
            </form>
          </div>
        )}
      </div>
      {/* Перенаправление */}
      {redirect && redirectUUID && <Navigate to={`/photo/${redirectUUID}`} replace />}
      {redirectAuth && redirectAuthUUID && <Navigate to={`/autf/${redirectAuthUUID}`} replace />}
    </div>
  );
}

export default Start;