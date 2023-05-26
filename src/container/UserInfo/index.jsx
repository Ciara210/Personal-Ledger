import React, { useEffect, useState } from 'react';
import { Button, FilePicker, Input, Toast } from 'zarm';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import axios from 'axios';
import { get, post, imgUrlTrans } from '@/utils'
import { baseUrl } from 'config'
import s from './style.module.less';

const UserInfo = () => {
  const navigateTo = useNavigate()
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState('')
  const [signature, setSignature] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const { data } = await get('/api/user/get_userinfo');
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar))
    setSignature(data.signature)
  };

  const handleSelect = (file) => {
    console.log('file.file', file.file)
    if (file && file.file.size > 200 * 1024) {
      Toast.show('Upload avatar must not exceed 200 KB!')
      return
    }
    let formData = new FormData()
    formData.append('file', file.file)
    axios({
      method: 'post',
      url: `${baseUrl}/api/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then(res => {
      setAvatar(imgUrlTrans(res.data))
    })
  }

  const save = async () => {
    const { data } = await post('/api/user/edit_userinfo', {
      signature,
      avatar
    });

    Toast.show('Modified successfully')
    navigateTo(-1)
  }

  return <>
    <Header title='User Information' />
    <div className={s.userinfo}>
      <h1>Personal Information</h1>
      <div className={s.item}>
        <div className={s.title}>Avatar</div>
        <div className={s.avatar}>
          <img className={s.avatarUrl} src={avatar} alt=""/>
          <div className={s.desc}>
            <span>Support jpg, png, jpeg format images up to 200KB in size</span>
            <FilePicker className={s.filePicker} onChange={handleSelect} accept="image/*">
              <Button className={s.upload} theme='primary' size='xs'>Click to upload</Button>
            </FilePicker>
          </div>
        </div>
      </div>
      <div className={s.item}>
        <div className={s.title}>Personalized Signature</div>
        <div className={s.signature}>
          <Input
            clearable
            type="text"
            value={signature}
            placeholder="Please enter a personalized signature"
            onChange={(value) => setSignature(value)}
          />
        </div>
      </div>
      <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>Save</Button>
    </div>
  </>
};

export default UserInfo;