import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Card, CardContent, Chip, CircularProgress, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Drawer } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { getOrders, confirmOrder, completeOrder, type OrderHistoryItem, type StartOrderResponse } from '../services/customerService';
import LoadingOverlay from '../components/LoadingOverlay';

export default function OrderHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
    const [depositErrorMsg, setDepositErrorMsg] = useState('');
    const [isOverlayLoading, setIsOverlayLoading] = useState(false);

    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<StartOrderResponse['order'] | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            if (response) {
                setOrders(response.orders);
            } else {
                setError('Failed to load orders');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirmOrder = async (orderId: string) => {
        setSubmittingId(orderId);
        setIsOverlayLoading(true);
        try {
            const response = await confirmOrder(orderId);
            // Success - refresh list and open drawer
            fetchOrders();
            setCurrentOrder(response.order);
            setIsDrawerOpen(true);
        } catch (error: any) {
            console.error('Failed to confirm order:', error);
            if (error.message && error.message.includes('Insufficient balance')) {
                setDepositErrorMsg(error.message);
                setIsDepositDialogOpen(true);
            } else {
                alert(error.message || 'Failed to confirm order');
            }
        } finally {
            setSubmittingId(null);
            setIsOverlayLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        if (!currentOrder) return;
        setSubmittingId(currentOrder.order_id);
        setIsOverlayLoading(true);
        try {
            await completeOrder(currentOrder.order_id);
            setIsDrawerOpen(false);
            // Refresh list to show updated status
            fetchOrders();
        } catch (error: any) {
            console.error('Failed to complete order:', error);
            alert(error.message || 'Failed to complete order');
        } finally {
            setSubmittingId(null);
            setIsOverlayLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'PENDING': return 'warning';
            case 'CANCELED': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ pb: 10, pt: 2 }}>
            <LoadingOverlay open={isOverlayLoading} />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" fontWeight="700">Order History</Typography>
            </Box>

            {error && (
                <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
                    {error}
                </Typography>
            )}

            {!loading && !error && orders.length === 0 && (
                <Typography sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                    No orders found.
                </Typography>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {orders.map((order) => (
                    <Card key={order.order_id} sx={{ borderRadius: 3, boxShadow: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(order.createdAt).toLocaleString()}
                                </Typography>
                                <Chip
                                    label={order.status}
                                    size="small"
                                    color={getStatusColor(order.status) as any}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <img
                                    src={order.product.image}
                                    alt={order.product.name}
                                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                        {order.product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                        {order.product.description}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Order ID</Typography>
                                    <Typography variant="body2" fontWeight="500">{order.order_id}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Amount</Typography>
                                    <Typography variant="body2" fontWeight="600">${order.amount.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Commission</Typography>
                                    <Typography variant="body2" fontWeight="600" color="success.main">
                                        ${order.commission.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>

                            {order.status === 'PENDING' && (
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="medium"
                                    onClick={() => handleConfirmOrder(order.order_id)}
                                    disabled={submittingId === order.order_id}
                                    sx={{
                                        mt: 2,
                                        bgcolor: '#1a1d28',
                                        '&:hover': { bgcolor: '#2c2d45' }
                                    }}
                                >
                                    {submittingId === order.order_id ? 'Submitting...' : 'Submit'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog
                open={isDepositDialogOpen}
                onClose={() => setIsDepositDialogOpen(false)}
            >
                <DialogTitle sx={{ color: 'error.main', fontWeight: 'bold' }}>Insufficient Balance</DialogTitle>
                <DialogContent>
                    <Typography>
                        {depositErrorMsg}
                    </Typography>
                    <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">
                        Please deposit funds to continue processing orders.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setIsDepositDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => navigate('/deposit')}
                        variant="contained"
                        color="primary"
                        autoFocus
                    >
                        Go to Deposit
                    </Button>
                </DialogActions>
            </Dialog>

            <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px',
                        maxHeight: '85vh',
                        background: 'var(--color-bg-secondary)',
                        color: 'var(--color-text-primary)'
                    }
                }}
            >
                {currentOrder && (
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ position: 'relative', mb: 2 }}>
                            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 700 }}>
                                Order Details
                            </Typography>
                            <IconButton
                                onClick={() => setIsDrawerOpen(false)}
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'text.secondary'
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <img
                                src={currentOrder.product.image}
                                alt={currentOrder.product.name}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                            />
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {currentOrder.product.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                                    {currentOrder.product.description}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                                    ID: {currentOrder.product.product_id}
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mb: 0.5 }}>
                                    Rating: {'⭐'.repeat(Math.round(currentOrder.product.rating))} ({currentOrder.product.rating})
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    ${currentOrder.product.price.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.05)', p: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order ID</Typography>
                                <Typography variant="body2" fontWeight="600">{currentOrder.order_id}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Status</Typography>
                                <Typography variant="body2" fontWeight="600" sx={{ color: 'warning.main' }}>
                                    {currentOrder.status}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order Date</Typography>
                                <Typography variant="body2" fontWeight="600">
                                    {new Date(currentOrder.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                            {currentOrder.completedAt && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Completed Time</Typography>
                                    <Typography variant="body2" fontWeight="600">
                                        {new Date(currentOrder.completedAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Order Number</Typography>
                                <Typography variant="body2" fontWeight="600">{currentOrder.orderNumber}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Commission Rate</Typography>
                                <Typography variant="body2" fontWeight="600">{currentOrder.product.commission}%</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2">Estimated Commission</Typography>
                                <Typography variant="body2" fontWeight="600" color="success.main">
                                    ${(currentOrder.product.price * (currentOrder.product.commission / 100)).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleCompleteOrder}
                            disabled={submittingId === currentOrder.order_id}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                bgcolor: 'success.main',
                                '&:hover': { bgcolor: 'success.dark' }
                            }}
                        >
                            COMPLETE ORDER
                        </Button>
                    </Box>
                )}
            </Drawer>
        </Container>
    );
}
