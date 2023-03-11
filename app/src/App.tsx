import { Route, Routes } from 'react-router-dom';
import { ApiContextProvider } from './context/ApiContext';
import CredentialCreation from './CredentialCreation';
import CredentialDetail from './CredentialDetail';
import TaskList from './TaskList';
import ProposalList from './ProposalList';
import Nav from './Nav';

function App() {
  return (
    <>
      <ApiContextProvider>
        <Routes>
          <Route path="/" element={<CredentialDetail />} />
          <Route path="/credential/creation" element={<CredentialCreation />} />
          <Route path="/task" element={<TaskList />} />
          <Route path="/proposal" element={<ProposalList />} />
        </Routes>
      </ApiContextProvider>
      <Nav />
    </>
  );
}

export default App;