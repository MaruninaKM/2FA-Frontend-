import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const App = () => {


  return (
    <>
      <div className='shapochka'>
        <h1>Описание приложения</h1> 

      </div>
    
      <div className='formt'>
        
         
            <h3 className="codeInput">Данная выпускная работа посвящена разработке веб-приложения для обеспечения повышенного уровня безопасности с помощью двухфакторной аутентификации. Цель работы заключается в создании надежного и практичного приложения, обеспечивающего дополнительный уровень проверки личности пользователя. В результате проделанной работы было реализовано два различных способа аутентификации, такие как пароль и одноразовый код, полученный в android-приложении на заранее зарегистрированном устройстве пользователя.</h3>
           
            <Link to="/start" className="buta">
            <span>Перейти к регистрации</span>
          </Link>
       
         
      
      </div>


    </>
  );
};

export default App;