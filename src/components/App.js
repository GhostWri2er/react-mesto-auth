import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
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
import * as auth from '../utils/auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const history = useHistory();

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

  const handleLogin = (data) => {
    auth
      .login(data)
      .then((data) => {
        if (!data) {
          return setError('Такого пользователя не существует');
        }

        if (data.jwt) {
          const { email, password } = data;

          setUserData({
            email: email,
            password: password,
          });
          setLoggedIn(true);
          localStorage.setItem('jwt', data.jwt);
          history.push('/');
        }
      })
      .catch((error) => setError('Что-то пошло не так!'));
  };
  const handleRegister = (data) => {
    auth
      .register(data)
      .then((res) => {
        if (res.statusCode === 400) {
          setError('Что-то пошло не так!');
        } else {
          setError('');
          history.push('/sing-in');
        }
      })
      .catch((error) => setError('Что-то пошло не так!'));
  };

  // const tokenCheck = () => {
  //   if (localStorage.getItem('jwt')) {
  //     let jwt = localStorage.getItem('jwt');
  //     auth.getToken(jwt).then((res) => {
  //       if (res) {
  //         let userData = {
  //           email: res.email,
  //           password: res.password,
  //         };
  //         setLoggedIn = true;
  //       }
  //     });
  //   }
  // };

  return (
    <div className="page">
      <Switch>
        <CurrentUserContext.Provider value={currentUser}>
          <Header userData={userData} />
          <ProtectedRoute exact path="/" loggedIn={loggedIn}>
            <Main
              cards={cards}
              handleCardDelete={handleCardDelete}
              handleCardLike={handleCardLike}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
            />
          </ProtectedRoute>
          <Route path="/sign-in">
            <Login onLogin={handleLogin} />
          </Route>

          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
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
