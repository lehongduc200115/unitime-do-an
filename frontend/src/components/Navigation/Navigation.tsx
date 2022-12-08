// import { NavLink } from "react-router-dom";
import {
  AppBar,
  Link,
  Toolbar,
  Button
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import { useAuth } from "./AuthProvider";
// import { useAuth } from "./App";

export const Navigation = () => {
  // const { email, onLogout } = useAuth();
  return (
    <AppBar
    position="static"
    color="primary"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Link
        variant="h5"
        color="inherit"
        href="/"
        underline="none"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        UNITIME
      </Link>
      <nav>
        <Link
          variant="button"
          color="inherit"
          href="/subject"
          underline="none" 
          sx={{ my: 1, mx: 1.5 }}
        >
          Subject
        </Link>
        <Link
          variant="button"
          color="inherit"
          href="/room"
          underline="none" 
          sx={{ my: 1, mx: 1.5 }}
        >
          Room
        </Link>
        <Link
          variant="button"
          color="inherit"
          href="/instructor"
          underline="none" 
          sx={{ my: 1, mx: 1.5 }}
        >
          Instructor
        </Link>
        <Link
          variant="button"
          color="inherit"
          href="/student"
          underline="none" 
          sx={{ my: 1, mx: 1.5 }}
        >
          Student
        </Link>
      </nav>
      <Button
        startIcon={<CalendarMonthIcon/>}
        href="/timetable"
        variant="outlined"
        color='inherit'
        sx={{ my: 1, mx: 1.5 }}
      >
        Timetabling
      </Button>
    </Toolbar>
  </AppBar>
    // <nav>
    //   <NavLink to="/">Home</NavLink>
    //   <NavLink to="/login">Login</NavLink>
    //   <NavLink to="/pricing">Pricing</NavLink>
    //   <NavLink to="/checkout">Checkout</NavLink>
    //   <NavLink to="/register">Sign Up</NavLink>
    //   {email && (
    //     <button type="button" onClick={onLogout}>
    //       Sign Out
    //     </button>
    //   )}
    // </nav>
  );
};
