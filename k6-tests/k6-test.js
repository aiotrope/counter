import http from 'k6/http';

export const options = {
  duration: '30s',
  vus: 10,
};

export default function () {
  http.get('http://127.0.0.1:52522');
}
