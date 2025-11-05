import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import routes from './routes/routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
