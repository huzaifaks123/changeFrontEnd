// Import modules from react-router-dom for routing
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// Import files from assets to render tree view
import { files } from './assets/js/files';

// Import Redux store to use reducers
import { store } from './store';

// Import Bootstrap CSS and JavaScript modules
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Redux provider to provide store to the app
import { Provider } from 'react-redux';

// Import pages and components
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import HomePage from './pages/HomePage';
import LeaderBoard from './pages/LeaderBoard';
import UserPage from './pages/UserPage';

function App() {
  // Create new routes using createBrowserRouter
  const router = createBrowserRouter([
    {
      path: '/', 
      element: <SideMenu files={files} />, // Side menu component with file props
      children: [
        {
          path: "/", 
          element: <Navbar />, // Navbar component
          children: [
            { index: true, element: <HomePage /> }, // Home page component as the default route
            { path: '/user', element: <UserPage /> }, // User page component
            { path: '/leaderboard', element: <LeaderBoard /> }, // Leaderboard page component
          ]
        },
      ]
    }
  ]);

  return (
    // Provide the Redux store to the app
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
