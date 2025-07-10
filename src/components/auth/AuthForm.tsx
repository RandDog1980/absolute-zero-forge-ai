
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);

  if (isLogin) {
    return <LoginForm onSwitchToSignup={() => setIsLogin(false)} />;
  }

  return <SignupForm onSwitchToLogin={() => setIsLogin(true)} />;
};

export default AuthForm;
