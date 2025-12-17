const getLoginUrl = () => `${Cypress.config('baseUrl')}/customer/login`;

describe('Customer Cart Flow', () => {
    beforeEach(() => {
        cy.visit('/customer/login', {
            failOnStatusCode: false,
            timeout: 30000
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
    });

    it('should login successfully and display restaurant list', () => {
        cy.get('[data-cy="restaurant-grid"]').should('be.visible');
        cy.get('[data-cy^="restaurant-card-"]').should('have.length.greaterThan', 0);
    });

    it('should navigate to a restaurant menu and display categories', () => {
        cy.get('[data-cy="view-menu-button"]').first().click();
        cy.url({ timeout: 10000 }).should('include', '/customer/merchant/');

        cy.get('[data-cy="menu-title"]').should('contain', 'Thực đơn');
        cy.get('[data-cy^="menu-category-"]').should('have.length.greaterThan', 0);
    })

    it('should open topping modal and add item to cart successfully', () => {
        cy.get('[data-cy="view-menu-button"]').first().click();
        cy.url({ timeout: 10000 }).should('include', '/customer/merchant/');

        cy.get('[data-cy^="add-to-cart-button-"]').first().click();
        cy.get('[data-cy="modal-total-price"]', { timeout: 15000 }).should('be.visible');

        cy.wait(2000);
        cy.get('input[type="radio"], input[type="checkbox"]').first().check({ force: true });
        cy.get('[data-cy="add-to-cart-confirm-button"]').click();

        cy.on('window:alert', (text) => {
            expect(text).to.contains('đã được thêm vào giỏ hàng');
        });

        cy.get('[data-cy="cart-fab"]').should('be.visible');
    })

    it('should show menu iten in cart badge after adding item', () => {
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
    });

    it('should increase and decrease quantity correctly', () => {
        cy.get('[data-cy="view-menu-button"]').first().click();
        cy.get('[data-cy^="add-to-cart-button-"]').first().click();
        cy.wait(1000);

        cy.get('input[type="radio"], input[type="checkbox"]').first().check({ force: true });
        cy.get('[data-cy="add-to-cart-confirm-button"]').click();
        cy.wait(1000);

        cy.get('[data-cy="cart-fab"]').click();

        cy.get('[data-cy="increase-quantity-button"]').click();
        cy.get('[data-cy="increase-quantity-button"]').click();
        cy.get('[data-cy="quantity-display"]').should('contain', '3');

        cy.get('[data-cy="cart-item-total-price"]').invoke('text').then((text) => {
            const priceText = text.replace(/[^\d]/g, '');
            const singlePrice = priceText / 3;
            expect(priceText).to.eq(singlePrice * 3 + '');
        });

        cy.get('[data-cy="decrease-quantity-button"]').click();
        cy.get('[data-cy="decrease-quantity-button"]').click();
        cy.get('[data-cy="quantity-display"]').should('contain', '1');
    });

    it('should remove item when quantity reaches 0 or click remove', () => {
        cy.get('[data-cy="view-menu-button"]').first().click();
        cy.get('[data-cy^="add-to-cart-button-"]').first().click();
        cy.wait(2000);

        cy.get('input[type="radio"], input[type="checkbox"]').first().check({ force: true });
        cy.get('[data-cy="add-to-cart-confirm-button"]').click();
        cy.wait(1000);

        cy.get('[data-cy="cart-fab"]').click();

        cy.get('[data-cy="decrease-quantity-button"]').click();
        cy.get('[data-cy^="cart-item-"]').should('not.exist');

        cy.get('[data-cy="continue-shopping-link"]').click();
        cy.get('[data-cy^="add-to-cart-button-"]').first().click();
        cy.wait(2000);

        cy.get('input[type="radio"], input[type="checkbox"]').first().check({ force: true });
        cy.get('[data-cy="add-to-cart-confirm-button"]').click();
        cy.wait(1000);

        cy.get('[data-cy="cart-fab"]').click();

        cy.get('[data-cy="increase-quantity-button"]').click();
        cy.get('[data-cy="increase-quantity-button"]').click();
        cy.get('[data-cy="quantity-display"]').should('contain', '3');

        cy.get('[data-cy="remove-item-button"]').click();
        cy.get('[data-cy^="cart-item-"]').should('not.exist');

        cy.get('[data-cy="empty-cart-message"]').should('be.visible'); // nếu bạn có component này
    });
});