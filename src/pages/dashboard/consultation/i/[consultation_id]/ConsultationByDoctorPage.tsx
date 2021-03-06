import { useRouter } from 'next/router'
import * as React from 'react';

import ShouldAuthorized from '@/components/auths/ShouldAuthorized';
import ConsultationFormComponent from '@/components/business/consultations/ConsultationFormComponent';
import ConsultationStatusFormComponent from '@/components/business/consultations/ConsultationStatusFormComponent';
import CustomerFormComponent from '@/components/business/consultations/CustomerFormComponent';
import DoctorFormComponent from '@/components/business/consultations/DoctorFormComponent';
import ReviewFormComponent from '@/components/business/consultations/ReviewFormComponent';
import InputText from '@/components/forms/InputText';
import SidebarDoctor from '@/components/layout/SidebarDoctor';
import Seo from '@/components/Seo';

import AcceptConsultationAPI from '@/api/AcceptConsultationAPI';
import AuthAPI from '@/api/AuthAPI';
import GetConsultationAPI from '@/api/GetConsultationAPI';
import GetConsultationReviewAPI from '@/api/GetConsultationReviewAPI';
import GetPublicUserAPI from '@/api/GetPublicUserAPI';
import RejectConsultationAPI from '@/api/RejectConsultationAPI';
import AuthService from '@/services/AuthService';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

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
	  <h1>Dokter hewan tidak ditemukan</h1>
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

function SuccessPage({ myUser, user, consultation, review, setStatus, refreshUser }: { myUser: any, user: any, consultation: any, review: any, setStatus: any, refreshUser: any }) {
	const router = useRouter();
	
	const [ isInputingPrice, setIsInputingPrice ] = React.useState(false);
	const [ fee, setFee ] = React.useState(100000);

	function handleBack(e: any) {
		e.preventDefault();

		if (router.isReady) {
			router.push(`/dashboard/consultation`);
		}
	}

	function handleFee(e: any) {
		e.preventDefault();
		setFee(e.target.value);
	}

	function handleCloseInputPrice(e: any) {
		e.preventDefault();

		setIsInputingPrice(false);
	}

	function handleInputPrice(e: any) {
		e.preventDefault();

		setIsInputingPrice(true);
	}

	async function handleRejectConsultation(e: any) {
		e.preventDefault();

		const res = await RejectConsultationAPI({ id: consultation.id });
		const success = res.success;

		if (success) {
			setStatus('REJECTED');

			setTimeout(() => {
				refreshUser();
			}, 1000);
		} else {
			setStatus('FAILED');
		}
	}

	async function handleAcceptConsultation(e: any) {
		e.preventDefault();

		const res = await AcceptConsultationAPI({ id: consultation.id, fee: fee });
		const success = res.success;

		if (success) {
			setStatus('ACCEPTED');

			setTimeout(() => {
				refreshUser();
			}, 1000);
		} else {
			setStatus('FAILED');
		}
	}

	return (<>
	<div className="flex flex-col gap-1 p-4">
		<ConsultationFormComponent consultation={consultation} />
		<DoctorFormComponent user={myUser} />
		<CustomerFormComponent user={user} />
		{consultation.is_reviewed && <ReviewFormComponent review={review} />}
		<ConsultationStatusFormComponent consultation={consultation} />
		
		{(()=>{
			if (consultation.status == 'pending') {
				return (
					<>
						{!isInputingPrice && (<div className="grid grid-cols-3 gap-3">
							<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2" onClick={handleBack}>Kembali</button>
							<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2" onClick={handleRejectConsultation}>Tolak Permintaan</button>
							<button className="bg-primary-500 text-white rounded-xl border-primary-500 p-2 inline border-2" onClick={handleInputPrice}>Ajukan Biaya Konsultasi</button>
						</div>)}
						{isInputingPrice && (<div className="grid grid-cols-2 gap-3">
							<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2 row-span-2" onClick={handleCloseInputPrice}>Batal</button>
							<InputText name="input_price" label="Biaya yang diajukan (Rupiah)" type="number" value={fee as any as string} onChange={handleFee} />
							<button className="bg-primary-500 text-white rounded-xl border-primary-500 p-2 inline border-2" onClick={handleAcceptConsultation}>Ajukan Biaya Konsultasi</button>
						</div>)}
					</>
				);
			} else if (consultation.status == 'cancelled') {
				return (
					<div className="grid grid-cols-2 gap-3">
						<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2" onClick={handleBack}>Kembali</button>
					</div>
				);
			} else if (consultation.status == 'accepted') {
				return (
					<div className="grid grid-cols-2 gap-3">
						<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2" onClick={handleBack}>Kembali</button>
					</div>
				);
			} else if (consultation.status == 'paid') {
				return (
					<div className="grid grid-cols-2 gap-3">
						<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2" onClick={handleBack}>Kembali</button>
					</div>
				);
			} else if (consultation.status == 'completed') {
				return (
					<div className="grid grid-cols-2 gap-3">
						<button className="bg-white text-primary-500 rounded-xl border-primary-500 p-2 inline border-2" onClick={handleBack}>Kembali</button>
					</div>
				);
			}
		})()}
	</div>
	</>);
}

function AcceptedPage({ myUser, user, consultation }: { myUser: any, user: any, consultation: any }) {
	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img className="rounded-xl object-cover w-full h-48" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="p-4 grid grid-cols-1 col-span-3">
	  <h1>Ajuan harga konsultasi berhasil dikirimkan ke pelanggan. Mohon tunggu konfirmasi pelanggan.</h1>
	</div>
	</>);
}

function RejectedPage({ myUser, user, consultation }: { myUser: any, user: any, consultation: any }) {
	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img className="rounded-xl object-cover w-full h-48" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="p-4 grid grid-cols-1 col-span-3">
	  <h1>Permintaan Konsultasi Berhasil Ditolak</h1>
	</div>
	</>);
}

function CanceledPage({ myUser, user, consultation }: { myUser: any, user: any, consultation: any }) {
	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img className="rounded-xl object-cover w-full h-48" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="p-4 grid grid-cols-1 col-span-3">
	  <h1>Konsultasi Berhasil Dibatalkan</h1>
	</div>
	</>);
}

function FailedPage() {
	return (<>
	<div className="flex flex-col gap-1">
		<ul className="p-4">
			<img className="rounded-xl object-cover w-full h-48" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="p-4 grid grid-cols-1 col-span-3">
	  <h1>Ada yang salah, silahkan ulangi lagi</h1>
	</div>
	</>);
}

export default function HomePage() {
  const [ status, setStatus ] = React.useState<'LOADING' | 'NOTFOUND' | 'SUCCESS' | 'ACCEPTED' | 'REJECTED' | 'CANCELED' | 'PAID' | 'COMPLETED' | 'FAILED'>('LOADING');
  const [ myUser, setMyUser ] = React.useState<any>({});
  const [ user, setUser ] = React.useState<any>({});
  const [ consultation, setConsultation ] = React.useState<any>({});
  const [ review, setReview ] = React.useState<any>({});

  const router = useRouter();

  const refreshUser = async () => {
		if (!router.isReady) return;

		const resAuth = await AuthAPI({ token: AuthService.getToken()! });
		setMyUser(resAuth.data);

		const consultation_id = router.query.consultation_id as string;
		const res = await GetConsultationAPI({ id: consultation_id });
		const success = res.success;

		if (success) {
			const _consultation = res.data;
			setConsultation(_consultation);

			if (_consultation.is_reviewed) {
				const resReview = await GetConsultationReviewAPI({ id: _consultation.id });
				if (resReview.success) {
					setReview(resReview.data);
				}
			}

			const userId = _consultation.customer_id;
			const resUser = await GetPublicUserAPI({ id: userId });
			const success = resUser.success;

			if (success) {
				const user = resUser.data;

				if (user.role == 'customer') {
					setUser(user);
					setStatus('SUCCESS');
				} else {
					setStatus('NOTFOUND');
				}
			} else {
				setStatus('NOTFOUND');
			}
		} else {
			setStatus('NOTFOUND');
		}
	};

  React.useEffect(() => {
	refreshUser();
  }, [ router.isReady ]);

  return (
    <>
      {/* <Seo templateTitle='Home' /> */}
      <Seo title="Detail Consultation" />

			<SidebarDoctor>
      	<main>
					<ShouldAuthorized roleSpecific="doctor">
						<section className='bg-white'>
							<div className='layout grid grid-cols-1 mt-8 w-100'>
							<h1 className="text-xl font-semibold mb-2">Informasi Konsultasi</h1>
							<div className="px-4 grid grid-cols-1 gap-3">
								{status === 'LOADING' && <LoadingPage />
								|| status === 'NOTFOUND' && <NotFoundPage />
								|| status === 'SUCCESS' && <SuccessPage myUser={myUser} user={user} consultation={consultation} review={review} setStatus={setStatus} refreshUser={refreshUser} />
								|| status === 'ACCEPTED' && <AcceptedPage myUser={myUser} user={user} consultation={consultation} />
								|| status === 'REJECTED' && <RejectedPage myUser={myUser} user={user} consultation={consultation} />
								|| status === 'CANCELED' && <CanceledPage myUser={myUser} user={user} consultation={consultation} />
								|| status === 'FAILED' && <FailedPage />
								}
							</div>
							</div>
						</section>
					</ShouldAuthorized>
				</main>
			</SidebarDoctor>
    </>
  );
}