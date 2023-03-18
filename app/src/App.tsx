import { Route, Routes } from 'react-router-dom';
import { ApiContextProvider } from './context/ApiContext';
import CredentialCreation from './CredentialCreation';
import CredentialDetail from './CredentialDetail';
import TaskList from './TaskList';
import ProposalList from './ProposalList';
import Nav from './Nav';
import ProposalCreation from './ProposalCreation';
import ProposalItemDetail from './ProposalItemDetail';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

function App() {
  return (
    <>
      <ApiContextProvider>
        <Box sx={{ marginBottom: '80px' }}>
          <Routes>
            <Route path="/" element={<CredentialDetail />} />
            <Route path="/credential/creation" element={<CredentialCreation />} />
            <Route path="/task" element={<TaskList />} />
            <Route path="/proposal" element={<ProposalList />} />
            <Route path="/proposal/creation" element={<ProposalCreation />} />
            <Route path="/proposal/:proposalId" element={<ProposalItemDetail />} />
          </Routes>
        </Box>
      </ApiContextProvider>
      <Nav />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;