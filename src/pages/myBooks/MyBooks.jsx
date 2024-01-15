import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {  Modal, ModalHeader, ModalBody} from 'reactstrap';
import { useInfoContext } from '../../context/InfoContext'
import Edit from '../../components/Edit/Edit'
import { getAllProd } from '../../api/getRequests';
import { Link, useParams } from 'react-router-dom'

const MyBooks = () => {
    const {baseURL, edit, currentUser} = useInfoContext()
    const [books, setBooks] = useState()
    const [rig, setRig] = useState(false);
    const rigester = () => setRig(!rig);
    const location = useParams().id
    const getAllBooks = async () => {
      try {
          toast.loading("Please wait...", {
            position: toast.POSITION.BOTTOM_CENTER,
          })
          const res = await getAllProd({method: "book"})
          const result = res?.data.books.filter(book => book?.ownerId === currentUser?._id);
          setBooks(result)
          setTimeout(()=>{
            toast.dismiss()
          }, 1000)
      } catch (error) {
        console.log(error);
        toast.dismiss()
        toast.error(error?.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
      }
  }
    useEffect(() => {
    getAllBooks()
    }, [baseURL])
  return (<div className='box-book'>
          <div className='book-list'>
                {books?.length > 0 ? books?.map(book => {        
                    return (<div key={book._id}>
                        <div className="book">
                          <Edit base={"book"} getFunction={getAllBooks} elementId={book?._id}/>
                            <div className="cover text-center">
                              <h1>{book.title}</h1>
                              <Link to={`/book/${book._id}`}><button className='btn btn-outline-primary mx-auto d-block text-decoration-none' >Read more</button></Link>
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
    </div>
  )
}

export default MyBooks