import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, collection, getDocs, getDoc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../../../firebase";
import { Button } from "@mui/material";
import Link from "next/link";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export default function Page() {
  const [courseId, setCourseId] = useState(null);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [courseName, setCourseName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (router.query.id) {
        try {
          const courseId = router.query.id;
          setCourseId(courseId);

          // Get the course name from Firestore
          const courseDocRef = doc(db, "courses", courseId);
          const courseDocSnap = await getDoc(courseDocRef);
          if (courseDocSnap.exists()) {
            const courseData = courseDocSnap.data();
            setCourseName(courseData.name);
          }

          // Query users collection for registered students
          const usersCollectionRef = collection(db, "users");
          const usersQuerySnapshot = await getDocs(usersCollectionRef);

          const registeredStudents = [];
          usersQuerySnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            const registeredCourses = userData.registeredCourses || [];

            if (registeredCourses.includes(courseId)) {
              registeredStudents.push({
                userDocId: userDoc.id,
                ...userData,
              });
            }
          });

          setRegisteredStudents(registeredStudents);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [router.query.id]);

  const handleDelete = async (userDocId) => {
    try {
      const userRef = doc(db, "users", userDocId);
      await setDoc(
          userRef,
          {
            registeredCourses: deleteField(),
          },
          { merge: true }
      );
      setRegisteredStudents(registeredStudents.filter(student => student.userDocId !== userDocId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
      <div className="container my-4">
        <h1 className="text-center mb-4">View Course Students: {courseName}</h1>
        <h2>Registered Students</h2>

        <table className="table table-striped table-bordered">
          <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Student Number</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {registeredStudents.map((student, index) => (
              <tr key={index}>
                <td>
                  {student.firstName} {student.lastName}
                </td>
                <td>{student.email}</td>
                <td>{student.studentNumber}</td>
                <td className="d-flex justify-content-between">
                  <Link href={`/editUser/${student.userDocId}`} passHref>
                    <Button
                        size="small"
                        className="btn-narrow me-1"
                        variant="contained"
                        color="primary"
                    >
                      <span className="d-none d-lg-inline">Edit</span>
                      <AiOutlineEdit className="d-lg-none" />
                    </Button>
                  </Link>
                  <Button
                      size="small"
                      className="btn-narrow"
                      color="error"
                      variant="contained"
                      onClick={() => handleDelete(student.userDocId)}
                  >
                    <span className="d-none d-lg-inline">Delete</span>
                    <AiOutlineDelete className="d-lg-none" />
                  </Button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}
