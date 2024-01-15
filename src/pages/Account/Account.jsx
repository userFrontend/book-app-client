import React, { useState } from 'react'
import "./Account.css"
import { toast } from 'react-toastify'
import { useInfoContext } from '../../context/InfoContext'
import { updateProd } from '../../api/updateRequests'
import { deleteUser } from '../../api/deleteRequests'
import { Modal, ModalFooter, ModalHeader } from 'reactstrap'

const Account = () => {
    const {currentUser, setCurrentUser, exit} = useInfoContext();
    const [updUser, setUpdUser] = useState(false);
    const [delUser, setDelUser] = useState(false)

    const updateUser = () => {setUpdUser(!updUser);  
      if(!updUser){
        toast.dismiss()
        toast.warning("Click on what you want to update", {
        position: toast.POSITION.BOTTOM_CENTER,
        })
      }
    };
    const createTime = new Date(currentUser?.createdAt);
    const updateTime = new Date(currentUser?.updatedAt);

    const delModal = () => {setDelUser(!delUser)}

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const data = new FormData(e.target)
            toast.loading("Please wait...", {
              position: toast.POSITION.BOTTOM_CENTER,
            })
            const res = await updateProd(currentUser._id, data, {method: "user"})
            setCurrentUser(res.data.user)
            updateUser()
            toast.dismiss()
            toast.success(res.data.message, {
              position: toast.POSITION.BOTTOM_CENTER,
            })
            localStorage.setItem("profile", JSON.stringify(res.data.user))  
        } catch (error) {
          toast.dismiss()
          toast.error(error.response.data.message, {
            position: toast.POSITION.BOTTOM_CENTER,
          })
        }
    }

    const delAccount = async (e) => {
      e.preventDefault()
      try {
        const data = new FormData(e.target)
        toast.loading("Please wait...", {
          position: toast.POSITION.BOTTOM_CENTER,
        })
        await deleteUser(currentUser._id, data,{method: 'user'})
        toast.dismiss()
        exit()
        delModal()
      } catch (error) {
        toast.dismiss()
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        })
      }
    }
    

  return (
    <div className='box-account'>
        {currentUser &&
           <div className="add-book">
              <button className='btn btn-outline-danger' onClick={delModal}>Delete Account</button>
          </div>}
        <div className="img-user">
            {currentUser?.avatar && <img src={`http://localhost:4000/${currentUser?.avatar}`} alt="account_img" />}
            {!currentUser?.avatar && <img src={`data:image/png;base64,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`} alt="account_img" />}
        </div>
        <div className="user-data">
            <form onSubmit={handleSubmit}>
                <div>
                    <input disabled={!updUser} type="text" name='name' defaultValue={currentUser?.name} required/>
                    <input disabled={!updUser} type="text" name='surname' defaultValue={currentUser?.surname} required/>
                    <input disabled={!updUser} type="email" name='email' defaultValue={currentUser?.email} required/><br />
                </div>
                {updUser && (<div>
                    <input className='' type="password" name='password' placeholder='New Password'/>
                    <input className='' type="file" name='image'/>
                    <button className='btn btn-outline-success p-1'>Update user</button>
                </div>)}
            </form>
            <div className="time-box">
                <div><b className='text-primary'>Created:</b> <p style={{color: "gold"}}>  {createTime.toLocaleDateString()} _ {createTime.toLocaleTimeString()}</p></div>
                <button className="btn text-info" onClick={updateUser}>
                    {updUser && <><i className="fa-solid fa-circle-xmark me-2"></i> Not Update</>}
                    {!updUser && <><i className="fa-solid fa-pen-to-square me-2"></i> Update</> }
                </button>
                <div><b className='text-primary'>Updated:</b> <p style={{color: "gold"}}>  {updateTime.toLocaleDateString()} _ {updateTime.toLocaleTimeString()}</p></div>
            </div>
        </div>
        <Modal centered={true} className='modal-auth' isOpen={delUser} toggle={delModal}>
        <ModalHeader className='title' toggle={delModal}>Delete Account</ModalHeader>
            <h2 className='p-5 text-center'>If you delete the account, the data cannot be recovered!</h2>
            <form id='delForm' action="" className='px-5 my-2' onSubmit={delAccount}>
              <input className='form-control' type="password" name='password' placeholder='Enter your password' required/>
            </form>
        <ModalFooter>
            <button className='btn form-btn' onClick={delModal}>Close</button>
            <button type='submit' form='delForm' className='btn form-btn mb-3 bg-danger'>DELETE</button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Account