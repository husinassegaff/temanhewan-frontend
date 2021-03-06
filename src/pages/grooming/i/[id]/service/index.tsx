import * as React from 'react';
import { useRouter } from 'next/router'

import GetPublicUserAPI from '@/api/GetPublicUserAPI';
import GetGroomingServiceListAPI from '@/api/GetGroomingServiceListAPI';

import GroomingServiceComponent from '@/components/business/groomings/GroomingServiceComponent';

import InputText from '@/components/forms/InputText';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import Link from 'next/link';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Vercel from '~/svg/Vercel.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

interface User {
	id: string,
	email: string,
	name: string,
	role: string,
	birthdate?: string,
	username?: string,
	gender?: string,
	address?: string,
	phone?: string,
	profile_image?: string
}

function NotFoundPage() {
	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img className="rounded-xl object-cover w-full h-48" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="p-4 grid grid-cols-1 col-span-3">
	  <h1>Grooming Peliharaan tidak ditemukan</h1>
	</div>
	</>);
}

function LoadingPage() {
	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img className="rounded-xl object-cover w-full h-48" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="p-4 grid grid-cols-1 col-span-3">
	  <h1>Memuat..</h1>
	</div>
	</>);
}

function SuccessPage({ user, services }: { user: User, services: any }) {
	const router = useRouter();

	function handleBack(e: any) {
		e.preventDefault();

		if (router.isReady) {
			router.push(`/grooming/i/${user.id}`);
		}
	}

	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img src={user.profile_image} alt="profile image" className="w-40 h-40 mb-4" />
			<InputText label="Email" name="email" type="text" placeholder="Email anda" disabled value={user.email} />
					  <InputText label="Nama" name="name" type="text" placeholder="Nama anda" disabled value={user.name} />
					  <InputText label="No. HP" name="phone" type="text" placeholder="No. HP anda" disabled value={user.phone} />
					  <InputText label="Alamat" name="address" type="text" placeholder="Alamat anda" disabled value={user.address} />
		</ul>
	</div>
	<form className='flex flex-col items-start justify-start p-4 text-left gap-3 col-span-3'>
	<div className="grid grid-cols-2 gap-3">
		<button className="bg-white text-orange-600 rounded-xl border-orange-600 p-2 inline border-2" onClick={handleBack}>Kembali</button>
		{/*
		<button className="bg-orange-600 text-white rounded-xl border-orange-600 p-2 inline border-2" onClick={handleConsultVet}>Pesan Konsultasi</button>
		*/}
	</div>

	<div className='flex flex-col items-start justify-start gap-3 col-span-2 w-full'>
			<span className="font-semibold text-lg">Layanan Grooming</span>
			{services.map((service: any) => {
				return (
					<GroomingServiceComponent service={service} key={`service-${service.id}`}>
						<ButtonLink variant="primary" href={`/grooming/i/${user.id}/service/${service.id}`}>Pesan</ButtonLink>
					</GroomingServiceComponent>
				);
			})}
		</div>

																					</form>
	</>);
}

export default function HomePage() {
  const router = useRouter();
  const [ status, setStatus ] = React.useState<'LOADING' | 'NOTFOUND' | 'SUCCESS'>('LOADING');
  const [ user, setUser ] = React.useState<User>({ id: '', name: '', email: '', role: '' });
  const [ services, setServices ] = React.useState<any>([]);

  React.useEffect(() => {
	(async () => {
		// check router ready
		if (!router.isReady) return;

		const id: string = router.query.id as string;

		// get user from server
		const res = await GetPublicUserAPI({ id });
		const success = res.success;
		const user: User = res.data;

		if (user && user.id != '') {
			setUser(user);

			// get grooming services from server
			const resServices = await GetGroomingServiceListAPI({ grooming_id: id, offset: 0, limit: 100 });
			if (resServices.success) {
				setServices(resServices.data);
			}

			setStatus('SUCCESS');
		} else {
			setStatus('NOTFOUND');
		}
	})();
  }, [ router.isReady ]);

  return (
    <>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout grid grid-cols-1 mt-8 w-100'>
			<h1 className="text-xl font-semibold mb-2">Profile Grooming Peliharaan</h1>
            <div className="px-4 grid grid-cols-4 gap-3">
				{status === 'LOADING' && <LoadingPage />
				|| status === 'NOTFOUND' && <NotFoundPage />
				|| status === 'SUCCESS' && <SuccessPage user={user} services={services} />
				}
            </div>
		  </div>
        </section>
      </main>
    </>
  );
}