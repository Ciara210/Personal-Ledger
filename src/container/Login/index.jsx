import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Cell, Input, Button, Checkbox, Toast } from 'zarm';
import cx from 'classnames';
import CustomIcon from '@/components/CustomIcon';
import Captcha from "react-captcha-code";
import { post } from '@/utils'

import s from './style.module.less';

const Login = () => {
  const captchaRef = useRef();
  const [type, setType] = useState('login'); 
  const [captcha, setCaptcha] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [verify, setVerify] = useState(''); 

  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, []);
  
  const onSubmit = async () => {
    if (!username) {
      Toast.show('Please enter your account number')
      return
    }
    if (!password) {
      Toast.show('Please enter your password')
      return
    }
    try {
      if (type == 'login') {
        const { data } = await post('/api/user/login', {
          username,
          password
        });
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        if (!verify) {
          Toast.show('Please enter the verification code')
          return
        };
        if (verify != captcha) {
          Toast.show('Captcha error')
          return
        };
        const { data } = await post('/api/user/register', {
          username,
          password
        });
        Toast.show('Register successfully');
         setType('login');
      }
    } catch (err) {
      Toast.show(err.msg);
    }
  };

  useEffect(() => {
    document.title = type == 'login' ? 'Login' : 'Registration';
  }, [type])
  return <div className={s.auth}>
    <div className={s.head} />
    <div className={s.tab}>
      <span className={cx({ [s.avtive]: type == 'login' })} onClick={() => setType('login')}>Login</span>
      <span className={cx({ [s.avtive]: type == 'register' })} onClick={() => setType('register')}>Registration</span>
    </div>
    <div className={s.form}>
      <Cell icon={<CustomIcon type="zhanghao" />}>
        <Input
          clearable
          type="text"
          placeholder="Please enter your account number"
          onChange={(value) => setUsername(value)}
        />
      </Cell>
      <Cell icon={<CustomIcon type="mima" />}>
        <Input
          clearable
          type="password"
          placeholder="Please enter your password"
          onChange={(value) => setPassword(value)}
        />
      </Cell>
      {
        type == 'register' ? <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="text"
            placeholder="Please enter the verification code"
            onChange={(value) => setVerify(value)}
          />
          <Captcha ref={captchaRef} charNum={4} onChange={handleChange} />
        </Cell> : null
      }
    </div>
    <div className={s.operation}>
      <Button onClick={onSubmit} block theme="primary">{type == 'login' ? 'Login' : 'register'}</Button>
    </div>
  </div>
};

export default Login;