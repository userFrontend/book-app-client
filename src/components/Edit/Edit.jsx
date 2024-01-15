import React, { useEffect, useState } from 'react'
import { Modal, ModalFooter, ModalHeader} from 'reactstrap';
import { toast } from 'react-toastify'
import { useInfoContext } from '../../context/InfoContext'
import { updateProd } from '../../api/updateRequests';
import { delProd } from '../../api/deleteRequests';
import { getOneProd } from '../../api/getRequests';

const Edit = ({elementId, base, getFunction}) => {
    const {token, category, users} = useInfoContext()
    const [modal, setModal] = useState(false);
    const [dataValue, setDataValue] = useState();
    const [del, setDel] = useState(false);
    const toggle = () => setModal(!modal);

    useEffect(()=>{
      const getValue = async () => {
          try { 
              const res = await getOneProd(elementId, {method: base})
              if(res.data.book){
                setDataValue(res.data.book)
              } else {
                setDataValue(res.data?.category)
              }
          } catch (error) { 
            toast.dismiss()
            toast.error(error.response.data.message, {
              position: toast.POSITION.BOTTOM_CENTER,
            })
          }
      }
      getValue()
    },[])
    const delFunction = async () => {
        try { 
            toast.loading("Please wait...", {
              position: toast.POSITION.BOTTOM_CENTER,
            })
            const res = await delProd(elementId, {method: base})
            getFunction()
            toggle()
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
    const editFunction = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.target)
            toast.loading("Please wait...", {
              position: toast.POSITION.BOTTOM_CENTER,
            })
            const res = await updateProd(elementId, data, {method: base})
            getFunction()
            toggle()
            toast.dismiss()
            toast.success(res?.data.message, {
              position: toast.POSITION.BOTTOM_CENTER,
            })
        } catch (error) {
          console.log(error);
          toast.dismiss()
          toast.error(error?.response?.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          })
        }
    }
  return (
    <>
        <div className="edit-buttons" onClick={toggle}>
            <button className='btn btn-outline-warning' onClick={() => setDel(false)}><i className="fa-solid fa-pen-to-square"></i></button>
            <button className='btn btn-outline-danger' onClick={() => setDel(true)}><i  className="fa-solid fa-trash"></i></button>
        </div>
        <Modal centered={true} className='modal-auth' isOpen={modal} toggle={toggle}>
        <ModalHeader className='title' toggle={toggle}>Delete / Update</ModalHeader>

          {!del && <form onSubmit={editFunction} className=' px-5 py-3'>
                <div>
                  <b>Name <b className="text-danger fs-2">*</b></b>
                  <input defaultValue={dataValue?.title} className='form-control' type="text" name='title' placeholder='Update name' required/>
                </div>
                {base === "book" && <>
                <div>
                  <b>Author <b className="text-danger fs-2">*</b></b>
                  <input defaultValue={dataValue?.author} className='form-control' type="text" name='author' placeholder='Update author' required/>
                </div>
                <div  className='pt-4'>
                  <b>Category</b>
                  <select name='categoryId' className='book-selection form-control'>
                    <option defaultChecked selected value='' >Select Category</option>
                    {category?.map(res => {
                      return <option key={res._id} value={res._id} >{res.title}</option>
                    })}
                  </select>
                </div>
                <div className='pt-4'>
                  <b>Owner</b>
                  <select name='ownerId' className='book-selection form-control'>
                    <option defaultChecked selected value='' >Select Owner</option>
                    {users?.map(res => {
                      return <option key={res._id} value={res._id} >{res.name }  --- {res.email}</option>
                    })}
                  </select>
                </div>
                </>}
                <div>
                  <b>Image <b className="text-danger fs-2">*</b></b>
                  <input className='form-control' type="file" name='image' placeholder='Update image'/>
                </div>
            <button className='btn form-btn'>UPDATE</button>
        </form>  }
        {del && <ModalFooter>
            <h2 className='p-5'>If you delete a  , all books in it will be deleted!</h2>
            <button className='btn form-btn' onClick={toggle}>Close</button>
            <button className='btn form-btn mb-3' onClick={delFunction}>DELETE</button>
        </ModalFooter>}
      </Modal>
    </>
  )
}

export default Edit