import React, { useEffect, useState } from 'react'
import './OneBook.css'
import { useParams} from 'react-router-dom'
import { getOneProd, saveProd } from '../../api/getRequests'
import { toast } from 'react-toastify'
import {Card, CardBody, Collapse, CardFooter, DropdownMenu, DropdownToggle, UncontrolledDropdown} from 'reactstrap'
import {messageData} from '../../api/messageRequests'
import { useInfoContext } from '../../context/InfoContext'
import { addComment } from '../../api/addRequests'
import { updateProd } from '../../api/updateRequests'
import { delProd } from '../../api/deleteRequests'

const OneBook = () => {
    const { token, users, currentUser } = useInfoContext()
    const [book, setBook] = useState()
    const [bookId, setBookId] = useState()
    const [update, setUpdate] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const input = document.querySelector('.add-message')

    const toggle = () => setIsOpen(!isOpen);
    const updTog = (id) => {
        setBookId(id)
        setUpdate(!update)

    };
    const location = useParams().id
    const getBook = async () => {
        try {
            const res = await getOneProd(location, {method: 'book'})
            setBook(res.data.book)
        } catch (error) {           
            toast.dismiss()
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    }
    useEffect(()=>{
        getBook()
    },[])
    
    const like = async () => {
        try {
            const res = await messageData(book._id, {method: 'like'})
            getBook()
            toast.dismiss()
            toast.success(res?.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    } 
    const dislike = async () => {
        try {
            const res = await messageData(book._id, {method: 'dislike'})
            getBook()
            toast.dismiss()
            toast.success(res?.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    } 



    
    const addMessage = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.target);
            const res = await addComment(book._id, data, {method: 'comment'})
            getBook()
            input.value = ''
            toast.dismiss()
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    }
    const updMessage = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.target);
            const res = await updateProd(bookId, data, {method: 'comment'})
            setUpdate(false)
            setBookId(null)
            getBook()
            toast.dismiss()
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    }
    const delMessage = async (id) => {
        try {
            const res = await delProd(id, {method: 'comment'})
            getBook()
            toast.dismiss()
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    }
    const saveBook = async (id) => {
        try {
            const res = await saveProd(id)
            getBook()
            toast.dismiss()
            toast.success(res.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
            toast.dismiss()
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_CENTER,
            })
        }
    }
    const bookLike = book?.like.filter(res => res === currentUser?._id)
    const bookDisLike = book?.dislike.filter(res => res === currentUser?._id)
  return (
    <div className='one-book'>
    <div>
        <img width={430} height={430} style={{objectFit: 'cover'}} src={`http://localhost:4000/${book?.photo}`} alt="account_img" /> <br /> 
        <button  onClick={like} className=''>{book?.like?.length} {bookLike?.length > 0 ? <i className="fa-solid fa-thumbs-up text-danger fa-fade "></i> : <i className="fa-solid fa-thumbs-up text-secondary"></i>}</button>
        <button onClick={dislike} className=''>{book?.dislike?.length} {bookDisLike?.length > 0 ? <i className="fa-solid fa-thumbs-down text-danger fa-fade "></i> : <i className="fa-solid fa-thumbs-down text-secondary"></i>}</button>
        <button className='' onClick={toggle}>{book?.comments?.length} <i className="fa-solid fa-comment text-light"></i></button> 
        <button className='' onClick={() => saveBook(book._id)}>{book?.downloadCount} <i className="fa-solid fa-download text"></i></button> 
    </div>
    <div className="content">
        <div>
            <h1 className='p-2 text-light'>book: <br /> <b className='text-warning'>{book?.title}</b></h1><br />
            <h1 className='p-2 text-light'>author: <br /> <b className='text-warning'>{book?.author}</b></h1>
       </div>        
      <Collapse isOpen={isOpen}>
        <Card>
          <CardBody className='comment-body'>
            {book?.comments.map(comment => {
                const selectedUser = users?.filter(user =>comment.userId === user._id)[0];
                return (
                    <div className='comment' key={comment._id}>
                        <div className="d-flex align-items-center gap-4">
                            {selectedUser?.avatar && <img width={50} height={50} className='rounded-circle' style={{objectFit: 'cover', border: "2px solid gold"}} src={`http://localhost:4000/${selectedUser?.avatar}`} alt="account_img" />}
                            {!selectedUser?.avatar && <img width={50} height={50} className='rounded-circle' style={{objectFit: 'cover', border: "2px solid gold"}} src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAh1BMVEX///8AAADy8vKzs7MJCQn6+vr29vbW1tYyMjL7+/vo6Ojv7++amprs7Ozb29vT09N+fn5oaGhPT0+hoaGJiYklJSW9vb2goKCqqqotLS1LS0vFxcU6OjpiYmJ8fHxaWlpycnIdHR1ERESSkpIoKCiMjIzLy8vBwcEXFxcwMDBVVVUfHx8REREj7DKBAAAGcklEQVR4nO2ca3uqOhCFExBU7mpFlKvaaqv9/7/vBJCAAorde9fkPOv9pJBJs5qQGSbTEgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4n6PMg+lPbQ3v7W8O5R+hr+loof3E0sgolULhhFK6VJ+2UzxmJ49CSjfuc2bBN5VMIaXeE0vVmV+MpFJIl4On0apMxFXouHzC9CUfLt0PMlbmtYXHrxqh8vfH+XP2bHDp6lC4CXVXD3gzYJSHujnNxvkV0/+I2Jcnn+R/S7XMNtaYTaYdRNWQvx8Oc8XlxUf2Vfe9ahGMf2Hgg6kfJLpNQp2Qsfd5+f7Ab2SXZtHCzn81cWNCRVXIOCds5pTFZcux7tgpadkmDdlnNb7qRWSFjN3CJMSPbnaPW+zykZ0xLY63ve1DbIXsCUwcpvEr/5j1WNnFLMesXXhqdyDWThN6Wbxb3g4xH3vQL9E855PNdKiTW8v1fJa8Gb8qoZ+prih69cV2VStuLLfYIFoebyYdhnoep7F9yG+0j5LAdyrXqrGefxTC/1XUenSfUfy2Ut1craNm68vVzCRO1BWraGzikilxL45ltNuH+aTZYWAlp6/GfL7Y8TcUcjbewpkSM0zKxbcoAoLVreWJLg/ELpzFaGOxtaofrKy1XNlNARUWzN8OOnFWm3zpufk0+teGGc2mZMHufse+SWw1iXo6ElZhzmllEMMq1ug0ud78LfYEGkx+6uvE9XZ3OhFaIWNnGcSd0S+HbaqNofqf+QX6wW4m7/d7EF0hY+MT22NPozvnVk6qk5QGRLHWD80lUMiwplqSEqPabaYWcd4D4syG2MqhkEVuuunZ+sVv2uS4IuPNMEtZFLLdRnO4lak4XWGa5Aope+4q7GS4lUwKixg0Jxg9YSSVQuYemIk9eIHKqJDuDP+ZCZRQ4fNAIRRCIRRCIRRCIRS+VOF5/iA/UYvY9KWhhFaYH3J7gwROjOu0sKAKT/OrcS3D4va9JBqneDM2rw+eorRaAIIoTNk0OI20xMwsbwcDBE5Iu62vEd0SSWH59m5Wh6L1qWie8j3tM9rNbp+/679XjZ3o2n48EUXhpErA7C8Drw+N1qX6Y6fAGbvjsBYH3vyjvBFdysaKQx0BFNaHLn4xvroAw1jSqFQ771JY3vKaCZxDUTeU8u+hCArrGSBvbHTr+lxzUWYtcjozo5fc4oFJMisbLW85qc/U9PTVZ09O4+cbbHAJH5xxottKrdm5SqupU5iqI+8lX/eLxk8IxCmrOZzpqD5gYis2qw5OnY5Ds3pDIcU26jV/NQNLjX6XKVuiqV1905Pr8fdQOZW8rm1dn00xP7ER5Yib4+yaG4a7pKdqiHZMJ4ugncIf7dWMbvnqtJplKeOo2ZsQrNgWXyftm0e+/qisNmklSfPmfqMUZbylcz5xuZ+Y8eqA16Ocmj7D2NEtV8ucfRm/hTcCs+KqeaLLZtu6gIrtsN+NbfrF+HRU+4igUXkxHtG49gkdCguXwlcnCwxiPnFaSuN/O+xn8OsF5dPPsPq8bzxNNxVdlb9nUx7Vq9NM6anRq0lERLH4/ripd0Sz7fLr+tq35r4rVCHUfYKGVwvPXb6C3z4saSaOXx8Im7R1c5I62VSbjJLRszjbyiCO3zThEc2dFAV/TFWBS7y7YBENj9+Yq0z8xXdbneevGnunvaGR3dOdgNB59ViZ8/L9z2kJzGOCvICWr05LrHLLgbCgZVaG1K33/PJycK/AVny0RpTSozCPgCZObw+C477X8bex7d1kugoX5aA5crejuosHa4f3IlcnG9qJfvE3vn2nq+DBWv42KVTZ+iC0lL+1G715YR6s+Utpn0VyPys8e30d9x9T/c1IH5IFa23Ch/VBUgVrLbQhh0+RxI/guCeLeMvicVdi0vGnQj3I6A7LxO5gvv3HHYrGswf82asH/CTaoCL1K0ZSRTW3qcNhiHhY0Y3el5d5hDR+w/XiQRUKN5znM+vH/zPk9zFca9b6i8t+dpnqiJn/vYvu7DtPt2/JAkPiANwOHizY7CixugvGR6+8dSDQCdofoXZWuKUyZg978VuJ75ksrmEw6lUyKpUqghmIXuej3iUMtAfhXPbV5P+yv7SZFvHc8XFDiVHpUsq33ScYS3fYCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwCv4D5g0U68UUYiPAAAAAElFTkSuQmCC`} alt="account_img" />}
                        <div className="gap-2">
                            <p>{comment?.user}</p>
                            <form action="" onSubmit={updMessage}>
                                <input name='content' disabled={bookId !== comment._id} className='text-start' defaultValue={comment?.content}/>
                                {update && bookId === comment._id && <button><i className="fa-solid fa-circle-chevron-right"></i></button>}
                            </form>
                        </div>
                        <UncontrolledDropdown group>
                            <DropdownToggle
                            className="fa-solid fa-ellipsis-vertical"
                            color='none' 
                            outline='none'
                            />
                            <DropdownMenu className='text-center p-0 m-0'>
                                {(currentUser?._id === comment.userId || currentUser?.role === 'superadmin' || currentUser?.role === 'admin') &&<>
                                <button className='px-2' onClick={() => delMessage(comment._id)}><i className="fa-regular fa-trash-can"></i></button>
                                {!update && <button className='px-2' onClick={() => updTog(comment._id)}><i className="fa-solid fa-pencil"></i></button>}
                                {update && <button className='px-2' onClick={() => {setUpdate(false); setBookId(null)}}><i className="fa-solid fa-circle-xmark"></i></button>}
                                </>}
                                <button className='px-2'><i className="fa-solid fa-reply"></i></button>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        </div>
                        <hr />
                    </div>
                )
            })}
          </CardBody>
          <CardFooter>
            <form style={{height: '40px', display: 'flex', alignItems: 'center'}}  action="" onSubmit={addMessage} className='d-flex'>
                <input name="content" className='form-control add-message' placeholder='Message' required/>
                <button className='btn p-3'><i className="fa-solid fa-paper-plane"></i></button>
            </form>
          </CardFooter>
        </Card>
      </Collapse>
    </div>
    </div>
  )
}

export default OneBook