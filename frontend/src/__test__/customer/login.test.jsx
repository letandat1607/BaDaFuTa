import {afterEach, beforeEach, describe, expect, it, test, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerLogin from '../../component/customerSys/loginCustomer';
import {BrowserRouter, MemoryRouter, useLocation} from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
})

globalThis.fetch = vi.fn();

describe('CustomerLogin Component', () => {
    const user = userEvent.setup();
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.setItem.mockClear();
        localStorage.getItem.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render login form correctly', () => {
        render(
            <BrowserRouter>
                <CustomerLogin />
            </BrowserRouter>
        );

        expect(screen.getByTestId('login-title')).toBeInTheDocument();

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Đăng nhập/i})).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty form', async () => {
        render(
            <BrowserRouter>
                <CustomerLogin />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        expect(await screen.findByText('Email là bắt buộc')).toBeInTheDocument();
        expect(await screen.findByText('Mật khẩu là bắt buộc')).toBeInTheDocument();
    })

    it('should show error for invalid email format', async () => {
        render(
            <BrowserRouter>
                <CustomerLogin />
            </BrowserRouter>
        );

        await user.type(screen.getByLabelText(/Email/i), 'email-khong-hop-le');
        await user.type(screen.getByLabelText(/Mật khẩu/i), '123456');
        fireEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument();
    });

    it('should show server error when login fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Email hoặc mật khẩu không đúng' }),
        });

        render(
            <BrowserRouter>
                <CustomerLogin />
            </BrowserRouter>
        );

        await user.type(screen.getByLabelText(/Email/i), 'wrong@email.com');
        await user.type(screen.getByLabelText(/Mật khẩu/i), 'wrongpass');
        await user.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        expect(await screen.findByText('Email hoặc mật khẩu không đúng')).toBeInTheDocument();
    });

    it('should login successfully and navigate on valid credentials', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                token: 'fake-jwt-token',
                user: { id: 1, email: 'customer@test.com', role: 'customer' },
                message: 'Đăng nhập thành công',
            }),
        });

        render(
            <BrowserRouter>
                <CustomerLogin />
            </BrowserRouter>
        );

        await user.type(screen.getByLabelText(/Email/i), 'customer@test.com');
        await user.type(screen.getByLabelText(/Mật khẩu/i), 'password123');
        await user.click(screen.getByRole('button', { name: /Đăng nhập/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        email: 'customer@test.com',
                        password: 'password123',
                        role: 'customer',
                    }),
                })
            );
        });

        await waitFor(() => {
            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'user',
                JSON.stringify({ id: 1, email: 'customer@test.com', role: 'customer' })
            );
            expect(mockNavigate).toHaveBeenCalledWith('/customer/merchants');
        });
    });

    it('should navigate to register page when clicking "Đăng ký ngay"', async () => {
        const TestWrapper = () => {
            const location = useLocation();
            return (
                <>
                    <CustomerLogin />
                    {/* Optional: Hiển thị location để debug nếu cần */}
                    <div data-testid="current-path">{location.pathname}</div>
                </>
            );
        };
    
        render(
            <MemoryRouter initialEntries={['/customer/login']}>
                <TestWrapper />
            </MemoryRouter>
        );

        expect(screen.getByTestId('current-path')).toHaveTextContent('/customer/login');

        await user.click(screen.getByRole('link', { name: /Đăng ký ngay/i }));
    
        await waitFor(() => {
            expect(screen.getByTestId('current-path')).toHaveTextContent('/customer/register');
        });
    });
});