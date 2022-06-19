import React from 'react';
import UnionOk from '../images/UnionOk.png';

function InfoTooltip() {
  return (
    <section className="InfoTooltip">
      <div className="InfoTooltip__container">
        <img className="InfoTooltip__image" src={UnionOk} alt="" />
        <p className="InfoTooltip__name">Вы успешно зарегистрировались!</p>
        <button className="InfoTooltip__button-close"></button>
      </div>
    </section>
  );
}

export default InfoTooltip;
