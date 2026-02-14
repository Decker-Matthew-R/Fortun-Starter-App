import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, vi, beforeEach } from 'vitest';
import { Navbar } from '../../components/Navbar.tsx';
import * as metricsClient from '../../../metrics/client/MetricsClient';
import { METRIC_EVENT_TYPE } from '../../../metrics/model/METRIC_EVENT_TYPE';

const mockNavigate = vi.fn();
const currentRoute = '/';

vi.mock('@/utils/CookieUtils');

const mockLocation = {
    href: '',
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: vi.fn().mockImplementation(() => {
            return { pathname: currentRoute };
        }),
    };
});

describe('Navbar', () => {
    const mockSaveMetricEvent = vi.fn();

    const renderNavbar = () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(metricsClient, 'useMetrics').mockReturnValue({
            saveMetricEvent: mockSaveMetricEvent,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Desktop Navigation', () => {
        beforeEach(() => {});

        it('should contain a site logo and company name', () => {
            renderNavbar();

            const siteName = screen.getByLabelText('atlas-site-name');
            const siteLogo = screen.getByLabelText('atlas-logo');

            expect(siteName).toBeVisible();
            expect(siteLogo).toBeVisible();
        });

        it('should NOT show mobile elements', () => {
            renderNavbar();

            const hamburgerButton = screen.queryByLabelText('navigation-links');
            const mobileSiteName = screen.queryByLabelText('atlas-site-name-mobile');
            const mobileSiteLogo = screen.queryByLabelText('atlas-logo-mobile');

            expect(hamburgerButton).toBeInTheDocument();
            expect(mobileSiteName).toBeInTheDocument();
            expect(mobileSiteLogo).toBeInTheDocument();
        });

        it('should navigate to home if Atlas text is clicked and record a metric', async () => {
            renderNavbar();

            const siteName = screen.getByLabelText('atlas-site-name');

            await userEvent.click(siteName);

            expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'Atlas Name',
                screen: '/',
            });

            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it('should navigate to home if Atlas Logo is clicked and record a metric', async () => {
            renderNavbar();

            const siteLogo = screen.getByLabelText('atlas-logo');

            await userEvent.click(siteLogo);

            expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'Atlas Logo',
                screen: '/',
            });

            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it.each([
            ['News', '/'],
            ['Matches', '/'],
        ])(
            'should contain %s navigation button, navigate to %s, and record a metric when clicked',
            async (navigationButton, expectedRoute) => {
                renderNavbar();

                const navigationLink = screen.getByRole('button', { name: navigationButton });
                expect(navigationLink).toBeVisible();

                await userEvent.click(navigationLink);

                expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
                expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                    triggerId: navigationButton,
                    screen: '/',
                });

                expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
                expect(mockNavigate).toHaveBeenCalledTimes(1);
            }
        );

        it('should display profile icon and Login button when clicked', async () => {
            renderNavbar();

            const profileIcon = screen.getByLabelText('Open Profile Settings');
            expect(profileIcon).toBeVisible();

            await userEvent.click(profileIcon);

            const profileMenu = screen.getByRole('menu');
            expect(profileMenu).toBeVisible();

            const loginButton = screen.getByRole('button', { name: 'Login' });
            expect(loginButton).toBeVisible();
        });

        it('should trigger OAuth login when Login button is clicked', async () => {
            renderNavbar();

            const profileIcon = screen.getByLabelText('Open Profile Settings');
            await userEvent.click(profileIcon);

            const loginButton = screen.getByRole('button', { name: 'Login' });
            await userEvent.click(loginButton);

            expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'Login',
                screen: '/',
            });
        });

        it('should show person icon when user is not logged in', () => {
            renderNavbar();

            const profileButton = screen.getByLabelText('Open Profile Settings');
            expect(profileButton).toBeInTheDocument();

            const personIcon = screen.getByTestId('PersonIcon');
            expect(personIcon).toBeInTheDocument();
        });
    });

    describe('Mobile Navigation', () => {
        beforeEach(() => {});

        it('should contain mobile site logo and company name', () => {
            renderNavbar();

            const siteName = screen.getByLabelText('atlas-site-name-mobile');
            const siteLogo = screen.getByLabelText('atlas-logo-mobile');

            expect(siteName).toBeInTheDocument();
            expect(siteLogo).toBeInTheDocument();
        });

        it('should NOT show desktop navigation buttons', () => {
            renderNavbar();

            const desktopSiteName = screen.queryByLabelText('atlas-site-name');
            const desktopSiteLogo = screen.queryByLabelText('atlas-logo');

            expect(desktopSiteName).toBeInTheDocument();
            expect(desktopSiteLogo).toBeInTheDocument();
        });

        it('should navigate to home if mobile Atlas text is clicked and record a metric', async () => {
            renderNavbar();

            const siteName = screen.getByLabelText('atlas-site-name-mobile');

            await userEvent.click(siteName);

            expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'Atlas Name',
                screen: '/',
            });

            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it('should navigate to home if mobile Atlas Logo is clicked and record a metric', async () => {
            renderNavbar();

            const siteLogo = screen.getByLabelText('atlas-logo-mobile');

            await userEvent.click(siteLogo);

            expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'Atlas Logo',
                screen: '/',
            });

            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });

        it('should display mobile navigation menu when hamburger icon is clicked', async () => {
            renderNavbar();

            const hamburgerButton = screen.getByLabelText('navigation-links');
            expect(hamburgerButton).toBeInTheDocument();

            await userEvent.click(hamburgerButton);

            const menuItems = screen.getAllByRole('menuitem');
            expect(menuItems.length).toBeGreaterThan(0);
        });

        it.each([
            ['News', '/'],
            ['Matches', '/'],
        ])(
            'mobile: should show %s in menu, navigate to %s, record metric, and close menu when clicked',
            async (navigationItem, expectedRoute) => {
                renderNavbar();

                const hamburgerButton = screen.getByLabelText('navigation-links');
                await userEvent.click(hamburgerButton);

                const menuItems = screen.getAllByRole('menuitem');
                const targetMenuItem = menuItems.find(
                    (item) => item.textContent === navigationItem
                );
                expect(targetMenuItem).toBeInTheDocument();

                await userEvent.click(targetMenuItem!);

                expect(mockSaveMetricEvent).toHaveBeenCalledTimes(1);
                expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                    triggerId: navigationItem,
                    screen: '/',
                });

                expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
                expect(mockNavigate).toHaveBeenCalledTimes(1);
            }
        );

        it('should close mobile menu when clicking escape key', async () => {
            renderNavbar();

            const hamburgerButton = screen.getByLabelText('navigation-links');
            await userEvent.click(hamburgerButton);

            const menuItems = screen.getAllByRole('menuitem');
            expect(menuItems.length).toBeGreaterThan(0);

            await userEvent.keyboard('{Escape}');

            const menuItemsAfterClose = screen.queryAllByRole('menuitem');
            expect(menuItemsAfterClose.length).toBe(0);
        });
    });

    describe('Navigation Integration', () => {
        beforeEach(() => {});

        it('should handle multiple navigation actions in sequence', async () => {
            renderNavbar();

            const siteLogo = screen.getByLabelText('atlas-logo');
            await userEvent.click(siteLogo);

            expect(mockNavigate).toHaveBeenCalledWith('/');

            vi.clearAllMocks();

            const newsButton = screen.getByRole('button', { name: 'News' });
            await userEvent.click(newsButton);

            expect(mockNavigate).toHaveBeenCalledWith('/');
            expect(mockSaveMetricEvent).toHaveBeenCalledWith(METRIC_EVENT_TYPE.BUTTON_CLICK, {
                triggerId: 'News',
                screen: '/',
            });
        });

        it('should track all metrics for a complete user flow', async () => {
            renderNavbar();

            await userEvent.click(screen.getByLabelText('atlas-site-name'));

            await userEvent.click(screen.getByRole('button', { name: 'Matches' }));

            await userEvent.click(screen.getByLabelText('Open Profile Settings'));

            await userEvent.click(screen.getByRole('button', { name: 'Login' }));

            expect(mockSaveMetricEvent).toHaveBeenCalledTimes(3);
        });
        it('should open and close profile menu when clicking avatar and then outside', async () => {
            renderNavbar();

            const profileIcon = screen.getByLabelText('Open Profile Settings');
            await userEvent.click(profileIcon);

            const loginButton = screen.getByRole('button', { name: 'Login' });
            expect(loginButton).toBeVisible();

            await userEvent.keyboard('{Escape}');

            expect(screen.queryByRole('button', { name: 'Login' })).not.toBeInTheDocument();

            expect(profileIcon).toBeVisible();
        });
    });
});
