import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Button } from "@mui/material";

export default function EditAnnouncement() {
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    releaseDate: "",
    expiryDate: "",
    activeCourses: [],
  });
  const [courses, setCourses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "announcements", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data());
        }

        const coursesQuery = query(
            collection(db, "courses"),
            where("activeCourse", "==", true)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const activeCoursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCourses(activeCoursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const docRef = doc(db, "announcements", id);
      await updateDoc(docRef, formData);

      setSuccessMessage("Announcement updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        router.push("/announcements");
      }, 2000);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (courseId) => {
    setFormData((prevFormData) => {
      const activeCourses = prevFormData.activeCourses.includes(courseId)
          ? prevFormData.activeCourses.filter((id) => id !== courseId)
          : [...prevFormData.activeCourses, courseId];
      return { ...prevFormData, activeCourses };
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (!formData) return <p>No data found</p>;

  return (
      <>
        <div className="container">
          <h1 className="mb-4">Edit Announcement</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="text">Text</label>
              <textarea
                  className="form-control"
                  id="text"
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  rows="4"
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="releaseDate">Release Date</label>
              <input
                  type="datetime-local"
                  className="form-control"
                  id="releaseDate"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                  type="datetime-local"
                  className="form-control"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Active Courses</label>
              {courses.map((course) => (
                  <div className="form-check" key={course.id}>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`course-${course.id}`}
                        checked={formData.activeCourses.includes(course.id)}
                        onChange={() => handleCheckboxChange(course.id)}
                    />
                    <label
                        className="form-check-label"
                        htmlFor={`course-${course.id}`}
                    >
                      {course.courseCode} - {course.name}
                    </label>
                  </div>
              ))}
            </div>
            <Button variant="contained" type="submit" className="mt-3">
              Save Changes
            </Button>
            {successMessage && <p className="text-success mt-3">{successMessage}</p>}
          </form>
        </div>
      </>
  );
}
