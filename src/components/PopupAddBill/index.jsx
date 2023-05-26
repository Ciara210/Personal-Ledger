import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon, Toast, Keyboard, Modal, Input  } from 'zarm';
import cx from 'classnames'
import dayjs from 'dayjs'; 
import CustomIcon from '../CustomIcon'
import PopupDate from '../PopupDate'
import { get, typeMap, post } from '@/utils'

import s from './style.module.less';

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const dateRef = useRef()
  const id = detail && detail.id 
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState('expense'); // Type of expense or income
  const [expense, setExpense] = useState([]); // Expense type array
  const [income, setIncome] = useState([]); // Income type array
  const [currentType, setCurrentType] = useState({});
  const [amount, setAmount] = useState(''); // Billing Price
  const [remark, setRemark] = useState(''); // Remarks
  const [showRemark, setShowRemark] = useState(false); // Comments input box
  const [date, setDate] = useState(new Date()); // date
 

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }, [detail])

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      }
    }
  };

  useEffect(() => {
    getList()
  }, []);

  const getList = async () => {
    const { data: { list } } = await get('/api/type/list');
    const _expense = list.filter(i => i.type == 1); // Expense Type
    const _income = list.filter(i => i.type == 2); // Revenue Type
    setExpense(_expense);
    setIncome(_income);
    if (!id) {
      setCurrentType(_expense[0]);
    };
  }

  const changeType = (type) => {
    setPayType(type);
    if (type == 'expense') {
      setCurrentType(expense[0]);
    } else {
      setCurrentType(income[0]);
    }
  };

  // Date pop-up window
  const handleDatePop = () => {
    dateRef.current && dateRef.current.show()
  }

  // Date selection callback
  const selectDate = (val) => {
    setDate(val)
  }

  const choseType = (item) => {
    setCurrentType(item)
  }

  const handleMoney = (value) => {
    value = String(value)
    if (value == 'close') return 
    if (value == 'delete') {
      let _amount = amount.slice(0, amount.length - 1)
      setAmount(_amount)
      return
    }
    if (value == 'ok') {
      addBill()
      return
    }
    if (value == '.' && amount.includes('.')) return
    if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return
    setAmount(amount + value)
  }
  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show('Please enter the exact amount')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType == 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (id) {
      params.id = id;
      const result = await post('/api/bill/update', params);
      Toast.show('Modified successfully');
    } else {
      const result = await post('/api/bill/add', params);
      setAmount('');
      setPayType('expense');
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark('');
      Toast.show('Added successfully');
    }
    setShow(false);
    if (onReload) onReload();
  }

  return <Popup
    visible={show}
    direction="bottom"
    onMaskClick={() => setShow(false)}
    destroy={false}
    mountContainer={() => document.body}
  >
    <div className={s.addWrap}>
      <header className={s.header}>
        <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
      </header>
      <div className={s.filter}>
        <div className={s.type}>
          <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
          <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
        </div>
        <div className={s.time} onClick={handleDatePop}>{dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom" /></div>
      </div>
      <div className={s.money}>
        <span className={s.sufix}>¥</span>
        <span className={cx(s.amount, s.animation)}>{amount}</span>
      </div>
      <div className={s.typeWarp}>
        <div className={s.typeBody}>
          {
            (payType == 'expense' ? expense : income).map(item => <div onClick={() => choseType(item)} key={item.id} className={s.typeItem}>
              <span className={cx({[s.iconfontWrap]: true, [s.expense]: payType == 'expense', [s.income]: payType == 'income', [s.active]: currentType.id == item.id})}>
                <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
              </span>
              {/* <span>{item.name}</span> */}
            </div>)
          }
        </div>
      </div>
      <div className={s.remark}>
        {
          showRemark ? <Input
            autoHeight
            showLength
            maxLength={50}
            type="text"
            rows={3}
            value={remark}
            placeholder="Please enter note information"
            onChange={(val) => setRemark(val)}
            onBlur={() => setShowRemark(false)}
          /> : <span onClick={() => setShowRemark(true)}>{remark || 'Add a note'}</span>
        }
      </div>
      <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
      <PopupDate ref={dateRef} onSelect={selectDate} />
    </div>
  </Popup>
});

PopupAddBill.propTypes = {
  detail: PropTypes.object,
  onReload: PropTypes.func
}

export default PopupAddBill;