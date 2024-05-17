import { Suspense } from 'react';
import { lazy } from 'react';
import { createBrowserRouter } from "react-router-dom";

const App = lazy(() => import("./App"))

const router = createBrowserRouter([
    {
        path: "/",
        element: <Suspense fallback={<h1>Loading....</h1>}><App /></Suspense>,
    },
]);

export default router