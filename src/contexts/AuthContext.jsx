import { createContext, useEffect, useState, useContext } from 'react'
import { register, login, checkPermission} from '../api/auth'
import * as jwt from 'jsonwebtoken'
import { useLocation } from 'react-router-dom';

//定義要共享的狀態與方法
const defaultAuthContext = {
  isAuthenticated: false,
  currentMember: null,
  register: null,
  login: null,
  logout: null,
};

//統一儲存身分狀態
const AuthContext = createContext(defaultAuthContext)
export const useAuth = () => useContext(AuthContext)

//建立Provider管理狀態，封裝會影響到身分狀態的註冊、登入、登出方法
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //透過解析token方式取得payload
  const [payload, setPayload] = useState(null);
  
  //路徑變化（useLocation）時驗證使用者身分
  const { pathname } = useLocation( )
  useEffect(() => {
    const checkTokenIsValid = async() => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }
      //authToken存在，用checkPermission()檢查有效性
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    }
    checkTokenIsValid()
  },[pathname])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          id: payload.sub, //使用者 id
          name: payload.name, //使用者帳號
        },
        // 註冊方法
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          //透過jwt.decode 來解析 authToken
          const tempPayload = jwt.decode(authToken);
          //成功解析，登出有效
          if (tempPayload) {
            //setPayload 存進 Context 的內部狀態
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        //登入方法
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          //透過jwt.decode 來解析 authToken
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setPayload(tempPayload);
            setIsAuthenticated(true);
            localStorage.setItem('authToken', authToken);
          } else {
            setPayload(null);
            setIsAuthenticated(false);
          }
          return success;
        },
        //登出方法
        logout: () => {
          localStorage.removeItem('authToken');
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}