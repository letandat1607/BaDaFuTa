beforeAll(() => {
    console.log('Setup for service without PostgreSQL dependency');
    process.env.NODE_ENV = 'test';
});