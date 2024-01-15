import React, { useEffect, useState } from 'react'
import './OneCategory.css'
import { toast } from 'react-toastify'
import {  Modal, ModalHeader, ModalBody} from 'reactstrap';
import { useInfoContext } from '../../context/InfoContext'
import Edit from '../../components/Edit/Edit'
import { getOneProd } from '../../api/getRequests';
import { Link, useParams } from 'react-router-dom'

const OneCategory = () => {
    const {baseURL, edit, currentUser} = useInfoContext()
    const [books, setBooks] = useState()
    const [rig, setRig] = useState(false);
    const rigester = () => setRig(!rig);
    const location = useParams().id
    const getAllCategory = async () => {
      try {
          toast.loading("Please wait...", {
            position: toast.POSITION.BOTTOM_CENTER,
          })
          const res = await getOneProd(location, {method: "category"})
          setBooks(res.data.category.books);
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
    getAllCategory()
    }, [baseURL])
  return (<div className='box-book'>
          <div className='book-list'>
                {books?.length > 0 ? books?.map(book => {        
                    return (<div key={book._id}>
                        <div className="book">
                          {edit && <Edit base={"book"} getFunction={getAllCategory} elementId={book?._id}/>}
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
          <Modal centered={true} className='modal-auth' isOpen={rig} toggle={rigester}>
        <ModalHeader className='title' toggle={rigester}>⚠ Please register first!</ModalHeader>
        <ModalBody>
        <h2 className='p-5'>Register first to take advantage of all features</h2>
        </ModalBody>
          </Modal>
    </div>
  )
}

export default OneCategory