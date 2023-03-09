import axios from 'axios';

//定義要串接API的URL
const authURL = 'https://todo-list.alphacamp.io/api/auth';

//login需要帳號密碼，由前端畫面做傳入
export const  login = async({username, password}) => {
  try {
    //請求發行後會回傳一組authToken
    //response都會被封裝在名為data的物件
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });
    // console.log(data); //確認串接狀態是否成功
    //登入成功可以拿到一組authToken
    const { authToken } = data;
    // console.log(authToken)
    //如果登入成功，加上success 屬性做為 flag
    if (authToken) {
      return { success: true, ...data };
    }
    return data; //登入失敗
  } catch (error) {
    console.error('[Login Failed]',error)
  }
}

//註冊功能
export const register = async({username, email, password}) => {
  try {  
    const { data } = await axios.post(`${authURL}/register`, {
    username,
    email,
    password,
  });
  //註冊成功可以拿到一組authToken
  const { authToken } = data 
  if ( authToken ) {
    return { success: true, ...data}
  }
  return data
  } catch (error) {
    console.error('[Register Failed]', error);
  }
}

//身份驗證:Token是否有效
export const checkPermission = async(authToken) => {
  try {
  // response會有 success的參數
  const response = await axios.get(`${authURL}/test-token`,{
    headers: {
      // Bearer是在前綴，還要再空一格＋ authToken
      Authorization: 'Bearer ' + authToken
    }
  })
  return response.data.success
  } catch (error) {
    console.log('[Check Permission Failed]:',error)
  }

}