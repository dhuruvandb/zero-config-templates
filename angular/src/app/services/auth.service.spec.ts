import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';

describe('AuthService', () => {
    let service: AuthService;
    let apiServiceMock: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        localStorage.clear();

        apiServiceMock = jasmine.createSpyObj('ApiService', ['post']);
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: ApiService, useValue: apiServiceMock },
            ],
        });

        service = TestBed.inject(AuthService);
    });

    it('should initialize with null token when localStorage is empty', () => {
        expect(service.accessToken()).toBeNull();
    });

    it('should restore token from localStorage', () => {
        localStorage.setItem('token', 'saved-token');

        // Re-create service to trigger constructor
        service = TestBed.inject(AuthService);
        expect(service.accessToken()).toBe('saved-token');
    });

    it('should set token after login', async () => {
        apiServiceMock.post.and.resolveTo({ accessToken: 'new-token' });

        await service.login('a@b.com', 'pass');

        expect(service.accessToken()).toBe('new-token');
        expect(localStorage.getItem('token')).toBe('new-token');
    });

    it('should throw on failed login', async () => {
        apiServiceMock.post.and.resolveTo({ message: 'Invalid credentials' });

        await expect(service.login('a@b.com', 'wrong')).rejects.toThrow(
            'Invalid credentials'
        );
        expect(service.accessToken()).toBeNull();
    });

    it('should clear token after logout', () => {
        localStorage.setItem('token', 'existing-token');
        service.accessToken.set('existing-token');

        service.logout();

        expect(service.accessToken()).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });
});
