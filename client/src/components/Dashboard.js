import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Divider,
  Alert
} from '@mui/material';
import { ShoppingCart, Add, Remove, Close as CloseIcon } from '@mui/icons-material';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/items', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      if (selectedCategory === category) {
        // If clicking the same category again, show all items
        setSelectedCategory(null);
        await fetchItems();
      } else {
        setSelectedCategory(category);
        const response = await fetch(`http://localhost:5001/api/items/category/${category}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching category items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item._id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems(cartItems.map(item => {
      if (item._id === itemId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePaymentSubmit = async () => {
    try {
      setError('');
      // Here you would typically integrate with a payment processor
      // For now, we'll simulate a successful payment
      setOrderSuccess(true);
      setCartItems([]);
      setPaymentOpen(false);
      setTimeout(() => setOrderSuccess(false), 5000);
    } catch (error) {
      setError('Payment failed. Please try again.');
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1">
            Welcome, {user?.name}
          </Typography>
          <Box>
            <IconButton 
              onClick={() => setCartOpen(true)}
              sx={{ mr: 2 }}
              color="primary"
            >
              <ShoppingCart />
              {cartItems.length > 0 && (
                <Chip
                  label={cartItems.length}
                  size="small"
                  sx={{ 
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }}
                />
              )}
            </IconButton>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Grid>

        {orderSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Order placed successfully! Thank you for your purchase.
          </Alert>
        )}

        {/* Categories Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Categories</Typography>
          <Grid container spacing={2}>
            {['Summer', 'Essentials', 'Accessories', 'Jewelry'].map((category) => (
              <Grid item key={category}>
                <Chip
                  label={category}
                  clickable
                  color={selectedCategory === category ? "primary" : "default"}
                  variant={selectedCategory === category ? "filled" : "outlined"}
                  onClick={() => handleCategoryClick(category)}
                  sx={{
                    '&:hover': {
                      backgroundColor: selectedCategory === category ? 'primary.dark' : 'primary.light',
                    }
                  }}
                />
              </Grid>
            ))}
            {selectedCategory && (
              <Grid item>
                <Chip
                  label="Clear Filter"
                  clickable
                  color="secondary"
                  onClick={() => handleCategoryClick(selectedCategory)}
                  sx={{ ml: 1 }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
        

        {/* Items Grid */}
        <Grid container spacing={3}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : items.length > 0 ? (
            items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl.startsWith('/uploads/') 
                      ? `http://localhost:5001${item.imageUrl}`
                      : item.imageUrl}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                      console.warn(`Failed to load image for ${item.name}:`, item.imageUrl);
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNFNUU1RTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTZweCIgZmlsbD0iIzY2NjY2NiI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        ${item.price}
                      </Typography>
                      <Chip
                        label={item.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      fullWidth
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                {selectedCategory 
                  ? `No items available in ${selectedCategory} category.`
                  : 'No items available at the moment.'}
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Cart Dialog */}
        <Dialog 
          open={cartOpen} 
          onClose={() => setCartOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Shopping Cart
            <IconButton
              onClick={() => setCartOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {cartItems.length === 0 ? (
              <Typography variant="body1" textAlign="center" py={3}>
                Your cart is empty
              </Typography>
            ) : (
              <List>
                {cartItems.map((item) => (
                  <React.Fragment key={item._id}>
                    <ListItem>
                      <ListItemText
                        primary={item.name}
                        secondary={`$${item.price} x ${item.quantity}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton onClick={() => updateQuantity(item._id, -1)}>
                          <Remove />
                        </IconButton>
                        <Typography component="span" sx={{ mx: 1 }}>
                          {item.quantity}
                        </Typography>
                        <IconButton onClick={() => updateQuantity(item._id, 1)}>
                          <Add />
                        </IconButton>
                        <IconButton 
                          onClick={() => removeFromCart(item._id)}
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                <ListItem>
                  <ListItemText
                    primary="Total"
                    primaryTypographyProps={{
                      variant: 'h6',
                      sx: { fontWeight: 'bold' }
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ${getTotalPrice().toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
            <Button
              variant="contained"
              color="primary"
              disabled={cartItems.length === 0}
              onClick={() => {
                setCartOpen(false);
                setPaymentOpen(true);
              }}
            >
              Proceed to Payment
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Payment Details
            <IconButton
              onClick={() => setPaymentOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="Cardholder Name"
                  fullWidth
                  value={paymentDetails.name}
                  onChange={handlePaymentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="cardNumber"
                  label="Card Number"
                  fullWidth
                  value={paymentDetails.cardNumber}
                  onChange={handlePaymentChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="expiryDate"
                  label="MM/YY"
                  fullWidth
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="cvv"
                  label="CVV"
                  fullWidth
                  type="password"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Typography>
                  Total Amount: ${getTotalPrice().toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPaymentOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePaymentSubmit}
            >
              Pay ${getTotalPrice().toFixed(2)}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Dashboard; 