import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; 
import './photo.css';

const Photo = () => {
  const { login } = useParams(); 
  const [userData, setUserData] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null); 

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setSelectedFileUrl(blobUrl);
      setFile(file); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`http://localhost:5000/api/photo/${login}`, formData);
      alert('Фото успешно загружено');
      window.location.href = 'http://localhost:3000/';
      console.log(response.data);
      
    } catch (error) {
      alert('Ошибка загрузки файла: ' + (error.response?.data?.message || 'Произошла непредвиденная ошибка'));
      console.error('Ошибка загрузки файла:', error);
    }
  };

  
  useEffect(() => {
    const handleBeforeUnload = () => {
      document.cookie = 'login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='shapochka'>
        <h1>Фотография профиля</h1>
        <div className='photog'>
          <h2>Login: {userData.login} <br/> Email: {userData.email} <br/>Name: {userData.name} </h2>
          {selectedFileUrl && (
            <div className='pho'>
              <img src={selectedFileUrl} alt="Selected" className='tot' />
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