import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import RememberMeIcon from '@mui/icons-material/RememberMe';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const Nav = () => {
  const navigate = useNavigate();
  return (
    <Paper className='fixed bottom-0 left-0 right-0 min-h-[70px]' elevation={3}>
      <BottomNavigation
        className='mt-1.5'
        showLabels
      >
        <BottomNavigationAction label='社員証' onClick={() => navigate('/')} icon={<RememberMeIcon fontSize='large' />} />
        <BottomNavigationAction label='タスク' onClick={() => navigate('/task')} icon={<AssignmentTurnedInIcon fontSize='large' />} />
        <BottomNavigationAction label='投票' onClick={() => navigate('/proposal')} icon={<HowToVoteIcon fontSize='large' />} />
      </BottomNavigation>
    </Paper>
  )
}
export default Nav