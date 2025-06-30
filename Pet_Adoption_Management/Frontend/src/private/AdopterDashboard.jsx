// import React from 'react';
// import { usePets } from '../../context/PetContext';
// import { useAuth } from '../../context/AuthContext';
// import Header from '../common/Header';
// import PetCard from '../pets/PetCard';

// const AdopterDashboard = () => {
//   const { getAvailablePets, getUserAdoptionRequests } = usePets();
//   const { user } = useAuth();
  
//   const availablePets = getAvailablePets();
//   const myRequests = getUserAdoptionRequests(user.id);
//   const featuredPets = availablePets.slice(0, 3);

//   const pendingRequests = myRequests.filter(req => req.status === 'pending').length;
//   const approvedRequests = myRequests.filter(req => req.status === 'approved').length;
//   const rejectedRequests = myRequests.filter(req => req.status === 'rejected').length;

//   return (
//     <>
//       <Header title="Adopter Dashboard" />
//       <div className="content">
//         <div className="stats-grid">
//           <div className="stat-card primary">
//             <div className="stat-number">{availablePets.length}</div>
//             <div className="stat-label">Available Pets</div>
//           </div>
          
//           <div className="stat-card warning">
//             <div className="stat-number">{pendingRequests}</div>
//             <div className="stat-label">Pending Applications</div>
//           </div>
          
//           <div className="stat-card success">
//             <div className="stat-number">{approvedRequests}</div>
//             <div className="stat-label">Approved Applications</div>
//           </div>
          
//           <div className="stat-card error">
//             <div className="stat-number">{rejectedRequests}</div>
//             <div className="stat-label">Rejected Applications</div>
//           </div>
//         </div>

//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Featured Pets</h3>
//           </div>
//           <div className="card-content">
//             {featuredPets.length > 0 ? (
//               <div className="pets-grid">
//                 {featuredPets.map((pet) => (
//                   <PetCard
//                     key={pet.id}
//                     pet={pet}
//                     isAdmin={false}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="empty-state">
//                 <h3>No Pets Available</h3>
//                 <p>There are currently no pets available for adoption</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {myRequests.length > 0 && (
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title">Recent Applications</h3>
//             </div>
//             <div className="card-content">
//               <div className="table-container">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Pet</th>
//                       <th>Date Applied</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {myRequests.slice(-5).reverse().map((request) => {
//                       const pet = availablePets.find(p => p.id === request.petId) || 
//                                  JSON.parse(localStorage.getItem('pets') || '[]').find(p => p.id === request.petId);
                      
//                       return (
//                         <tr key={request.id}>
//                           <td>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//                               {pet?.image && (
//                                 <img
//                                   src={pet.image}
//                                   alt={pet?.name}
//                                   style={{
//                                     width: '40px',
//                                     height: '40px',
//                                     borderRadius: '8px',
//                                     objectFit: 'cover'
//                                   }}
//                                 />
//                               )}
//                               <div>
//                                 <div style={{ fontWeight: '500' }}>
//                                   {pet?.name || 'Unknown'}
//                                 </div>
//                                 <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
//                                   {pet?.breed}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td>{new Date(request.dateSubmitted).toLocaleDateString()}</td>
//                           <td>
//                             <span className={`status-badge ${
//                               request.status === 'pending' ? 'status-pending' :
//                               request.status === 'approved' ? 'status-adopted' :
//                               'status-badge'
//                             }`}>
//                               {request.status}
//                             </span>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default AdopterDashboard;