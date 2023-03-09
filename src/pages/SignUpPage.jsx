import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import Swal from 'sweetalert2';

const SignUpPage = () => {
  //用state儲存input value、email、password
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //切換頁面
  const navigate = useNavigate();

  //監聽註冊按鈕呼叫register function
  const handleSignupClick = async () => {
    if (username.length === 0) return;
    if (password.length === 0) return;
    if (email.length === 0) return;
    const { success, authToken } = await register({
      username,
      email,
      password,
    });
    if (success) {
      localStorage.setItem('authToken', authToken);
      //註冊成功提示訊息
      Swal.fire({
        title: '註冊成功',
        icon: 'success',
        showConfirmButtonText: false,
        timer: 1000,
        position: 'top',
      });
      navigate('/todo');
      return;
    }
    //登入失敗提示訊息
    Swal.fire({
      title: '註冊失敗',
      icon: 'info',
      showConfirmButtonText: false,
      timer: 1000,
      position: 'top',
    });
  };

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label="Email"
          placeholder="請輸入email"
          value={email}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleSignupClick}>註冊</AuthButton>
      <Link to="/login">
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
