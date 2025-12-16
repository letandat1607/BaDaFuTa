import { afterEach, beforeEach, describe, expect, it, test, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import CustomerRegister from '../../component/customerSys/registerCustomer';
import { BrowserRouter, MemoryRouter, useLocation } from 'react-router-dom';
import Checkout from '../../component/customerSys/checkOut';
import { QRCodeSVG } from 'qrcode.react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ merchantId: 'fb325480-5b1c-4c3b-a044-2fcac7ebce02' }),
        useNavigate: () => mockNavigate,
    };
})

vi.mock('socket.io-client', () => {
    const mockSocket = {
        on: vi.fn(),
        emit: vi.fn(),
        disconnect: vi.fn(),
        connect: vi.fn(),
        id: 'mock-socket-id',
    };

    return {
        default: vi.fn(() => mockSocket),
    };
});



vi.mock('react-leaflet', async () => {
    const DummyComponent = () => null;
    const actual = await vi.importActual('react-leaflet');
    return {
        ...actual,
        MapContainer: ({ children, ...props }) => (
            <div data-testid="leaflet-map" {...props}>
                {children}
            </div>
        ),
        TileLayer: DummyComponent,
        Marker: DummyComponent,
        Popup: DummyComponent,
        useMapEvents: () => null,
        useMap: () => ({ setView: vi.fn() }),
        FlyToLocation: () => null,
    };
});

vi.mock('qrcode.react', () => {
    return {
        QRCodeSVG: vi.fn(() => null)
    };
});

globalThis.fetch = vi.fn();
globalThis.alert = vi.fn();

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('Checkout Component', () => {
    const user = userEvent.setup();
    const mockCartItems = [
        {
            user_id: "5324c950-d209-44b7-9e1b-2c3d859a17af",
            menu_item_id: "6434ea82-1629-4178-8d67-a0ac8e9039e9",
            name_item: "Pizza hải sản",
            price: 210000,
            quantity: 1,
            image_item: {
                url: "https://bazantravel.com/cdn/medias/uploads/28/28073-pizza-hai-san-uc.jpg"
            },
            merchant_id: "fb325480-5b1c-4c3b-a044-2fcac7ebce02",
            note: "",
            options: [
                {
                    option_name: "Size",
                    items: [
                        {
                            option_item_id: "8fa242ae-2d17-4920-a340-661001fb769d",
                            name: "XL",
                            price: 70000
                        }
                    ]
                }
            ]
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        window.localStorage.setItem('user', JSON.stringify({ id: "5324c950-d209-44b7-9e1b-2c3d859a17af" }));
        window.localStorage.setItem('token', 'fake-token');
        window.localStorage.setItem('cart', JSON.stringify(mockCartItems));

        globalThis.navigator.geolocation = {
            getCurrentPosition: vi.fn((success) => {
                success({
                    coords: {
                        latitude: 10.762622,
                        longitude: 106.660172,
                    },
                });
            })
        };

        globalThis.fetch.mockImplementation((url) => {
            if (url.includes('nominatim.openstreetmap.org/reverse')) {
                return Promise.resolve({
                    json: () => Promise.resolve({
                        display_name: "123 Nguyễn Huệ, Quận 1, TP.HCM"
                    })
                });
            }
            if (url.includes('nominatim.openstreetmap.org/search')) {
                return Promise.resolve({
                    json: () => Promise.resolve([{
                        lat: "10.7769",
                        lon: "106.7009",
                        display_name: "Searched Address"
                    }])
                });
            }
            if (url.includes('/api/order/checkOutOrder')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ order_id: 'ORDER123' })
                });
            }
            return Promise.reject(new Error('Unknown URL'));
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Checkout Page Rendering', () => {
        it('renders full checkout page correctly', async () => {
            const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
            const cartDataa = localStorage.getItem('user') || '[]';
            console.log('Cart data:', cartData);
            console.log('Cart data string:', cartDataa);
            console.log('Merchant ID:', 'fb325480-5b1c-4c3b-a044-2fcac7ebce02');
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );
            await waitFor(() => {
                expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
            });

            expect(screen.getByText('Thanh toán')).toBeInTheDocument();
            expect(screen.getByTestId('checkout-form-container')).toBeInTheDocument();
            expect(screen.getByTestId('order-summary')).toBeInTheDocument();
        });

        it('displays loading state initially', () => {
            localStorage.setItem('cart', JSON.stringify([]));

            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            expect(mockNavigate).toHaveBeenCalled();
        });
    });

    describe('CheckOutForm form fields', () => {
        it('renders all required form fields', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('fullname-input')).toBeInTheDocument();
            });

            expect(screen.getByTestId('phone-input')).toBeInTheDocument();
            expect(screen.getByTestId('address-search-input')).toBeInTheDocument();
            expect(screen.getByTestId('delivery-address-textarea')).toBeInTheDocument();
            expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
        });

        it('allows user to input fullname', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const fullnameInput = await screen.findByTestId('fullname-input');
            await user.type(fullnameInput, 'Nguyen Van A');

            expect(fullnameInput).toHaveValue('Nguyen Van A');
        });

        it('allows user to input phone number', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const phoneInput = await screen.findByTestId('phone-input');
            await user.type(phoneInput, '0901234567');

            expect(phoneInput).toHaveValue('0901234567');
        });

        it('allows user to select payment method', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const paymentSelect = await screen.findByTestId('payment-method-select');
            await user.selectOptions(paymentSelect, 'COD');

            expect(paymentSelect).toHaveValue('COD');
        });
    });

    describe('Form Validation', () => {
        it('shows error when submitting empty form', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const submitButton = await screen.findByTestId('submit-order-button');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Họ tên là bắt buộc')).toBeInTheDocument();
            });
        });

        it('shows error for invalid phone number', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const fullnameInput = await screen.findByTestId('fullname-input');
            const phoneInput = await screen.findByTestId('phone-input');
            const submitButton = await screen.findByTestId('submit-order-button');

            await user.type(fullnameInput, 'Test User');
            await user.type(phoneInput, '123'); // Invalid phone
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Số điện thoại không hợp lệ/)).toBeInTheDocument();
            });
        });

        it('clears error when user starts typing', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const submitButton = await screen.findByTestId('submit-order-button');
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText('Họ tên là bắt buộc')).toBeInTheDocument();
            });

            const fullnameInput = screen.getByTestId('fullname-input');
            await user.type(fullnameInput, 'Test');

            await waitFor(() => {
                expect(screen.queryByText('Họ tên là bắt buộc')).not.toBeInTheDocument();
            });
        });
    });

    describe('Map and Address Search', () => {
        it('renders map container', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('leaflet-map')).toBeInTheDocument();
            });
        });

        it('handles address search', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const searchInput = await screen.findByTestId('address-search-input');
            const searchButton = await screen.findByTestId('search-button');

            await user.type(searchInput, '123 Nguyen Hue');
            await user.click(searchButton);

            await waitFor(() => {
                expect(globalThis.fetch).toHaveBeenCalledWith(
                    expect.stringContaining('nominatim.openstreetmap.org/search')
                );
            });
        });

        it('handles use current location button', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const currentLocationBtn = await screen.findByTestId('use-current-location-button');
            await user.click(currentLocationBtn);

            await waitFor(() => {
                expect(global.navigator.geolocation.getCurrentPosition).toHaveBeenCalled();
            });
        });

        it('displays GPS coordinates when location is selected', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByText(/GPS đã xác định/)).toBeInTheDocument();
            }, { timeout: 3000 });
        });
    }); 

    describe('Order Summary', () => {
        it('displays all cart items', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Tóm tắt đơn hàng')).toBeInTheDocument();
            });

            expect(screen.getByText(/Pizza hải sản/)).toBeInTheDocument();
            // expect(screen.getByText(/Trà sữa/)).toBeInTheDocument();
        });

        it('displays correct pricing', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByText('Tạm tính')).toBeInTheDocument();
            });

            expect(screen.getByText('Phí giao hàng')).toBeInTheDocument();
            expect(screen.getByText('15.000₫')).toBeInTheDocument();
            expect(screen.getByText('Tổng cộng')).toBeInTheDocument();
        });

        it('displays item options correctly', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByText(/XL/)).toBeInTheDocument();
            });
        });
    });

    describe('Order Submission', () => {
        it('submits order successfully with valid data', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const fullnameInput = await screen.findByTestId('fullname-input');
            const phoneInput = await screen.findByTestId('phone-input');
            const submitButton = await screen.findByTestId('submit-order-button');

            await user.type(fullnameInput, 'Nguyen Van A');
            await user.type(phoneInput, '0901234567');

            // Wait for map to load and address to be set
            await waitFor(() => {
                expect(screen.getByText(/GPS đã xác định/)).toBeInTheDocument();
            }, { timeout: 3000 });

            await user.click(submitButton);

            await waitFor(() => {
                expect(globalThis.fetch).toHaveBeenCalledWith(
                    'http://localhost:3000/api/order/checkOutOrder',
                    expect.objectContaining({
                        method: 'POST',
                        headers: expect.objectContaining({
                            'Content-Type': 'application/json',
                            'authorization': 'fake-token'
                        })
                    })
                );
            });
        });
    });

    describe('Payment Flow', () => {
        it('displays MoMo payment method by default', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const paymentSelect = await screen.findByTestId('payment-method-select');
            expect(paymentSelect).toHaveValue('MOMO');
        });

        it('allows switching to COD payment', async () => {
            const user = userEvent.setup();
            
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            const paymentSelect = await screen.findByTestId('payment-method-select');
            await user.selectOptions(paymentSelect, 'COD');

            expect(paymentSelect).toHaveValue('COD');
        });
    });

    describe('Responsive Design', () => {
        it('renders checkout grid properly', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('checkout-grid')).toBeInTheDocument();
            });

            const grid = screen.getByTestId('checkout-grid');
            expect(grid).toHaveStyle({ display: 'grid' });
        });
    });

    describe('Data Attributes', () => {
        it('has all required data-cy attributes for E2E testing', async () => {
            render(
                <BrowserRouter>
                    <Checkout />
                </BrowserRouter>
            );

            await waitFor(() => {
                expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
            });

            // Check critical data-cy attributes exist
            expect(screen.getByTestId('checkout-form-container')).toHaveAttribute('data-cy', 'checkout-form-container');
            expect(screen.getByTestId('fullname-input')).toHaveAttribute('data-cy', 'fullname-input');
            expect(screen.getByTestId('phone-input')).toHaveAttribute('data-cy', 'phone-input');
            expect(screen.getByTestId('submit-order-button')).toHaveAttribute('data-cy', 'submit-order-button');
        });
    });
});