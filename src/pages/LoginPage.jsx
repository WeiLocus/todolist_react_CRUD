import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { login } from '../api/auth'
import Swal from 'sweetalert2';

const LoginPage = () => {
  //用state儲存input value 和 password
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  //點擊登入按鈕呼叫login function
  const handleClick = async() => {
    if (username.length === 0) return
    if (password.length === 0) return
    const { success, authToken } = await login({username, password})
    //登入成功，將token儲存在localStorage
    if (success) {
      localStorage.setItem('authToken', authToken);
      //登入成功提示訊息
      Swal.fire({
        title: '登入成功',
        icon: 'success',
        showConfirmButtonText: false,
        timer: 1000,
        position: 'top',
      });
      return;
    }
    //登入失敗提示訊息
    Swal.fire({
      title: '登入失敗',
      icon: 'error',
      showConfirmButtonText: false,
      timer: 1000,
      position: 'top',
    });


  }
  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

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
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick} >登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
