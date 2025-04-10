import React from 'react';

const MockRouterContext = React.createContext({});

// Mock components
const mockRouter = ({ children }) => (
    <MockRouterContext.Provider value={{
            location: { pathname: '/' },
            navigator: {
                push: jest.fn(),
                replace: jest.fn(),
            }
        }}>
        {children}
    </MockRouterContext.Provider>
);

const mockRoutes = ({ children }) => <div>{children}</div>;

const mockRoute = ({ path, element }) => (
    <div data-testid={`route-${path}`}>
        {typeof element === 'function' ? element() : element}
    </div>
);

const mockNavigate = ({ to, replace }) => {
    console.log(`Navigating to ${to} with replace: ${replace}`);
    return <div data-testid={`navigate-${to}`} />;
};

// Mock hooks
const mockUseLocation = jest.fn(() => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default'
}));

const mockUseNavigate = jest.fn(() => jest.fn());

export const BrowserRouter = mockRouter;
export const Router = mockRouter;
export const Routes = mockRoutes;
export const Route = mockRoute;
export const Navigate = mockNavigate;
export const useLocation = mockUseLocation;
export const useNavigate = mockUseNavigate;

export default {
    BrowserRouter,
    Router,
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate,
};