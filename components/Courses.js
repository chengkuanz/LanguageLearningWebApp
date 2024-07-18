import React from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import useFetchCourses from "../hooks/fetchCourses";
import Link from "next/link";
import { Button } from "@mui/material";
import { AiOutlineEye, AiOutlineEdit, AiOutlineBook, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";

export default function Homepage() {
  const { courses, isLoading, isError } = useFetchCourses();

  const handleArchive = async (courseKey) => {
    try {
      const confirmed = window.confirm(
          "Are you sure you want to archive this course?\n\nThis will mark the course as inactive and remove it from the current courses list."
      );

      if (confirmed) {
        const courseDocRef = doc(db, "courses", courseKey);
        const courseSnapshot = await getDoc(courseDocRef);
        const courseData = courseSnapshot.data();

        await updateDoc(courseDocRef, { activeCourse: false });

        console.log("Course moved to archives");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
      <div className="container-fluid text-center my-4">
        <div className="d-flex align-items-center mb-4">
          <h1 className="text-3xl">Course List</h1>
        </div>
        <div className="mt-4 d-md-block d-lg-none">
          <h5>Legend</h5>
          <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center mx-2 text-success">
              <AiOutlineEye className="me-1" />
              <span>View Students</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-primary">
              <AiOutlineEdit className="me-1" />
              <span>Edit Content</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-warning">
              <AiOutlineBook className="me-1" />
              <span>Edit Course</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-danger">
              <AiOutlineDelete className="me-1" />
              <span>Archive Course</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-info">
              <AiOutlinePlus className="me-1" />
              <span>Add New Course</span>
            </div>
          </div>
        </div>
        {isLoading && (
            <div className="d-flex justify-content-center mt-4">
              <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            </div>
        )}
        <div className="current-courses">
          {!isLoading && (
              <>
                <table className="table table-striped table-bordered mt-4">
                  <thead>
                  <tr>
                    <th>Active</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Section</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {courses.map((content) => (
                      <tr key={content.id}>
                        <td>{content.activeCourse ? "✅" : "❌"}</td>
                        <td>{content.name}</td>
                        <td>{content.courseCode}</td>
                        <td>{content.section}</td>
                        <td>{content.dayOfWeek}</td>
                        <td>{content.time}</td>
                        <td className="d-flex justify-content-between">
                          <Link href={`/viewCourseStudents/${content.id}`} passHref>
                            <Button size="small" className="me-1 btn-narrow" variant="contained" color="success">
                              <span className="d-none d-lg-inline">View Students</span>
                              <AiOutlineEye className="d-lg-none" />
                            </Button>
                          </Link>
                          <Link href={`/courseContent/${content.id}`} passHref>
                            <Button size="small" className="btn-narrow" variant="contained" color="primary">
                              <span className="d-none d-lg-inline">Edit Content</span>
                              <AiOutlineEdit className="d-lg-none" />
                            </Button>
                          </Link>
                          <Link href={`/editCourse/${content.id}`} passHref>
                            <Button size="small" className="mx-1 btn-narrow" variant="contained" color="warning">
                              <span className="d-none d-lg-inline">Edit Course</span>
                              <AiOutlineBook className="d-lg-none" />
                            </Button>
                          </Link>
                          <Button size="small" className="btn-narrow" color="error" variant="contained" onClick={() => handleArchive(content.id)}>
                            <span className="d-none d-lg-inline">Archive Course</span>
                            <AiOutlineDelete className="d-lg-none" />
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>

                <div className="mt-5">
                  <Link href="/AddCourse" passHref>
                    <Button size="large" className="btn-narrow" variant="outlined">
                      <span className="d-none d-lg-inline">Add New Course</span>
                      <AiOutlinePlus className="d-lg-none" />
                    </Button>
                  </Link>
                </div>
              </>
          )}
        </div>
      </div>
  );
}
