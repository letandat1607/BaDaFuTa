import {afterEach, beforeEach, describe, expect, it, test, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerRegister from '../../component/customerSys/registerCustomer';
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
globalThis.alert = vi.fn();

describe('CustomerRegister Component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockReset();
        globalThis.alert.mockClear();
        localStorage.setItem.mockClear();
        localStorage.getItem.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should render register form correctly', () => {
        render(
            <BrowserRouter>
                <CustomerRegister />
            </BrowserRouter>
        );

        expect(screen.getByRole('heading', { name: 'Đăng ký' })).toBeInTheDocument();
        expect(screen.getByTestId('register-title')).toBeInTheDocument();

        expect(screen.getByLabelText(/Tên đăng nhập/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Họ và tên/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Số điện thoại/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Đăng ký' })).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty form', async () => {
        render(
            <BrowserRouter>
                <CustomerRegister />
            </BrowserRouter>
        );

        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));

        expect(await screen.findByText('Tên đăng nhập là bắt buộc')).toBeInTheDocument();
        expect(await screen.findByText('Họ và tên là bắt buộc')).toBeInTheDocument();
        expect(await screen.findByText('Email là bắt buộc')).toBeInTheDocument();
        expect(await screen.findByText('Số điện thoại là bắt buộc')).toBeInTheDocument();
        expect(await screen.findByText('Mật khẩu là bắt buộc')).toBeInTheDocument();
    });

    it('should show specific validation errors', async () => {
        render(
            <BrowserRouter>
                <CustomerRegister />
            </BrowserRouter>
        );

        await user.type(screen.getByLabelText(/Tên đăng nhập/i), 'ab');
        await user.type(screen.getByLabelText(/Email/i), 'invalid-email');
        await user.type(screen.getByLabelText(/Số điện thoại/i), '123');
        await user.type(screen.getByLabelText(/Mật khẩu/i), '123');
        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));

        expect(await screen.findByText('Tên đăng nhập phải ít nhất 3 ký tự')).toBeInTheDocument();
        expect(await screen.findByText('Email không hợp lệ')).toBeInTheDocument();
        expect(await screen.findByText('Số điện thoại không hợp lệ')).toBeInTheDocument();
        expect(await screen.findByText('Mật khẩu phải ít nhất 6 ký tự')).toBeInTheDocument();
    });

    it('should register successfully and navigate to login', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Đăng ký thành công!' }),
        });

        render(
            <BrowserRouter>
                <CustomerRegister />
            </BrowserRouter>
        );

        await user.type(screen.getByLabelText(/Tên đăng nhập/i), 'customer123');
        await user.type(screen.getByLabelText(/Họ và tên/i), 'Nguyễn Văn A');
        await user.type(screen.getByLabelText(/Email/i), 'customer@test.com');
        await user.type(screen.getByLabelText(/Số điện thoại/i), '0901234567');
        await user.type(screen.getByLabelText(/Mật khẩu/i), 'password123');

        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:3000/api/auth/register',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        user_name: 'customer123',
                        full_name: 'Nguyễn Văn A',
                        email: 'customer@test.com',
                        phone_number: '0901234567',
                        role: 'customer',
                        password: 'password123',
                    }),
                })
            );
        });

        await waitFor(() => {
            expect(globalThis.alert).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/customer/login');
        });
    });

    it('should show server error on failed registration', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Email đã tồn tại' }),
        });
    
        render(
            <BrowserRouter>
                <CustomerRegister />
            </BrowserRouter>
        );

        await user.type(screen.getByLabelText(/Tên đăng nhập/i), 'testuser');
        await user.type(screen.getByLabelText(/Họ và tên/i), 'Nguyễn Văn Test');
        await user.type(screen.getByLabelText(/Email/i), 'exists@test.com');
        await user.type(screen.getByLabelText(/Số điện thoại/i), '0901234567');
        await user.type(screen.getByLabelText(/Mật khẩu/i), 'password123');
    
        await user.click(screen.getByRole('button', { name: 'Đăng ký' }));
    
        expect(await screen.findByText('Email đã tồn tại')).toBeInTheDocument();
        expect(fetch).toHaveBeenCalled();
    });
});