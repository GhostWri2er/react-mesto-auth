import { Link, withRouter } from 'react-router-dom';

function Register() {
  return (
    <>
      <section className="register">
        <h2 className="register__name">Регистрация</h2>
        <form className="register__form">
          <input placeholder="Email" className="input register__input-email"></input>

          <input placeholder="Пароль" className="input register__input-password"></input>

          <button type="submit" className="register__button">
            Зарегистироваться
          </button>
        </form>
        <p className="register__paragraph">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="register__link">
          Войти
        </Link>
      </section>
    </>
  );
}

export default withRouter(Register);
