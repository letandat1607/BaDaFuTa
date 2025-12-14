const getLoginUrl = () => `${Cypress.config('baseUrl')}/customer/login`;

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/customer/login');
    cy.get('body').then(($body) => {
      cy.log('Response body:', $body.text());
    });
  });

  it('should login successfully', () => {
    cy.get('[data-cy="email-input"]').type('user1@example.com');
    cy.get('[data-cy="password-input"]').type('123456');
    cy.get('[data-cy="login-submit-button"]').click();

    cy.url().should('include', '/customer/merchants');
  });

  it('should show error when email is empty', () => {
    cy.get('[data-cy="password-input"]').type('123456');
    cy.get('[data-cy="login-submit-button"]').click();

    cy.get('[data-cy="email-error"]').should('be.visible')
      .and('contain.text', 'Email là bắt buộc');

    cy.get('[data-cy="password-error"]').should('not.exist');
    cy.get('[data-cy="server-error"]').should('not.exist');
  });

  it('should show error for invalid email format', () => {
    cy.get('[data-cy="email-input"]').type('user12example.com');
    cy.get('[data-cy="password-input"]').type('123456');
    cy.get('[data-cy="login-submit-button"]').click();

    cy.get('[data-cy="email-error"]').should('be.visible')
      .and('contain.text', 'Email không hợp lệ');

    cy.get('[data-cy="password-error"]').should('not.exist');
    cy.get('[data-cy="server-error"]').should('not.exist');

  });

  it('should show error when password is empty', () => {
    cy.get('[data-cy="email-input"]').type('user1@example.com');
    cy.get('[data-cy="login-submit-button"]').click();

    cy.get('[data-cy="password-error"]').should('be.visible')
      .and('contain.text', 'Mật khẩu là bắt buộc');

    cy.get('[data-cy="email-error"]').should('not.exist');
    cy.get('[data-cy="server-error"]').should('not.exist');
  });

  it('should show all errors when both fields are empty', () => {
    cy.get('[data-cy="login-submit-button"]').click();

    cy.get('[data-cy="email-error"]').should('contain.text', 'Email là bắt buộc');
    cy.get('[data-cy="password-error"]').should('contain.text', 'Mật khẩu là bắt buộc');
    cy.get('[data-cy="server-error"]').should('not.exist');
  });

  //   it('should NOT call API if form validation fails', () => {
  //     cy.intercept('POST', '**/api/auth/login').as('loginRequest');

  //     cy.get('[data-cy="email-input"]').type('invalid-email');
  //     cy.get('[data-cy="login-submit-button"]').click();

  //     cy.get('@loginRequest').should('not.exist');
  //   });

  //   it('should show server error when login fails (wrong credentials)', () => {
  //     cy.intercept('POST', '**/api/auth/login', {
  //       statusCode: 401,
  //       body: 'Email hoặc mật khẩu không đúng',
  //     }).as('loginFail');

  //     cy.get('[data-cy="email-input"]').type('wrong@email.com');
  //     cy.get('[data-cy="password-input"]').type('wrongpassword');
  //     cy.get('[data-cy="login-submit-button"]').click();

  //     cy.wait('@loginFail');

  //     cy.get('[data-cy="server-error"]').should('be.visible')
  //       .and('contain.text', 'Đăng nhập thất bại: Email hoặc mật khẩu không đúng');

  //     // Không có lỗi validation
  //     cy.get('[data-cy="email-error"]').should('not.exist');
  //     cy.get('[data-cy="password-error"]').should('not.exist');
  //   });

  //   it('should login successfully and redirect', () => {
  //     const mockUser = {
  //       id: '123',
  //       email: 'test@example.com',
  //       user_name: 'Test User',
  //     };

  //     cy.intercept('POST', '**/api/auth/login', {
  //       statusCode: 200,
  //       body: {
  //         token: 'fake-jwt-token',
  //         user: mockUser,
  //         message: 'Đăng nhập thành công',
  //       },
  //     }).as('loginSuccess');

  //     cy.get('[data-cy="email-input"]').type('test@example.com');
  //     cy.get('[data-cy="password-input"]').type('correctpassword');
  //     cy.get('[data-cy="login-submit-button"]').click();

  //     cy.wait('@loginSuccess');

  //     cy.window().then((win) => {
  //       expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token');
  //       expect(JSON.parse(win.localStorage.getItem('user'))).to.deep.eq(mockUser);
  //     });

  //     cy.url().should('include', '/customer/merchants');

  //     cy.get('[data-cy="email-error"]').should('not.exist');
  //     cy.get('[data-cy="password-error"]').should('not.exist');
  //     cy.get('[data-cy="server-error"]').should('not.exist');
  //   });

  it('should navigate to register page when clicking register link', () => {
    cy.get('[data-cy="register-link"]').click();
    cy.url().should('include', '/customer/register');
  });
});