import React, { useState } from 'react'
import './Header.css'
import { Link, NavLink } from 'react-router-dom'
import { DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalHeader, UncontrolledDropdown} from 'reactstrap';
import { toast } from 'react-toastify'
import { useInfoContext } from '../../context/InfoContext'
import { logIn, signUp } from '../../api/authRequests';
import webLogo from '../../files/web_logo.png'


const Header = () => {
  const [modal, setModal] = useState(false);
  const {setCurrentUser, currentUser, exit, edit, setEdit, addModal} = useInfoContext()
    const [isSignUp, setIsSignUp] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          const data = new FormData(e.target)
          toast.loading("Please wait...", {
            position: toast.POSITION.BOTTOM_CENTER,
            className: "toast"
          })
          const res = isSignUp ? await logIn(data) : await signUp(data);
          setCurrentUser(res.data.user)
          toggle()
          toast.dismiss() 
          toast.success(res.data.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          })
          localStorage.setItem("profile", JSON.stringify(res.data.user))
          localStorage.setItem("access_token", res.data.token)
      } catch (error) {
        console.log(error);
          toast.dismiss()
          toast.error(error.response.data, {
            position: toast.POSITION.BOTTOM_CENTER,
          })
      }
    }

  const toggle = () => setModal(!modal);
  return (
    <header>
        <div className="container d-flex p-2">
            <Link to="/" className='logo'>
              {/* <h1>Book</h1> */}
              <img width={100} src={webLogo} alt="logo_site" />
            </Link>
          <div className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/category" className="nav-link">
                  Category
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/allbooks" className="nav-link">
                  Books
                </NavLink>
              </li>
              {currentUser && <li className="nav-item">
                <NavLink to="/mybooks" className="nav-link">
                  MyBooks
                </NavLink>
              </li>}
            </ul>
          </div>
          <div className="auth-content">
          <form className="nav-item d-flex">
            <input type="search" placeholder='search' required/>
            <button type='button'><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
           {!currentUser && <div onClick={toggle} className='buttons d-flex '>
                <button className='login fw-bold'>Login</button>
                <button className='login'><i className="fa-solid fa-user"></i></button>
            </div>}
            <UncontrolledDropdown group>
            <DropdownToggle
              className="fa-solid fa-gear nav-link"
              color='none' 
              outline='none'
            />
            <DropdownMenu>
             {currentUser &&  <Link to='/account' className='text-decoration-none'>
                <DropdownItem>
                    Account
                </DropdownItem>
              </Link>}
              <DropdownItem divider />
              <DropdownItem>
                Help
              </DropdownItem>
              <DropdownItem>
                Information
              </DropdownItem>
              <DropdownItem>
                How to use ?
              </DropdownItem>
              {currentUser && <DropdownItem className='text-danger fw-bolder' onClick={exit}>
              <i className="fa-solid fa-right-from-bracket me-2"></i>  Log out 
              </DropdownItem>}
            </DropdownMenu>
          </UncontrolledDropdown>
          {currentUser && <Link to='/account'>
            {currentUser?.avatar && <img width={50} height={50} className='rounded-circle' style={{objectFit: 'cover', border: "2px solid gold"}} src={`http://localhost:4000/${currentUser?.avatar}`} alt="account_img" />}
            {!currentUser?.avatar && <img width={50} height={50} className='rounded-circle' style={{objectFit: 'cover', border: "2px solid gold"}} src={`data:image/png;base64,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`} alt="account_img" />}
          </Link>}
            {(currentUser?.role === "admin" || currentUser?.role === "superadmin") && <UncontrolledDropdown group>
            <DropdownToggle
              className="fa-solid fa-screwdriver-wrench nav-link"
              color='none' 
              outline='none'
            />
            <DropdownMenu>
              <DropdownItem>
                Users
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => window.location.replace("/category")}>
                + Category
              </DropdownItem>
              <DropdownItem onClick={() => window.location.replace("/allbooks")}>
                +  Book
              </DropdownItem>
              <DropdownItem className='text-warning fw-bolder' onClick={() => setEdit(!edit)}>
              {edit && <><i className="fa-solid fa-circle-xmark me-2"></i> Not edit</>}
              {!edit && <><i className="fa-solid fa-pen-to-square me-2"></i> Edit</> }
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>}
          </div>
        
        </div>
        <Modal centered={true} className='modal-auth' isOpen={modal} toggle={toggle}>
        <ModalHeader className='title' toggle={toggle}>Login / SignUp</ModalHeader>
          <form onSubmit={handleSubmit} className='mt-5 px-5 py-3'>
            {!isSignUp && <>
              <div>
                  <b>Name <b className="text-danger fs-2">*</b></b>
                  <input type="text" name='name' className='form-control' placeholder='Enter your name' required minLength={3}/>
                </div>
                <div>
                  <b>Surname <b className="text-danger fs-2">*</b></b>
                  <input type="text" name='surname' className='form-control' placeholder='Enter your surname' required/>
                </div>
            </>}
            <div>
              <b>Email <b className="text-danger fs-2">*</b></b>
              <input type="email" name='email' className='form-control' placeholder='Enter your email' required/>
            </div>
            <div>
              <b>Password <b className="text-danger fs-2">*</b></b>
              <input type="password" name='password' className='form-control m-0' placeholder='Enter your password' required/>
            </div>
            <div className="form-help">
            <span onClick={()=> setIsSignUp(!isSignUp)}>{isSignUp ? "or signUp!" : "or login!"}</span>
            <span>forget password ?</span>
            </div>
            <button className='btn form-btn'>{isSignUp ? "Login" : "SignUp" }</button><br />
        </form>  
      </Modal>
      </header>
  )
}

export default Header