import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, arrayUnion, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // import your Firestore instance
import Head from 'next/head'
import Image from 'next/image'
import Login from '../components/Login'
import { useAuth } from '../context/AuthContext'
import AccessDenied from "../components/AccessDenied";
import Link from "next/link";
import { Button } from "@mui/material";

export default function Home() {
  const { currentUser, isAdmin } = useAuth()
  const [registrationRequests, setRegistrationRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const reqCollection = collection(db, "registrationRequests");
      const requestSnapshot = await getDocs(reqCollection);
      setRegistrationRequests(requestSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))); // Keep document id for later operations
    };

    fetchData();
  }, []);

  const handleAccept = async (req) => {
    const userRef = doc(db, 'users', req.userDocId);
    const reqRef = doc(db, 'registrationRequests', req.id);
  
    const userSnapshot = await getDoc(userRef);
    const userDoc = userSnapshot.data();
  
    // Check if registeredCourses field exists in the document
    const registeredCourses = userDoc.registeredCourses || [];
    const registering = userDoc.registering || [];
    console.log("register courses", registeredCourses);
    const updatedCourses = new Set(registeredCourses);
    updatedCourses.add(req.courseId);
    const registering2 = registering.filter(code => code!== req.courseId)
    console.log("request", req.courseId);
    console.log("updated courses", updatedCourses);
  console.log("updated courses", Array.from(updatedCourses));
    await updateDoc(userRef, {
      registeredCourses: Array.from(updatedCourses),
      registering: registering2
    });
  
    await deleteDoc(reqRef);
  
    setRegistrationRequests(registrationRequests.filter(request => request.id !== req.id));
  };
  
  const handleDeny = async (req) => {
    const reqRef = doc(db, 'registrationRequests', req.id);
    
    await deleteDoc(reqRef);

    setRegistrationRequests(registrationRequests.filter(request => request.id !== req.id));
  };

  return (
    <>
      <Head>
        <title>Registration Requests</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!currentUser && <Login />}
      {currentUser && isAdmin &&
        <>
          <table className="table-dark">
            <thead>
              <tr>
                <th>Name</th>
                <th>Student Number</th>
                <th>Requested Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
{console.log(registrationRequests)}
              
              {registrationRequests.map((req, index) => (
                <tr key={index}>
                  <td>{req.firstName} {req.lastName}</td>
                  <td>{req.studentNumber}</td>
                  <td>{req.courseName}</td>
                  <td className="flex">
                    <Button sx={{ mr: 5 }} variant="contained" color="success" onClick={() => handleAccept(req)}>
                      Accept
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDeny(req)}>
                     Deny
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      }
      {currentUser && !isAdmin && <AccessDenied />}
    </>
  )
}
