import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchUsers from "../hooks/fetchUsers";
import { Button } from "@mui/material";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";

export default function UserDashboard() {
  const { currentUser, isAdmin } = useContext(AuthContext);
  const [edit, setEdit] = useState(null);
  const [edittedValue, setEdittedValue] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState("");

  const { users, setUsers, loading, error } = useFetchUsers();

  async function handleDelete(userId) {
    try {
      await setDoc(
          doc(db, "users", userId),
          { deleted: true },
          { merge: true }
      );
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function renderSortArrow() {
    if (sortOrder === "") {
      return "↑↓";
    } else if (sortOrder === "asc") {
      return "↑↑";
    } else {
      return "↓↓";
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (sortField === "isAdmin") {
      const fieldA = a[sortField] ? 1 : 0;
      const fieldB = b[sortField] ? 1 : 0;
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    } else {
      const fieldA = a[sortField] ? String(a[sortField]).toLowerCase() : "";
      const fieldB = b[sortField] ? String(b[sortField]).toLowerCase() : "";
      return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    }
  });

  const filteredUsers = sortedUsers.filter((user) =>
      Object.values(user).some((value) =>
          value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
  );

  function handleSearchChange(event) {
    setSearchValue(event.target.value);
  }

  return (
      <div className="container my-4">
        <h1 className="text-center mb-4">User List</h1>
        <div className="mt-4 d-md-block d-lg-none">
          <h5>Legend</h5>
          <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center mx-2 text-primary">
              <AiOutlineEdit className="me-1" />
              <span>Edit User</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-danger">
              <AiOutlineDelete className="me-1" />
              <span>Delete User</span>
            </div>
            <div className="d-flex align-items-center mx-2 text-info">
              <AiOutlinePlus className="me-1" />
              <span>Add New User</span>
            </div>
          </div>
        </div>
        {loading && (
            <div className="d-flex justify-content-center my-4">
              <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
            </div>
        )}
        <div className="current-users">
          {!loading && (
              <>
                <div className="mb-3">
                  <label htmlFor="searchInput" className="form-label">
                    Search for a user:
                  </label>
                  <input
                      type="text"
                      id="searchInput"
                      className="form-control"
                      value={searchValue}
                      onChange={handleSearchChange}
                      placeholder="Search"
                  />
                </div>
                <table className="table table-striped table-bordered">
                  <thead>
                  <tr>
                    <th>
                      <button className="btn btn-link" onClick={() => handleSort("firstName")}>
                        First Name {sortField === "firstName" && renderSortArrow()}
                      </button>
                    </th>
                    <th>
                      <button className="btn btn-link" onClick={() => handleSort("lastName")}>
                        Last Name {sortField === "lastName" && renderSortArrow()}
                      </button>
                    </th>
                    <th>
                      <button className="btn btn-link" onClick={() => handleSort("studentNumber")}>
                        Student # {sortField === "studentNumber" && renderSortArrow()}
                      </button>
                    </th>
                    <th>
                      <button className="btn btn-link" onClick={() => handleSort("isAdmin")}>
                        Admin {sortField === "isAdmin" && renderSortArrow()}
                      </button>
                    </th>
                    <th>
                      <button className="btn btn-link" onClick={() => handleSort("email")}>
                        Email {sortField === "email" && renderSortArrow()}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {filteredUsers.map((user, i) => (
                      <tr key={i}>
                        <td>{user.firstName || ""}</td>
                        <td>{user.lastName || ""}</td>
                        <td>{user.studentNumber}</td>
                        <td>{user.isAdmin ? "✅" : "❌"}</td>
                        <td>{user.email}</td>
                        <td className="d-flex justify-content-between">
                          <Link href={`/editUser/${user.id}`} passHref>
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
                              onClick={() => handleDelete(user.id)}
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
                  <Link href="/addUser" passHref>
                    <Button size="large" className="btn-narrow" variant="outlined">
                      <span className="d-none d-lg-inline">Add New User</span>
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
