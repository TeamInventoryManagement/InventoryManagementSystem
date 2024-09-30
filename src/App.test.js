// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


// import { render, screen } from '@testing-library/react';
// import App from './App';
// import { BrowserRouter as Router } from 'react-router-dom';

// // Mock the useLocation hook to return a specific value for testing
// jest.mock('react-router-dom', () => ({
//   useLocation: jest.fn().mockReturnValue({ pathname: '/' }),
// }));

// test('renders learn react link', () => {
//   render(
//     <Router>
//       <App />
//     </Router>
//   );

//   // Use screen.getByText for elements expected to be present
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('hides sidebar on login page', () => {
//   render(
//     <Router>
//       <App noSidebarPaths={['/loginpage']} />
//     </Router>
//   );

//   // Use screen.queryByTestId instead of destructuring queryByTestId from render
//   const sidebarElement = screen.queryByTestId('sidebar');
//   expect(sidebarElement).toBeNull(); // Expect the sidebar to be null (not found)
// });
