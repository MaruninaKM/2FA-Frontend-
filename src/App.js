import React, { useState } from 'react';
import { Navigate } from 'react-router-dom'; 
import axios from 'axios';
import './App.css';

function App() {
  const [activeForm, setActiveForm] = useState('reg');
  const [formData, setFormData] = useState({
    name: '',
    login: '',
    pass: '',
    email: ''
  });
  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(null);
  const [redirectAuth, setRedirectAuth] = useState(false);
  const [redirectAuthLogin, setRedirectAuthLogin] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = activeForm === 'reg' ? 'http://localhost:5000/api/register' : 'http://localhost:5000/api/authenticate';
    try {
      const response = await axios.post(url, formData);
      alert(response.data.message);
      const { login } = formData;
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 30); 
      const expirationString = expirationTime.toUTCString();
      document.cookie = `login=${login}; expires=${expirationString}; path=/`; 
      if (activeForm === 'reg') {
        setRedirectLogin(formData.login); 
        setRedirect(true); 
      } else {
        setRedirectAuthLogin(formData.login); 
        setRedirectAuth(true); 
      }
    } catch (error) {
      console.log(error);
      alert('Operation failed: ' + (error.response?.data?.message || 'An unexpected error occurred.'));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      
      <div className="shapka">
        <div className={`reg${activeForm === 'reg' ? '-active' : ''}`} onClick={() => setActiveForm('reg')}>
          <div className="tab">Регистрация</div>
        </div>
        <div className={`auth${activeForm === 'auth' ? '-active' : ''}`} onClick={() => setActiveForm('auth')}>
          <div className="tab">Авторизация</div>
        </div>
      </div>

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
                <input type="text" id="pass" name="pass" onChange={handleChange} />
              </div>
              <button type="submit" className="but"><span>Авторизоваться</span></button>            
            </form>
          </div>
        )}
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
                <input type="text" id="pass" name="pass" onChange={handleChange} />
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
      {redirect && redirectLogin && <Navigate to={`/photo/${redirectLogin}`} replace />}
      {redirectAuth && redirectAuthLogin && <Navigate to={`/autf/${redirectAuthLogin}`} replace />}
    </div>
  );
}

export default App;