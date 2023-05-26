import React from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import { createForm  } from 'rc-form';
import Header from '@/components/Header'
import { post } from '@/utils'

import s from './style.module.less'

const Account = (props) => {
  const { getFieldProps, getFieldError } = props.form;

  // Method of submitting changes
  const submit = () => {
    props.form.validateFields(async (error, value) => {
      if (!error) {
        console.log(value)
        if (value.newpass != value.newpass2) {
          Toast.show('New password input inconsistency');
          return
        }
        await post('/api/user/modify_pass', {
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_pass2: value.newpass2
        })
        Toast.show('Modified successfully')
      }
    });
  }

  return <>
    <Header title="Remake Password" />
    <div className={s.account}>
      <div className={s.form}>
        <Cell title="Original Password">
          <Input
            clearable
            type="text"
            placeholder="Please enter the original password"
            {...getFieldProps('oldpass', { rules: [{ required: true }] })}
          />
        </Cell>
        <Cell title="New Password">
          <Input
            clearable
            type="text"
            placeholder="Please enter a new password"
            {...getFieldProps('newpass', { rules: [{ required: true }] })}
          />
        </Cell>
        <Cell title="Confirm Password">
          <Input
            clearable
            type="text"
            placeholder="Please enter your new password here to confirm"
            {...getFieldProps('newpass2', { rules: [{ required: true }] })}
          />
        </Cell>
      </div>
      <Button className={s.btn} block theme="primary" onClick={submit}>Submit</Button>
    </div>
  </>
};

export default createForm()(Account);