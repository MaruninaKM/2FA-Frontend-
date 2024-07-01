import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, Link} from 'react-router-dom';


const Other = () => {
  const [userData, setUserData] = useState(null);
  const [code, setCode] = useState('');
  const { uuid } = useParams(); 

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    const cookieUuid = document.cookie.replace(/(?:(?:^|.*;\s*)uuid\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (!token || cookieUuid !== uuid) {
      window.location.href = 'http://localhost:3000/start';
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/other/${uuid}`, {
          headers: {
            Authorization: `Bearer ${token}`
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

  const handleSubmitCode = async (event) => {
    event.preventDefault();
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    try {
      const response = await axios.post(`http://localhost:5000/api/other/${uuid}`, { code }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data && response.data.success) {
        alert('Код верный');
        
      } else {
        alert('Ошибка: неверный код');
      }
    } catch (error) {

      if (error.response && error.response.data && error.response.data.message) {
        alert(`Ошибка на сервере: ${error.response.data.message}`);
      } else {
        alert('Ошибка при отправке запроса');
      }
      
    }
  };

  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };

  if (isLoading) {
    return <h1>Загрузка...</h1>;
  }


  return (
    <div>
      <div className='shapochka'>
        <h1>Приветствуем в системе</h1> <hr></hr>

        <div className='photog'>
          <h2 className='ph'>
            <span className='zag'>Информация профиля: </span> <br/>
            Login: <span className="data">{userData.login} </span> <br/>
            Email: <span className="data">{userData.email} </span> <br/>
            Name: <span className="data">{userData.name} </span></h2>
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
            
          <Link to="/start" className="buta"> <span>Выйти</span> </Link>
          </form>
        
        </div>
      </div>
    </div>
  );
};

export default Other;