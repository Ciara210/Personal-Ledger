import React from 'react';
import PropTypes from 'prop-types';
import s from './style.module.less'

const Empty = ({ desc }) => {
  return <div className={s.empty}>
    <img src="//s.yezgea02.com/1619144597039/empty.png" alt="No data available"/>
    <div>{desc || 'No data available'}</div>
  </div>;
};

Empty.propTypes = {
  desc: PropTypes.string
};

export default Empty;