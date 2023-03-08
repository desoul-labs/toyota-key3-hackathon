import { ApiContextProvider } from './context/ApiContext';
import CredentialCreation from './CredentialCreation';
import CredentialDetail from './CredentialDetail';
import TaskList from './TaskList';
import Nav from './Nav';
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <>
      <ApiContextProvider>
        <Routes>
          <Route path="/" element={<CredentialDetail />} />
          <Route path="/credential/creation" element={<CredentialCreation />} />
          <Route path="/task" element={<TaskList />} />
        </Routes>
      </ApiContextProvider>
      <Nav />
    </>
  );
}

export default App;