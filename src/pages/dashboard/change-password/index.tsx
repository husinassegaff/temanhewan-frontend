import { useRouter } from 'next/router';
import * as React from 'react';

import ShouldAuthorized from '@/components/auths/ShouldAuthorized';
import Seo from '@/components/Seo';

import ChangeUserPasswordAPI from '@/api/ChangeUserPasswordAPI';

import ChangePasswordCustomer from './ChangePasswordCustomer';
import ChangePasswordDoctor from './ChangePasswordDoctor';
import ChangePasswordGroomer from './ChangePasswordGroomer';

export default function ChangePassword({ onSubmit }: { onSubmit?: any }) {
  const [oldPassword, setOldPassword] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [passwordConf, setPasswordConf] = React.useState('');
	const router = useRouter();

	function handleOldPassword(e: any) {
		setOldPassword(e.target.value);
	}

	function handlePassword(e: any) {
		setPassword(e.target.value);
	}

	function handlePasswordConf(e: any) {
		setPasswordConf(e.target.value);
	}

	async function handleSubmit(e: any) {
		e.preventDefault();
		console.log('submit change password');

		const res = await ChangeUserPasswordAPI({ old_password: oldPassword, password: password, password_confirmation: passwordConf });
		console.log(res);
		const success = res.success;
		if (success) {
			console.log('change password success');
		} else {
			console.log('change password failed');
		}

		if (onSubmit !== undefined) {
			onSubmit();
		}
		
		setTimeout(() => {router.push('/dashboard/my-profile')} , 1000);
	}

	return <>
    <Seo title="Change Password"/>

			<main>
				<ShouldAuthorized>
					<ShouldAuthorized roleSpecific='customer' dontRedirect={true}>
						<ChangePasswordCustomer />
					</ShouldAuthorized>
					<ShouldAuthorized roleSpecific='doctor' dontRedirect={true}>
						<ChangePasswordDoctor />
					</ShouldAuthorized>
					<ShouldAuthorized roleSpecific='grooming' dontRedirect={true}>
						<ChangePasswordGroomer />
					</ShouldAuthorized>
				</ShouldAuthorized>
			</main>
  </>
}