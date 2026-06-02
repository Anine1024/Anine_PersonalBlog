import { createBrowserRouter } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Projects } from './pages/Projects';
import { AILab } from './pages/AILab';
import { Garden } from './pages/Garden';
import { Timeline } from './pages/Timeline';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },
      { path: 'projects', element: <Projects /> },
      { path: 'ai-lab', element: <AILab /> },
      { path: 'garden', element: <Garden /> },
      { path: 'timeline', element: <Timeline /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
