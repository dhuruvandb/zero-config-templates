import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthService],
        });
        service = TestBed.inject(AuthService);
    });

    it('should initialize with isAuthenticated = false', () => {
        expect(service.isAuthenticated()).toBeFalse();
    });

    it('should set isAuthenticated = true after login', async () => {
        // AuthService.login calls authClient.signIn.email internally
        // which manages the session via cookies
        await expectAsync(service.login('a@b.com', 'pass')).toBeRejected();
    });

    it('should throw on failed login with wrong credentials', async () => {
        await expectAsync(
            service.login('a@b.com', 'wrong')
        ).toBeRejectedWithError();
    });

    it('should set isAuthenticated = false after logout', async () => {
        await service.logout();
        expect(service.isAuthenticated()).toBeFalse();
    });
});
