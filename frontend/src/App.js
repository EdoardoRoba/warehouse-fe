import logo from './logo.svg';
import './App.css';
import * as React from "react";
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Warehouse from './components/Warehouse';
import History from './components/History';
import Customers from './components/Customers';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@mui/material/Container';

const pages = [{ label: 'Magazzino', id: 'warehouse' }, { label: 'Storico', id: 'history' }, { label: 'Clienti', id: 'customers' }];

function App() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    style={{ color: 'white' }}
                  >
                    <Link style={{ color: 'white' }} to={"/" + page.id}>{page.label}</Link>
                  </Button>
                ))}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
        {/* <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>s
            <Link to="/warehouse">Magazzino</Link>
          </li>
          <li>
            <Link to="/history">Storico</Link>
          </li>
        </ul> */}
        <Routes>
          <Route exact path='/' element={< Home />}></Route>
          <Route exact path='/warehouse' element={< Warehouse />}></Route>
          <Route exact path='/history' element={< History />}></Route>
          <Route exact path='/customers' element={< Customers />}></Route>
        </Routes>
      </div>
    </Router >
  );
}

export default App;
