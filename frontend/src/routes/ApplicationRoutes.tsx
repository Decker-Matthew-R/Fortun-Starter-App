import { Route, Routes } from 'react-router-dom';

import LandingPage from '../landingPage/components/LandingPage.tsx';

const ApplicationRoutes = () => {
    return (
        <Routes>
            <Route
                element={<LandingPage />}
                path='/'
            />
        </Routes>
    );
};
export default ApplicationRoutes;
