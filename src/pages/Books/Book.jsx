import React, { useEffect, useState } from 'react'
import './Book.css'
import { toast } from 'react-toastify'
import {  Modal, ModalHeader, ModalBody} from 'reactstrap';
import { useInfoContext } from '../../context/InfoContext'
import Edit from '../../components/Edit/Edit'
import { getAllProd } from '../../api/getRequests';
import { addProd } from '../../api/addRequests';
import { Link } from 'react-router-dom'

const Book = () => {
    const {baseURL, edit, currentUser, token, category} = useInfoContext()
    const [books, setBooks] = useState()
    const [modal, setModal] = useState(false);
    const [rig, setRig] = useState(false);
    const addBookModal = () => setModal(!modal);
    const rigester = () => setRig(!rig);
    const getAllBooks = async () => {
      try {
          toast.loading("Please wait...", {
            position: toast.POSITION.BOTTOM_CENTER,
          })
          const res = await getAllProd({method: "book"})
          setBooks(res.data.books)
          setTimeout(()=>{
            toast.dismiss()
          }, 1000)
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
      }
  }
    useEffect(() => {
    getAllBooks()
    }, [baseURL])

    const addBook = async (e) => {
      e.preventDefault()
      try {
        toast.loading("Please wait...", {
          position: toast.POSITION.BOTTOM_CENTER,
          className: "toast"
        })
        const data = new FormData(e.target)
        await addProd(data, {method: 'book'})
        addBookModal()
        getAllBooks()
        setTimeout(()=>{
          toast.dismiss()
        }, 1000)
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
      }
    } 
  return (<div className='box-book'>
            {currentUser &&
           <div className="add-book">
              <button className='btn btn-outline-light' onClick={addBookModal}>Add book</button>
          </div>}
          <div className='book-list'>
                {books?.length > 0 ? books?.map(book => {        
                    return (<div key={book?._id}>
                        <div className="book">
                          {edit &&   <Edit base={"book"} getFunction={getAllBooks} elementId={book?._id}/>}
                            <div className="cover text-center">
                              <h1>{book.title}</h1>
                              {!currentUser && <button className='btn btn-outline-primary mx-auto d-block' onClick={rigester}>Read more</button>}
                              {currentUser && <Link to={`/book/${book._id}`}><button className='btn btn-outline-primary mx-auto d-block text-decoration-none' >Read more</button></Link>}
                            </div>
                            <div className="left-page"> 
                              <img src={`http://localhost:4000/${book.photo}`} alt="book_photo" />                    
                              <h3>{book.author}</h3>
                            </div>
                        </div>
                      </div>
                    )
                }) : <h1 className='mx-auto'>Books have not been added yet</h1>}
          </div>
          <Modal centered={true} className='modal-auth' isOpen={modal} toggle={addBookModal}>
            <ModalHeader className='title' toggle={addBookModal}>Add Book</ModalHeader>
              <form onSubmit={addBook} className=' px-5 py-3'>
              <div>
                <b>Title <b className="text-danger fs-2">*</b></b>
                <input className='form-control' type="text" name='title' required placeholder='Title' minLength={4}/>
              </div>
              <div>
                <b>Author <b className="text-danger fs-2">*</b></b>
                <input className='form-control' type="text" name='author' required placeholder='Author'/>
              </div>
              <div>
                <b>Category <b className="text-danger fs-2">*</b></b>
                <select name='categoryId' className='book-selection form-control'>
                  {category?.map(res => {
                    return <option key={res._id} value={res._id} >{res.title}</option>
                  })}
                </select>
              </div>
              <div>
                <b>Image <b className="text-danger fs-2">*</b></b>
                <input className='form-control' type="file" name='image' required placeholder='Photo'/>
              </div>
                  <button className='btn mb-3'>Add Book</button>
              </form>  
          </Modal>
          <Modal centered={true} className='modal-auth' isOpen={rig} toggle={rigester}>
        <ModalHeader className='title' toggle={rigester}>⚠ Please register first!</ModalHeader>
        <ModalBody>
        <h2 className='p-5'>Register first to take advantage of all features</h2>
        </ModalBody>
          </Modal>
    </div>
  )
}

export default Book