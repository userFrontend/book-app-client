import React, {useState } from 'react'
import './Category.css'
import { useInfoContext } from '../../context/InfoContext'
import Edit from '../../components/Edit/Edit'
import { Modal, ModalBody, ModalHeader} from 'reactstrap';
import { addProd } from '../../api/addRequests';
import { toast} from 'react-toastify'


const Category = () => {
    const {edit, category, currentUser, getAllCategorys} = useInfoContext()
    const [modal, setModal] = useState(false);
    const [addCategoryModal, setAddCategory] = useState(false)
    const addModalOpen = () => setAddCategory(!addCategoryModal)

    const toggle = () => setModal(!modal);

    const addCatregory = async (e) => {
      e.preventDefault()
      try {
        const data = new FormData(e.target);
        const res = await addProd(data, {method: 'category'})
        getAllCategorys()
        addModalOpen()
        toast.dismiss()
        toast.success(res.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
      }
    }
  return (<>
      <div className='box-category'>
    {currentUser?.role === 'admin' || currentUser?.role === 'superadmin' &&
        <div className="add-category">
          <button className='btn btn-outline-light' onClick={addModalOpen}>Add Category</button>
      </div>}
    {category?.map(item => {
        return (<div key={item?._id} className='mt-5'>
               <div className="card" onClick={()=>{currentUser && !edit ? window.location.replace(`/category/${item._id}`) : !edit && toggle()}}>
              {edit && <Edit z base={"category"} elementId={item?._id}/>}
                <div className="card-image">
                    <img width={300} src={`http://localhost:4000/${item?.image}`} alt="Card_photo" />                    
                </div>
                <h1 className="card-title text-primary">{item?.title}</h1>
              </div>
           </div>
        )
    })}
      <Modal centered={true} className='modal-auth' isOpen={modal} toggle={toggle}>
        <ModalHeader className='title' toggle={toggle}>⚠ Please register first!</ModalHeader>
        <ModalBody>
        <h2 className='p-5'>Register first to take advantage of all features</h2>
        </ModalBody>
      </Modal>
      <Modal centered={true} className='modal-auth' isOpen={addCategoryModal} toggle={addModalOpen}>
      <ModalHeader className='title' toggle={addModalOpen}>Add Category</ModalHeader>
        <form onSubmit={addCatregory} className=' px-5 py-3'>
        <div>
          <b>Title <b className="text-danger fs-2">*</b></b>
          <input className='form-control' type="text" name='title' required placeholder='Title' minLength={4}/>
        </div>
        <div>
          <b>Image <b className="text-danger fs-2">*</b></b>
          <input className='form-control' type="file" name='image' required placeholder='Photo'/>
        </div>
            <button className='btn mb-3'>Add Book</button>
        </form>  
    </Modal>
    </div>
  </>)
}

export default Category