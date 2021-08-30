import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './pages/Home';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import ReviewPreview from './components/ReviewPreview';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/review/:id" children={<ReviewPreview />} />
        </Switch>
      </Router>
    </QueryClientProvider>
  )
}

export default App;
