// import { useAuth } from '../context/AuthContext'
// import { db } from '../firebase'
// import { collection, getDocs } from 'firebase/firestore'
// import useSWR from 'swr'
//
// const fetchCourses = async () => {
//   const coursesCollection = collection(db, 'courses')
//   const coursesSnapshot = await getDocs(coursesCollection)
//   const courseData = [];
//   coursesSnapshot.forEach((doc) => {
//     const course = { id: doc.id, ...doc.data() };
//     if (!course.activeCourse) {
//       courseData.push(course);
//     }
//   });
//     return courseData
// }
//
// export default function useFetchCourses() {
//   const { currentUser } = useAuth()
//   const { data: courses, error } = useSWR(currentUser ? 'archivedCourses' : null, fetchCourses)
//
//   return {
//     courses: courses || [],
//     isLoading: !error && !courses,
//     isError: error,
//   }
// }
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchCourses = async () => {
  const coursesCollection = collection(db, 'courses');
  const coursesSnapshot = await getDocs(coursesCollection);
  const courseData = [];
  coursesSnapshot.forEach((doc) => {
    const course = { id: doc.id, ...doc.data() };
    if (!course.activeCourse) {
      courseData.push(course);
    }
  });
  return courseData;
};

export default function useFetchCourses() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchCourses()
          .then((data) => {
            setCourses(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching courses: ", error);
            setIsError(true);
            setIsLoading(false);
          });
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  return {
    courses,
    isLoading,
    isError,
  };
}
