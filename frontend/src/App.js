import './App.css';
import * as React from "react";
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Warehouse from './components/Warehouse';
import History from './components/History';
import Customers from './components/Customers';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
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
          <Container maxWidth="xl" style={{ marginLeft: '0' }}>
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
        <Routes>
          <Route exact path="/" element={<Warehouse replace to="/warehouse" />} />
          <Route exact path='/warehouse' element={< Warehouse />}></Route>
          <Route exact path='/history' element={< History />}></Route>
          <Route exact path='/customers' element={< Customers />}></Route>
        </Routes>
      </div>
    </Router >
  );
}

export default App;
