import { useRouter } from 'next/router';
import * as React from 'react';

import ButtonLink from '@/components/links/ButtonLink';
import UnstyledLink from '@/components/links/UnstyledLink';

import {useAuthState } from '@/providers/AuthContextProvider';
import AuthService from '@/services/AuthService';

const linksNotLogined = [
  { href: '/forum', label: 'Forum', type: '' },
  { href: '/faq', label: 'FAQ', type: '' },
  { href: '/about', label: 'About', type: '' },
  { href: '/login', label: 'Login', type: 'primary' },
];

const linksLogined = [
  { href: '/vet', label: 'Vet', type: ''},
  { href: '/grooming', label: 'Grooming', type:''},
  { href: '/forum', label: 'Forum', type: '' },
  { href: '/faq', label: 'FAQ', type: '' },
  { href: '/about', label: 'About', type: '' },
  { href: '/dashboard', label: 'Dashboard', type: 'primary' },
];

export default function Header() {
	const router = useRouter();

	const authState = useAuthState();
	const [ links, setLinks ] = React.useState<any>(null);
	const [ isAuthenticated, setIsAuthenticated ] = React.useState(false);

	React.useEffect(() => {
		setIsAuthenticated(authState.authenticated || AuthService.getToken() != '' && AuthService.getToken() != undefined);
		
		setLinks(isAuthenticated ? linksLogined : linksNotLogined);
	}, [ authState.authenticated, isAuthenticated, router.isReady, router.route ]);

  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-16 py-2 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600 flex'>
          <img className='h-8' src="/images/logo.png" alt="logo Teman Hewan"/>
          <img className='h-8' src="/images/logo-text.png" alt="logo teks Teman Hewan" />
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-8 text-gray-500'>
			{links !== null && links.map(({ href, label, type }: { href: string, label: string, type: string }) => (
              <li key={`${href}${label}`}>
				{
					type === 'primary'
					? <ButtonLink href={href} variant='primary'>{label}</ButtonLink>
					: <UnstyledLink href={href} className='hover:text-gray-600'>{label}</UnstyledLink>
				}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
