import { Route, Routes } from 'react-router-dom';
import { ApiContextProvider } from './context/ApiContext';
import CredentialCreation from './CredentialCreation';
import CredentialDetail from './CredentialDetail';
import TaskList from './TaskList';
import ProposalList from './ProposalList';
import Nav from './Nav';
import ProposalCreation from './ProposalCreation';
import ProposalItemDetail from './ProposalItemDetail';

function App() {
  return (
    <>
      <ApiContextProvider>
        <Routes>
          <Route path="/" element={<CredentialDetail />} />
          <Route path="/credential/creation" element={<CredentialCreation />} />
          <Route path="/task" element={<TaskList />} />
          <Route path="/proposal" element={<ProposalList />} />
          <Route path="/proposal/creation" element={<ProposalCreation />} />
          <Route path="/proposal/:proposalId" element={<ProposalItemDetail />} />
        </Routes>
      </ApiContextProvider>
      <Nav />
    </>
  );
}

export default App;