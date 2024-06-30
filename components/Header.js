// import React, { useState } from "react";
// import Modal from "./Modal";
// import Link from "next/link";
//
// export default function Header() {
//   const [openModal, setOpenModal] = useState(false);
//
//   return (
//     <>
//       {openModal && <Modal setOpenModal={setOpenModal} />}
//       <nav className="top-nav top-0 w-full left-0 bg-inherit flex items-center justify-between py-4 px-8">
//         <Link href="/">
//           <div>
//             <h1 className="text-3xl select-none">
//               <span className="italian-green"> Italian</span>
//               <span className="italian-white"> App</span>
//               <span className="italian-red"> Dashboard</span>
//             </h1>
//           </div>
//         </Link>
//         <i
//           onClick={() => setOpenModal(true)}
//           className="fa-solid fa-user text-xl duration-300 hover:opacity-40 cursor-pointer sm:text-3xl"
//         ></i>
//       </nav>
//     </>
//   );
// }

import React, { useState } from "react";
import Modal from "./Modal";
import Link from "next/link";

export default function Header() {
  const [openModal, setOpenModal] = useState(false);

  return (
      <>
        {openModal && <Modal setOpenModal={setOpenModal} />}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link href="/" passHref>
              <div role="button" className="navbar-brand">
                <h1 className="m-0">
                  <span className="text-success">Italian</span>
                  <span className="text-dark"> App</span>
                  <span className="text-danger"> Dashboard</span>
                </h1>
              </div>
            </Link>
            <div className="ms-auto">
              <i
                  onClick={() => setOpenModal(true)}
                  className="fa-solid fa-user text-dark fs-3 cursor-pointer"
              ></i>
            </div>
          </div>
        </nav>
      </>
  );
}


