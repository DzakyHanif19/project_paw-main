const { createKaryawan } = require('../src/app/controller/admincontroller');
const db = require('../src/app/infrastructure/database/connection');

jest.mock('../src/app/infrastructure/database/connection', () => ({
    query: jest.fn(),
}));

describe('createKaryawan', () => {
    let res;

    beforeEach(() => {
        res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    it('should create a new karyawan and redirect to /admin/user if successful', () => {
        // Arrange: Mock db.query to simulate successful database insertion
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const req = {
            
            body: {
                namaKaryawan: 'John Doe',
                username: 'john.doe',
                password: 'password123',
            },
        };

        // Act: Call the controller function
        return createKaryawan(req, res).then(() => {
            // Assert: Check if the redirect happened to '/admin/user'
            expect(res.redirect).toHaveBeenCalledWith('/admin/user');
        });
    });

    it('should return an error response if the database query fails', () => {
        // Arrange: Mock db.query to simulate a database error
        db.query.mockImplementation((sql, values, callback) => {
            callback(new Error('Database error'), null);
        });

        const req = {
            body: {
                namaKaryawan: 'John Doe',
                username: 'john.doe',
                password: 'password123',
            },
        };

        // Act: Call the controller function
        return createKaryawan(req, res).then(() => {
            // Assert: Check if status 500 was set and error message returned
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Failed to create karyawan',
                detail: 'Kegagalan membuat karyawan',
            });
        });
    });
});