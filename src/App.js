import { Route, Routes } from 'react-router-dom';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home/Home'
import Header from './components/Header/Header';
import Category from './pages/Category/Category';
import Book from './pages/Books/Book';
import Account from './pages/Account/Account';
import OneBook from './pages/OneBook/OneBook';
import OneCategory from './pages/OneCategory/OneCategory';
import MyBooks from './pages/myBooks/MyBooks';


function App() {
  return (
    <div className="App">
        <video className='bg-video' src="./images/182592 (Original).mp4" muted loop autoPlay></video>
      <div className='overlay'></div>
      <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/category' element={<Category/>}/>
          <Route path='/allbooks' element={<Book/>}/>
          <Route path='/mybooks' element={<MyBooks/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/book/:id' element={<OneBook/>}/>
          <Route path='/category/:id' element={<OneCategory/>}/>
        </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
