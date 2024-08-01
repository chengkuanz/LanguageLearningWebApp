// import { useAuth } from '../context/AuthContext'
// import { db } from '../firebase'
// import { collection, getDocs } from 'firebase/firestore'
// import useSWR from 'swr'
//
// const fetchUsers = async () => {
//   const usersCollection = collection(db, 'users')
//   const usersSnapshot = await getDocs(usersCollection)
//   const userData = [];
//   usersSnapshot.forEach((doc) => {
//     const user = { id: doc.id, ...doc.data() };
//
//       userData.push(user);
//
//   });
//     return userData
// }
//
// export default function useFetchUsers() {
//   const { currentUser } = useAuth()
//   const { data: users, error } = useSWR(currentUser ? 'users' : null, fetchUsers)
//   return {
//     users: users || [],
//     isLoading: !error && !users,
//     isError: error,
//   }
// }
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const fetchUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  const userData = [];
  usersSnapshot.forEach((doc) => {
    const user = { id: doc.id, ...doc.data() };
    userData.push(user);
  });
  return userData;
};

export default function useFetchUsers() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUsers()
          .then((data) => {
            setUsers(data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching users: ", error);
            setIsError(true);
            setIsLoading(false);
          });
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  return {
    users,
    setUsers,
    isLoading,
    isError,
  };
}
