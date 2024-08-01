import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { doc, collection, getDocs, getDoc, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { Button } from "@mui/material";
import { startCase } from "lodash";
import Link from "next/link";

export default function CoursePage() {
  const [courseContent, setCourseContent] = useState([]);
  const router = useRouter();
  const docId = router.query.docId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseContentCollection = collection(db, "courseContent");
        const q = query(courseContentCollection, where("courseDocId", "==", docId));
        const querySnapshot = await getDocs(q);

        const contentData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        contentData.sort((a, b) => a.contentOrder - b.contentOrder);
        setCourseContent(contentData);
      } catch (error) {
        console.error("Error retrieving course content:", error);
      }
    };

    if (docId) {
      fetchData();
    }
  }, [docId]);

  const handleDelete = async (contentId) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this content?\n\nDeleting content will move it to Archived Course Content."
    );
    if (confirmDelete) {
      try {
        const courseDocRef = doc(db, "courseContent", contentId);
        const courseSnapshot = await getDoc(courseDocRef);
        const courseData = courseSnapshot.data();

        const archivedContentCollection = collection(db, "archivedCourseContent");
        await addDoc(archivedContentCollection, courseData);

        await deleteDoc(courseDocRef);
        setCourseContent((prevContent) => prevContent.filter((content) => content.id !== contentId));

        console.log("Content moved to archives");
      } catch (error) {
        console.error("Error deleting content:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    const timestamp = Date.parse(dateString);
    if (isNaN(timestamp)) {
      return "Invalid date format";
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month} ${day}, ${year} ${hours}:${minutes}`;
  };

  return (
      <div className="container my-4">
        <h1 className="text-center mb-4">Course Content Management</h1>
        <table className="table table-striped table-bordered">
          <thead>
          <tr>
            <th>Content Order</th>
            <th>Title</th>
            <th>Type</th>
            <th>Due at</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {courseContent.map((content) => (
              <tr key={content.id}>
                <td>{content.contentOrder}</td>
                <td>{content.title}</td>
                <td>{startCase(content.type)}</td>
                <td>{formatDate(content.due)}</td>
                <td className="d-flex justify-content-between">
                  {content.type === "video" && (
                      <Link href={`/editTimestamps/${docId}/`} passHref>
                        <Button size="small" variant="contained" color="success">
                          Edit Video Questions
                        </Button>
                      </Link>
                  )}
                  {content.type === "quiz" && (
                      <Link href={`/editQuizQuestions/${docId}`} passHref>
                        <Button size="small" variant="contained" color="success">
                          Edit Quiz Questions
                        </Button>
                      </Link>
                  )}
                  <Link href={`/editCourseContent/${docId}`} passHref>
                    <Button size="small" variant="contained" className="mx-1">
                      Edit Content
                    </Button>
                  </Link>
                  <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(content.id)}
                  >
                    Delete Content
                  </Button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>

        <div className="mt-5">
          <Link href={`/addCourseContent/${docId}`} passHref>
            <Button variant="contained">Add New Content</Button>
          </Link>
        </div>
      </div>
  );
}
