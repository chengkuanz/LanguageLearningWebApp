import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import useFetchAnnouncements from "../hooks/fetchAnnouncements";
import { Button } from "@mui/material";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [edit, setEdit] = useState(null);
  const [edittedValue, setEdittedValue] = useState("");

  const { announcements, setAnnouncements, isLoading, error } = useFetchAnnouncements();

  async function handleEditUser(i) {
    if (!edittedValue) {
      return;
    }
    const newKey = edit;
    setUsers({ ...users, [newKey]: edittedValue });
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
        userRef,
        {
          users: {
            [newKey]: edittedValue,
          },
        },
        { merge: true }
    );
    setEdit(null);
    setEdittedValue("");
  }

  function handleAddEdit(userKey) {
    return () => {
      console.log(users[userKey]);
      setEdit(userKey);
      setEdittedValue(users[userKey]);
    };
  }

  const handleDelete = (docId) => {
    console.log("In delete function");

    const confirmed = window.confirm("Are you sure you want to delete this announcement?");

    if (confirmed) {
      (async () => {
        try {
          const announcementDocRef = doc(db, "announcements", docId);

          await deleteDoc(announcementDocRef);

          alert("Announcement deleted successfully!");

          setAnnouncements(announcements.filter((announcement) => announcement.id !== docId));
        } catch (error) {
          console.error("Error deleting announcement:", error);
          alert("An error occurred while deleting the announcement.");
        }
      })();
    }
  };

  return (
      <div className="container-fluid text-center my-4">
        <h1 className="text-center mb-4">Announcements</h1>
        <div className="mt-4 d-md-block d-lg-none">
          <h5>Legend</h5>
          <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center mx-2 text-primary">
              <AiOutlineEdit className="me-1" />
              <span>Edit</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-danger">
              <AiOutlineDelete className="me-1" />
              <span>Delete</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-info">
              <AiOutlinePlus className="me-1" />
              <span>Add New Announcement</span>
            </div>
          </div>
        </div>
        {isLoading && (
            <div className="d-flex justify-content-center my-4">
              <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            </div>
        )}
        <div className="announcements-list">
          {!isLoading && (
              <>
                <table className="table table-striped table-bordered">
                  <thead>
                  <tr>
                    <th>Title</th>
                    <th>Release Date</th>
                    <th>Expiry Date</th>
                    <th>Announcement Text</th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {announcements.map((announcement) => (
                      <tr key={announcement.id}>
                        <td>{announcement.title}</td>
                        <td>{announcement.releaseDate}</td>
                        <td>{announcement.expiryDate}</td>
                        <td>{announcement.text}</td>
                        <td className="d-flex justify-content-between">
                          <Link href={`/editAnnouncement/${announcement.id}`} passHref>
                            <Button size="small" className="btn-narrow me-1" variant="contained" color="primary">
                              <span className="d-none d-lg-inline">Edit</span>
                              <AiOutlineEdit className="d-lg-none" />
                            </Button>
                          </Link>
                          <Button
                              size="small"
                              className="btn-narrow"
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(announcement.id)}
                          >
                            <span className="d-none d-lg-inline">Delete</span>
                            <AiOutlineDelete className="d-lg-none" />
                          </Button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>

                <div className="mt-5">
                  <Link href="/addAnnouncement" passHref>
                    <Button size="large" className="btn-narrow" variant="outlined">
                      <span className="d-none d-lg-inline">Add New Announcement</span>
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
