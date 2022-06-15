import React, { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }
  const currentUser = useContext(CurrentUserContext);
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like ${isLiked ? 'card__like_active' : 'card__like'}`;

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = `card__button-delete ${
    isOwn ? 'card__button-delete' : 'card__button-delete_inactive'
  }`;

  return (
    <article className="grid-cards__item card">
      <button
        className={cardDeleteButtonClassName}
        onClick={handleDeleteClick}
        type="button"></button>
      <div className="card__overlay">
        <button className="card__open-fullscreen" onClick={handleClick}>
          <img className="card__image" src={card.link} alt={card.name} />
        </button>
      </div>
      <div className="card__block">
        <h2 className="card__name">{card.name}</h2>
        <div className="card__like_container">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"></button>
          <p className="card__like_score">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
