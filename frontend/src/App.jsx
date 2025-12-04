import { useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import routes from './routes/routes';

function App() {
  // We wrap the imported routes in the MainLayout.
  // This ensures the Navbar/Footer exists for all pages defined in routes.jsx.
  const element = useRoutes([
    {
      element: <MainLayout />,
      children: routes,
    },
  ]);

  return element;
}

export default App;