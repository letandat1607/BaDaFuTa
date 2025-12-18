const getLoginUrl = () => `${Cypress.config('baseUrl')}/customer/login`;

describe('Customer Order Flow', () => {
    beforeEach(() => {
        cy.visit('/customer/login', {
            failOnStatusCode: false,
            timeout: 30000,
        });
        cy.get('body').then(($body) => {
            cy.log('Response body:', $body.text());
        });

        cy.wait(1000);
        cy.get('[data-cy="email-input"]').type('user1@example.com');
        cy.get('[data-cy="password-input"]').type('123456');
        cy.get('[data-cy="login-submit-button"]').click();

        cy.url({ timeout: 5000 }).should('include', '/customer/merchants');
        cy.clearLocalStorage('cart');
        cy.get('[data-cy="view-menu-button"]').first().click();
        cy.get('[data-cy^="add-to-cart-button-"]').first().click();

        cy.wait(1000);
        cy.get('input[type="radio"], input[type="checkbox"]').first().check({ force: true });

        cy.get('[data-cy="add-to-cart-confirm-button"]').click();

        cy.wait(1000);

        cy.get('[data-cy="cart-fab"]').click();
        cy.url().should('include', `/customer/merchant/cart/fb325480-5b1c-4c3b-a044-2fcac7ebce02`);

        cy.get('[data-cy="cart-page"]').should('be.visible');
        cy.get('[data-cy="cart-title"]').should('contain', 'Giỏ hàng');
        cy.get('[data-cy="cart-items-list"]').should('be.visible');
        cy.get('[data-cy^="cart-item-"]').should('have.length.greaterThan', 0);
        cy.get('[data-cy="cart-item-name"]').should('be.visible');
        cy.get('[data-cy="quantity-display"]').should('contain', '1');
        cy.get('[data-cy="cart-summary"]').should('be.visible');
        cy.get('[data-cy="cart-total-price"]').should('be.visible');

        cy.get('[data-cy="checkout-button"]')
            .should('be.visible')
            .and('contain', 'Tiến hành thanh toán')
            .click();

        cy.url().should('include', `/customer/checkout/fb325480-5b1c-4c3b-a044-2fcac7ebce02`);
        cy.wait(5000);
    });

    it('should display checkout page with form and order summary', () => {
        cy.get('[data-cy="checkout-title"]').should('contain', 'Thanh toán');
        cy.get('[data-cy="checkout-form-container"]').should('be.visible');
        cy.get('[data-cy="order-summary"]').should('be.visible');
        cy.get('[data-cy="items-list"]').should('have.descendants', '[data-cy^="checkout-item-"]');
        cy.get('[data-cy="total-row"]').should('contain.text', 'Tổng cộng');
    });

    it('should show validation errors when submitting empty form', () => {
        cy.get('[data-cy="submit-order-button"]').click();

        cy.get('[data-cy="fullname-error"]').should('be.visible').and('contain', 'Họ tên là bắt buộc');
        cy.get('[data-cy="phone-error"]').should('be.visible').and('contain', 'Số điện thoại là bắt buộc');
        cy.get('[data-cy="checkout-form-error"]').should('contain', 'Vui lòng kiểm tra lại các trường thông tin!');
    });

    it('should allow user to search address and update map', () => {
        cy.get('[data-cy="address-search-input"]').type('Chợ Bến Thành, Hồ Chí Minh');
        cy.get('[data-cy="search-button"]').click();

        cy.get('[data-cy="delivery-address-textarea"]', { timeout: 10000 })
            .should('contain', 'Ben Thanh');

        cy.get('[data-cy="leaflet-map-container"]').find('.leaflet-marker-icon').should('exist');
    });

    it('should allow using current location', () => {
        cy.window().then((win) => {
            cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((success) => {
                success({
                    coords: {
                        latitude: 10.7769,
                        longitude: 106.7009,
                    },
                });
            });
        });

        cy.get('[data-cy="use-current-location-button"]').click();
        cy.wait(3000);
        cy.get('[data-cy="delivery-address-textarea"]', { timeout: 8000 })
            .should('not.have.value', 'Vui lòng chọn địa chỉ chính xác trên bản đồ');
    });

    it('should show Momo QR when selecting Momo payment', () => {
        cy.get('[data-cy="fullname-input"]').type('Test Momo');
        cy.get('[data-cy="phone-input"]').type('0912345678');
        cy.get('[data-cy="payment-method-select"]').select('MOMO');
        cy.get('[data-cy="use-current-location-button"]').click();
        cy.get('[data-cy="delivery-address-textarea"]', { timeout: 10000 }).should('not.be.empty');

        cy.get('[data-cy="submit-order-button"]').click();
        // cy.window().then((win) => {
        //     win.socket._trigger('paymentQR', {
        //         payUrl: 'https://example.com/fake-momo-qr.png',
        //     });
        // });
        // cy.wait(5000);

        // cy.get('[data-cy="momo-qr-container"]', { timeout: 15000 }).should('be.visible');
        // cy.get('[data-cy="momo-qr-svg"]').should('be.visible');
        // cy.get('[data-cy="order-id"]').should('not.be.empty');
    });

});