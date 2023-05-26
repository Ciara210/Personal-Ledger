import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cell, Modal, Input, Button, Toast, FilePicker } from 'zarm';
import { get, post, imgUrlTrans } from '@/utils';

import s from './style.module.less';

const User = () => {
  const navigateTo = useNavigate();
  const [user, setUser] = useState({});
  const [signature, setSignature] = useState('');
  const [show, setShow] = useState(false);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo');
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar))
    setSignature(data.signature)
  };

  const confirmSig = async () => {
    const { data } = await post('/api/user/edit_signature', {
      signature: signature
    });
    setUser(data);
    setShow(false);
    Toast.show('Modified successfully');
  } ;

  const logout = async () => {
    localStorage.removeItem('token');
    navigateTo('/login');
  };

  return <div className={s.user}>
    <div className={s.head}>
      <div className={s.info}>
        <span>Nickname:{ user.username }</span>
        <span>
          <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
          <b>{ user.signature || 'No content' }</b>
        </span>
      </div>
      <img className={s.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={avatar} alt="" />
   </div>
   <div className={s.content}>
    <Cell
      hasArrow
      title="User information modification"
      onClick={() => navigateTo('/userinfo')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
    />
    <Cell
      hasArrow
      title="Remake Password"
      onClick={() => navigateTo('/account')}
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
    />
    {/* <Cell
      hasArrow
      title="My Tags"
      icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1619321650235/mytag.png" alt="" />}
    /> */}
   </div>
   <Button className={s.logout} block theme="danger" onClick={logout}>Logout</Button>
   <Modal
      visible={show}
      title="Title"
      closable
      onCancel={() => setShow(false)}
      footer={
        <Button block theme="primary" onClick={confirmSig}>
          Confirmation
        </Button>
      }
    >
    <Input
        autoHeight
        showLength
        maxLength={50}
        type="text"
        rows={3}
        value={signature}
        placeholder="Please enter note information"
        onChange={(val) => setSignature(val)}
        />
    </Modal>
  </div>
};

export default User;