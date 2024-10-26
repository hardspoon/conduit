'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" href="/">conduit</Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link 
              className={`nav-link ${pathname === '/' ? 'active' : ''}`} 
              href="/"
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${pathname === '/editor' ? 'active' : ''}`} 
              href="/editor"
            >
              <i className="ion-compose"></i>&nbsp;New Article
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${pathname === '/login' ? 'active' : ''}`} 
              href="/login"
            >
              Sign in
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link ${pathname === '/register' ? 'active' : ''}`} 
              href="/register"
            >
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
