function Login() {
  return (
    <>
      <section className="register">
        <h2 className="register__name">Вход</h2>
        <form className="register__form">
          <input placeholder="Email" className="input register__input-email"></input>

          <input placeholder="Пароль" className="input register__input-password"></input>

          <button type="submit" className="register__button">
            Войти
          </button>
        </form>
      </section>
    </>
  );
}

export default Login;
