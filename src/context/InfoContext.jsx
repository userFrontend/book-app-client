import { toast } from "react-toastify";
import { getAllProd } from "../api/getRequests";

const { createContext, useContext, useState, useEffect } = require("react");


const InfoContext = createContext()

export const useInfoContext = () => useContext(InfoContext)

export const InfoProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("profile")) || null)
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [edit, setEdit] = useState(false)
    const [category, setCategory] = useState()
    const [users, setUsers] = useState()
    
    const baseURL = "http://localhost:4000/api"
    
    const getAllCategorys = async () => {
      try {
          const res = await getAllProd({method: 'category'})
          setCategory(res.data.category)
      } catch (error) {
        console.log(error);
      }
  }
  const getAllUsers = async () => {
    try {
        const res = await getAllProd({method: 'user'})
        setUsers(res?.data.users)
    } catch (error) {
      console.log(error);
    }
}
    useEffect(() => {
      getAllCategorys()
      getAllUsers()
      }, [baseURL])
    
    const exit = () => {
        window.location.replace("/")
        localStorage.clear()
        toast.success("Log Out successfully", {
            position: toast.POSITION.BOTTOM_CENTER,
        })
        setCurrentUser(null)
        setEdit(false)
    }

     const value = {
        currentUser, setCurrentUser,
        token, setToken, baseURL, exit,
        edit, setEdit, category, setCategory,
        users, setUsers, getAllUsers, getAllCategorys,
    }

 
    return (
        <InfoContext.Provider value={value}>
            {children}
        </InfoContext.Provider>
    )
}