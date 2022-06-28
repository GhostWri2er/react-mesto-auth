import React from 'react';
import UnionOk from '../images/UnionOk.png';
import UnionError from '../images/UnionError.png';

function InfoTooltip({ isOpen, onClose }) {
  return (
    <section className={`InfoTooltip ${isOpen ? 'popup_opened' : ''}`}>
      <div className="InfoTooltip__container">
        <img className="InfoTooltip__image" src={UnionOk} alt="" />
        <p className="InfoTooltip__name">Вы успешно зарегистрировались!</p>
        <button className="InfoTooltip__button-close" type="button" onClick={onClose}></button>
      </div>
    </section>
  );
}

export default InfoTooltip;
