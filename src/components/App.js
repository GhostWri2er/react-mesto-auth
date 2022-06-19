import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import AddPlacePopup from './AddPlacePopup.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import CurrentUserContext from '../contexts/CurrentUserContext.js';
import Register from './Register.js';
import Login from './Login.js';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
  };

  useEffect(() => {
    api
      .getProfile()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => console.log('error', err));
  }, []);

  function handleUpdateUser(data) {
    const { name, about } = data;
    api
      .editProfile(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log('error', err));
  }

  function handleUpdateAvatar(data) {
    const { avatar } = data;
    api
      .updateAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log('error', err));
  }

  useEffect(() => {
    api
      .getCards()
      .then((data) => {
        setCards(
          data.map((card) => ({
            _id: card._id,
            link: card.link,
            name: card.name,
            likes: card.likes,
            owner: card.owner,
          })),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)

      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log('error', err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id)).catch((err) =>
        console.log('error', err),
      );
    });
  }

  function handleAddPlaceSubmit(data) {
    api
      .addCard(data.name, data.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log('error', err));
  }

  return (
    <div className="page">
      <Switch>
        <CurrentUserContext.Provider value={currentUser}>
          <Header />
          <ProtectedRoute exact path="/">
            <Route exact path="/">
              {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
              <Main
                cards={cards}
                handleCardDelete={handleCardDelete}
                handleCardLike={handleCardLike}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
              />
            </Route>
          </ProtectedRoute>
          <Route path="/sign-in">
            <Login />
          </Route>

          <Route path="/sign-up">
            <Register />
          </Route>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onUpdateCards={handleAddPlaceSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <ImagePopup onClose={closeAllPopups} card={selectedCard} />
        </CurrentUserContext.Provider>
      </Switch>
    </div>
  );
}

export default App;
