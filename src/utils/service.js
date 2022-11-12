import request from "./request";

// 查看账号是否被注册
const checkUsername = async (params) => {
  return await request.get("/user/check", { params });
};

// 注册
const registerUser = async (params) => {
  return await request.post('/user/register', params)
}

// 登录
const userLogin = async (params) => {
  return await request.post('/user/login', params)
}

export { checkUsername, registerUser, userLogin };
