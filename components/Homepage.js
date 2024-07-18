// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import CourseCard from "./CourseCard";
// import {
//   doc,
//   setDoc,
//   deleteField,
//   addDoc,
//   collection,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import useFetchCourses from "../hooks/fetchCourses";
//
// export default function UserDashboard() {
//   const { userInfo, currentUser } = useAuth();
//   const [edit, setEdit] = useState(null);
//   const [course, setCourse] = useState([]);
//   const [edittedValue, setEdittedValue] = useState("");
//
//   const { courses, setCourses, loading, error } = useFetchCourses();
//
//   async function handleAddCourse() {
//     if (!course) {
//       return;
//     }
//     const docRef = await addDoc(collection(db, "courses"), course);
//     setCourse("");
//   }
//
//   async function handleEditCourse(i) {
//     if (!edittedValue) {
//       return;
//     }
//     const newKey = edit;
//     setCourses({ ...courses, [newKey]: edittedValue });
//     const userRef = doc(db, "courses", currentUser.uid);
//     await setDoc(
//       userRef,
//       {
//         courses: {
//           [newKey]: edittedValue,
//         },
//       },
//       { merge: true }
//     );
//     setEdit(null);
//     setEdittedValue("");
//   }
//
//   function handleAddEdit(courseKey) {
//     return () => {
//       console.log(courses[courseKey]);
//       setEdit(courseKey);
//       setEdittedValue(courses[courseKey]);
//     };
//   }
//
//   function handleDelete(courseKey) {
//     return async () => {
//       const tempObj = { ...courses };
//       delete tempObj[courseKey];
//
//       setCourses(tempObj);
//       const userRef = doc(db, "courses", currentUser.uid);
//       await setDoc(
//         userRef,
//         {
//           courses: {
//             [courseKey]: deleteField(),
//           },
//         },
//         { merge: true }
//       );
//     };
//   }
//
//   return (
//     <div className="text-center w-full  text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
//       <h1 className="text-center text-3xl">Home</h1>
//       <p>Navigate to the page of your choice using the left sidebar.</p>
//
// <h2 className="text-center text-2xl">Developer Links</h2>
//       <p>
//         <a href="https://www.lipsum.com/">https://www.lipsum.com/</a>
//       </p>
//       <p>
//         <a href="https://hipsum.co/">https://hipsum.co/</a>
//       </p>
//       <p>
//         <a href="https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes">
//           https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
//         </a>
//       </p>
//       <p>
//         <a href="https://dev.to/willholmes/multi-nested-dynamic-routes-in-nextjs-30f7">
//           https://dev.to/willholmes/multi-nested-dynamic-routes-in-nextjs-30f7
//         </a>
//       </p>
//       <p>
//         <a href="https://firebase.google.com/docs/firestore/best-practices">
//           https://firebase.google.com/docs/firestore/best-practices
//         </a>
//       </p>
//       <p>
//         <a href="https://swr.vercel.app/docs/advanced/understanding">
//           https://swr.vercel.app/docs/advanced/understanding
//         </a>
//       </p>
//     </div>
//   );
// }
//
// //export const GetServerSideProps = () => {};
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, deleteField, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";

export default function Homepage() {
    const { currentUser } = useAuth();
    const [edit, setEdit] = useState(null);
    const [course, setCourse] = useState("");
    const [edittedValue, setEdittedValue] = useState("");

    const { courses, setCourses } = useFetchCourses();

    async function handleAddCourse() {
        if (!course) return;
        const docRef = await addDoc(collection(db, "courses"), course);
        setCourse("");
    }

    async function handleEditCourse(i) {
        if (!edittedValue) return;
        const newKey = edit;
        setCourses({ ...courses, [newKey]: edittedValue });
        const userRef = doc(db, "courses", currentUser.uid);
        await setDoc(userRef, { courses: { [newKey]: edittedValue } }, { merge: true });
        setEdit(null);
        setEdittedValue("");
    }

    function handleAddEdit(courseKey) {
        return () => {
            setEdit(courseKey);
            setEdittedValue(courses[courseKey]);
        };
    }

    async function handleDelete(courseKey) {
        const tempObj = { ...courses };
        delete tempObj[courseKey];
        setCourses(tempObj);
        const userRef = doc(db, "courses", currentUser.uid);
        await setDoc(userRef, { courses: { [courseKey]: deleteField() } }, { merge: true });
    }

    return (
        <div className="container text-center my-4">
            <h1 className="mb-4">Home</h1>
            <p>Navigate to the page of your choice using the left sidebar.</p>
            <h2 className="mt-5 mb-3">Developer Links</h2>
            <div className="list-group">
                <a href="https://www.lipsum.com/" className="list-group-item list-group-item-action">
                    https://www.lipsum.com/
                </a>
                <a href="https://hipsum.co/" className="list-group-item list-group-item-action">
                    https://hipsum.co/
                </a>
                <a href="https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes" className="list-group-item list-group-item-action">
                    https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
                </a>
                <a href="https://dev.to/willholmes/multi-nested-dynamic-routes-in-nextjs-30f7" className="list-group-item list-group-item-action">
                    https://dev.to/willholmes/multi-nested-dynamic-routes-in-nextjs-30f7
                </a>
                <a href="https://firebase.google.com/docs/firestore/best-practices" className="list-group-item list-group-item-action">
                    https://firebase.google.com/docs/firestore/best-practices
                </a>
                <a href="https://swr.vercel.app/docs/advanced/understanding" className="list-group-item list-group-item-action">
                    https://swr.vercel.app/docs/advanced/understanding
                </a>
            </div>
        </div>
    );
}

