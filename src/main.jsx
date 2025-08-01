import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add error boundary
const ErrorBoundary = ({ children }) => {
    const [error, setError] = useState(null);
    
    const handleError = (err) => {
        setError(err);
    };
    
    return error ? (
        <div className="error-container">
            <h1>Something went wrong!</h1>
            <pre>{error.message}</pre>
        </div>
    ) : (
        children
    );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
