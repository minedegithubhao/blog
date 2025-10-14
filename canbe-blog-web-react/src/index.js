import ReactDOM from 'react-dom/client';
import App from './App';
// 引入BrowserRouter路由器
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
