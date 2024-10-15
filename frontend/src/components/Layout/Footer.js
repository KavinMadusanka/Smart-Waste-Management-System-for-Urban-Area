import React from 'react';
import { Box, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1A4D2E', color: '#fff', padding: '10px 20px', mt: 'auto' }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Company Info Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            SmartWaste
          </Typography>
          <Typography variant="body2" paragraph sx={{ lineHeight: 1.8, textAlign: 'justify' }}>
            SmartWaste revolutionizes how you manage waste, offering intelligent solutions for
            efficient collection, recycling, and disposal, all while promoting a cleaner environment.
          </Typography>

          {/* Social Media Icons */}
          <Box sx={{ mt: 2 }}>
            <IconButton href="https://facebook.com" target="_blank" sx={{ color: '#fff' }}>
              <FacebookIcon />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" sx={{ color: '#fff' }}>
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://instagram.com" target="_blank" sx={{ color: '#fff' }}>
              <InstagramIcon />
            </IconButton>
            <IconButton href="https://linkedin.com" target="_blank" sx={{ color: '#fff' }}>
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Contact Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Contact Details
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            No: 6, Colombo Road
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ mr: 1 }} />
            support@smartwaste.com
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1 }} />
            (+94) 1234-567-890
          </Typography>
        </Grid>

        {/* Quick Links Section */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quick Links
          </Typography>
          <Link href="#" underline="hover" color="inherit" sx={{ display: 'block', mb: 1 }}>
            Home
          </Link>
          <Link href="#" underline="hover" color="inherit" sx={{ display: 'block', mb: 1 }}>
            About Us
          </Link>
          <Link href="#" underline="hover" color="inherit" sx={{ display: 'block', mb: 1 }}>
            Services
          </Link>
          <Link href="#" underline="hover" color="inherit" sx={{ display: 'block', mb: 1 }}>
            Contact Us
          </Link>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)', mt: 4, pt: 3, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: '14px' }}>
          © {new Date().getFullYear()} SmartWaste. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;