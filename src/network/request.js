import axios from "axios"

export function request(config) {
  const instance = axios.create({
    // baseURL: 'http://123.207.32.32:8000',
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 15000
  })

  // axios拦截器
  instance.interceptors.request.use(config => {
    // console.log(config);
    return config;
  }, error => {
    // console.log(error);
  });
  instance.interceptors.response.use(res => {
    // console.log(res);
    return res.data;
  }, err => {
    // console.log(err);
  });

  return instance(config)
}

export function instance2() {

}
