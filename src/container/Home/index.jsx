import React, { useEffect, useRef, useState } from 'react'
import { Icon, Pull } from 'zarm'
import dayjs from 'dayjs'
import PopupType from '@/components/PopupType'
import PopupDate from '@/components/PopupDate'
import PopupAddBill from '@/components/PopupAddBill'
import BillItem from '@/components/BillItem'
import Empty from '@/components/Empty'
import CustomIcon from '@/components/CustomIcon'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils'

import s from './style.module.less'

const Home = () => {
  const typeRef = useRef(); 
  const monthRef = useRef(); 
  const addRef = useRef(); 
  const [totalExpense, setTotalExpense] = useState(0); 
  const [totalIncome, setTotalIncome] = useState(0); 
  const [currentSelect, setCurrentSelect] = useState({}); 
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'));
  const [page, setPage] = useState(1); 
  const [list, setList] = useState([]); 
  const [totalPage, setTotalPage] = useState(0); 
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); 
  const [loading, setLoading] = useState(LOAD_STATE.normal); 

  useEffect(() => {
    getBillList() 
  }, [page, currentSelect, currentTime])

  const getBillList = async () => {
    const { data } = await get(`/api/bill/list?date=${currentTime}&type_id=${currentSelect.id || 'all'}&page=${page}&page_size=5`);
    if (page == 1) {
      setList(data.list);
    } else {
      setList(list.concat(data.list));
    }
    setTotalExpense(data.totalExpense.toFixed(2));
    setTotalIncome(data.totalIncome.toFixed(2));
    setTotalPage(data.totalPage);
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  }

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    };
  };

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
  }

  const toggle = () => {
    typeRef.current && typeRef.current.show()
  };
  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  };
  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentSelect(item)
  }
   const selectMonth = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(item)
  }

  return <div className={s.home}>
    <div className={s.header}>
      <div className={s.dataWrap}>
        <span className={s.expense}>Total expe:<b>€ { totalExpense }</b></span>
        <span className={s.income}>Total reve:<b>€ { totalIncome }</b></span>
      </div>
      <div className={s.typeWrap}>
        <div className={s.left} onClick={toggle}>
          <span className={s.title}>{ currentSelect.name || 'All Types' } <Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
        <div className={s.right}>
          <span className={s.time} onClick={monthToggle}>{ currentTime }<Icon className={s.arrow} type="arrow-bottom" /></span>
        </div>
      </div>
    </div>
    <div className={s.contentWrap}>
      {
        list.length ? <Pull
          animationDuration={200}
          stayTime={400}
          refresh={{
            state: refreshing,
            handler: refreshData
          }}
          load={{
            state: loading,
            distance: 200,
            handler: loadData
          }}
        >
          {
            list.map((item, index) => <BillItem
              bill={item}
              key={index}
            />)
          }
        </Pull> : <Empty />
      }
    </div>
    <div className={s.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>
    <PopupType ref={typeRef} onSelect={select} />
    <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
    <PopupAddBill ref={addRef} onReload={refreshData} />
  </div>
};

export default Home;