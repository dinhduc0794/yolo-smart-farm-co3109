import React from 'react';
import Header from './fragments/header/HeaderMain';
import LoginForm from './Login/LoginForm';
import Footer from './fragments/footer/Footer';

function LoginPage() {
  return (
    <div>
      <Header />
      <div className="flex overflow-hidden flex-col items-center bg-white">
        <main className="flex flex-col justify-center items-center mx-10 max-md:px-5 max-md:mt-10 rounded-md">
          <LoginForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
