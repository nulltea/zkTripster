import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import IssueForm from './pages/IssueForm.tsx';
import HackerInfo from './pages/HackerInfo.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'issue',
                element: <IssueForm />,
            },
            {
                path: 'hacker-info',
                element: <HackerInfo />,
            },
        ],
    },
]);
