import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Button from '@mui/material/Button';

export default function Modal(props) {
    const { setOpenModal } = props;
    const [_document, set_document] = useState(null);
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const { logout, currentUser } = useAuth();

    useEffect(() => {
        set_document(document);
        const fetchUserData = async () => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    setFormData(userDoc.data());
                }
            }
        };

        fetchUserData();
    }, [currentUser]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await setDoc(doc(db, 'users', currentUser.uid), formData, { merge: true });
            setUserData(formData);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    };

    if (!_document || !userData) { return null; }

    return ReactDOM.createPortal(
        <div className='z-50 fixed inset-0 bg-white text-slate-900 text-lg sm:text-xl flex flex-col'>
            <div className='flex items-center justify-between border-b border-solid border-slate-900 p-4'>
                <h1 className='font-extrabold text-2xl sm:text-5xl select-none'>User Information</h1>
                <i onClick={() => setOpenModal(false)}
                   className="fa-solid fa-xmark duration-300 hover:rotate-90 text-lg sm:text-3xl cursor-pointer"></i>
            </div>

            <div className='p-4 flex flex-col gap-3'>
                <p>Email: {userData.email}</p>
                <p>First Name: {editMode ? <input type="text" name="firstName" value={formData.firstName}
                                                  onChange={handleInputChange}/> : userData.firstName}</p>
                <p>Last Name: {editMode ? <input type="text" name="lastName" value={formData.lastName}
                                                 onChange={handleInputChange}/> : userData.lastName}</p>
                <p>Student Number: {editMode ? <input type="text" name="studentNumber" value={formData.studentNumber}
                                                      onChange={handleInputChange}/> : userData.studentNumber}</p>
                <p>Program: {editMode ? <input type="text" name="program" value={formData.program}
                                               onChange={handleInputChange}/> : userData.program}</p>
                <p>Department: {editMode ? <input type="text" name="department" value={formData.department}
                                                  onChange={handleInputChange}/> : userData.department}</p>
                <p>Title: {editMode ? <input type="text" name="title" value={formData.title}
                                             onChange={handleInputChange}/> : userData.title}</p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {editMode ? <Button variant="contained" onClick={handleSubmit}>Save</Button> :
                        <Button variant="outlined" onClick={() => setEditMode(true)}>Edit</Button>}
                </div>
            </div>

            <div className='p-4 flex flex-col gap-3'>
                <h2 onClick={() => {
                    logout();
                    setOpenModal(false);
                }} className='select-none duration-300 hover:pl-2 cursor-pointer'>Logout</h2>
            </div>
        </div>,
        _document.getElementById('portal')
    );
}
