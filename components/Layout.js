// import React from 'react';
// import Footer from './Footer';
// import Header from './Header';
// import Sidebar from './Sidebar';
// import Login from './Login';
// import { useAuth } from '../context/AuthContext';
// import AccessDenied from './AccessDenied';
//
// export default function Layout(props) {
//   const { children } = props;
//   const {currentUser, isAdmin} = useAuth();
//
//
//   return (
//
//     <div className='flex flex-col min-h-screen relative bg-neutral-800 text-white'>
//       <Header />
//       <div className='sidebar-and-main'>
//         <Sidebar />
//         <main className='flex-1 flex flex-col p-4 inline-block max-w-[82vw] ml-auto'>
//           {!currentUser && <Login />}
//           {currentUser && isAdmin ? (
//             <>
//               {children}
//             </>
//           ) : currentUser && !isAdmin ? (
//             <AccessDenied />
//           ) : null}
//         </main>
//       </div>
//       <Footer />
//     </div>
//   );
// }
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
import AccessDenied from './AccessDenied';

export default function Layout(props) {
    const { children } = props;
    const { currentUser, isAdmin } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100 bg-light text-black">
            <Header />
            <div className="container-fluid d-flex flex-grow-1">
                <div className="row flex-grow-1">
                    <div className="col-12 col-md-3 col-lg-2 p-0">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-md-9 col-lg-10 p-4">
                        {!currentUser && <Login />}
                        {currentUser && isAdmin ? (
                            <>
                                {children}
                            </>
                        ) : currentUser && !isAdmin ? (
                            <AccessDenied />
                        ) : null}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

