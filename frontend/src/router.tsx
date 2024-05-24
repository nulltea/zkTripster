import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import SubmitForm from './pages/SubmitForm';
import ValidateProof from './pages/ValidateProof';

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
                path: 'submit',
                element: <SubmitForm />,
            },
            {
                path: 'validate',
                element: <ValidateProof />,
            },
        ],
    },
]);
