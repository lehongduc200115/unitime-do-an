import { NavLink } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
// import { useAuth } from "./AuthProvider";
import { useAuth } from "./App";

export const Navigation = () => {
  const { email, onLogout } = useAuth();

  return (

    <AppBar
    position="static"
    color="default"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        Company name
      </Typography>
      <nav>
        <Link
          variant="button"
          color="text.primary"
          href="/pricing"
          sx={{ my: 1, mx: 1.5 }}
        >
          Pricing
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="/checkout"
          sx={{ my: 1, mx: 1.5 }}
        >
          Checkout
        </Link>
        <Link
          variant="button"
          color="text.primary"
          href="/register"
          sx={{ my: 1, mx: 1.5 }}
        >
          Sign Up
        </Link>
      </nav>
      <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
        Login
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
