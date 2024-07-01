import {AppBar, Box, IconButton, styled, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu.js";
import Button from "@mui/material/Button";
import { useTheme } from '@mui/material/styles';

const Offset = styled('div')(({theme}) => theme.mixins.toolbar);

export function NavBar() {
  const theme = useTheme();

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="fixed" sx={{ backgroundColor: theme.palette.gladeGreen[700] }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
          >

            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            Travlr
          </Typography>
          <Button color="inherit">My Account</Button>
        </Toolbar>
      </AppBar>
      <Offset/>
    </Box>
  );
}