import { useRouter } from 'next/router'
import * as React from 'react';

import ShouldAuthorized from '@/components/auths/ShouldAuthorized';
import InputText from '@/components/forms/InputText';
import Sidebar from '@/components/layout/Sidebar';
import Seo from '@/components/Seo';

import RetrievePetAPI from '@/api/RetrievePetAPI';
import UpdatePetAPI from '@/api/UpdatePetAPI';
import PetType from '@/enums/PetType';
import Pet from '@/interfaces/Pet';

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

function getPetType(petRace: string | PetType) {
	switch (petRace) {
		case PetType.Cat:
		case 'cat':
			return 'Kucing';
		case PetType.Dog:
		case 'dog':
			return 'Anjing';
	}
	return 'Awokawok';
}

function getPetRace(petType: string | PetType) {
	switch (petType) {
		case 'cat':
		case 'Cat':
		case PetType.Cat:
			return 'cat';
		case 'dog':
		case 'Dog':
		case PetType.Dog:
			return 'dog';
	}
	return 'Awokawok';
}

function getGender(gender: string) {
	switch (gender) {
		case 'm':
			return 'Jantan';
		case 'f':
			return 'Betina';
	}
	return 'Awokawok';
}

function NotFoundPage() {
	return (<>
	<div className="flex flex-col gap-1">
		<ul>
			<img className="rounded-xl object-cover w-full h-auto" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="grid grid-cols-1">
	  <h1>Peliharaan tidak ditemukan</h1>
	</div>
	</>);
}

function LoadingPage() {
	return (<>
	<div className="flex flex-col gap-1">
		<ul>
			<img className="rounded-xl object-cover w-full h-auto" src="/images/cover/register-cover.png" />
		</ul>
	</div>
	<div className="grid grid-cols-1">
	  <h1>Memuat..</h1>
	</div>
	</>);
}

function SuccessPage({ myPet }: { myPet: Pet }) {
	const router = useRouter();

	const profileImageInput = React.useRef(null);
	const [name, setName] = React.useState(myPet.name);
	const [description, setDescription] = React.useState(myPet.description);
	const [gender, setGender] = React.useState(myPet.gender);
	const [petRace, setPetRace] = React.useState(myPet.race);

	React.useEffect(()=> {
		console.log(myPet);
	});

	function getProfileImage(){
		const input: any = profileImageInput.current!;
		if (input.files && input.files.length > 0) {
			return input.files[0];
		}

		return undefined;
	}

	function handleSetName(e: any) {
		setName(e.target.value);
	}

	function handleSetDescription(e: any) {
		setDescription(e.target.value);
	}

	function handleSetPetRace(e: any) {
		setPetRace(e.target.value);
	}

	function handleSetGender(e: any) {
		setGender(e.target.value);
	}

	async function handleSubmit(e: any){
		e.preventDefault();
		console.log("update");
		console.log(myPet.id);

		console.log(petRace);
		console.log(getPetRace(petRace));

		const res = await UpdatePetAPI({
			id: myPet.id!,
			name: name,
			description: description,
			gender: gender,
			race: getPetRace(petRace),
			profile_image: getProfileImage()
		});
		console.log(res);
		const success = res.success;
		if (success) {
			console.log("Update pet success");
			router.push(`/dashboard/my-pet/i/${myPet.id}`);
		} else {
			console.log("Update pet failed");
		}
	}

	return (<>
	<div className="flex flex-col gap-1">
		<ul>
			<img className="rounded-xl object-cover w-full h-auto" src={myPet.imageUrl} />
		</ul>
	</div>
	<form className="p-4 grid grid-cols-1 gap-2" onSubmit={handleSubmit}>
		<div className="flex flex-col items-start w-full">
				<label htmlFor="petType">Foto Peliharaan</label>
				<input ref={profileImageInput} name="profile_image" type="file" accept="image/*" />
			</div>
	  <InputText label="Nama" name="name" type="text" value={name} onChange={handleSetName} />
		  <div className="flex flex-col items-start w-full">
			  <label htmlFor="petType">Jenis Peliharaan</label>
			  <select className="w-full" id="petType" value={petRace} onChange={handleSetPetRace}>
				{Object.keys(PetType).filter((v) => isNaN(Number(v))).map((v, i) => 
					(<option key={`petType-${v}`} value={getPetRace(v)}>{getPetType(i)}</option>)
				)}
			  </select>
		  </div>

		  <div className="flex flex-col items-start w-full">
			  <label htmlFor="gender">Jenis Kelamin</label>
			  <select className="w-full" id="gender" value={gender} onChange={handleSetGender}>
				{['m', 'f'].map((v, i) => 
					(<option key={`gender-${v}`} value={v}>{getGender(v)}</option>)
				)}
			  </select>
		  </div>

		  <div className="flex flex-col items-start w-full">
			  <label htmlFor="description">Deskripsi</label>
			  <textarea className="w-full" name="description"onChange={handleSetDescription} value={description} />
		  </div>

		  <input className="bg-primary-500 text-white font-semibold rounded-xl p-3" type="submit" value="Perbarui" />
	</form>
	</>);
}

export default function HomePage() {
  const router = useRouter();
  const [ status, setStatus ] = React.useState<'LOADING' | 'NOTFOUND' | 'SUCCESS'>('LOADING');
  const [ myPet, setMyPet ] = React.useState<Pet>({ id: '', name: '', race: PetType.Cat, gender: 'm', description: ''});

  React.useEffect(() => {
	(async () => {
		// check router ready
		if (!router.isReady) return;

		const id: string = router.query.id as string;

		// get my pets from server
		const res = await RetrievePetAPI({ id });
		const success = res.success;
		const pet: Pet = res.data;

		pet.imageUrl = res.data.profile_image;

		if (pet && pet.id != '') {
			setMyPet(pet);
			setStatus('SUCCESS');
		} else {
			setStatus('NOTFOUND');
		}
	})();
  }, [ router.isReady ]);

  return (
    <>
      <Seo title="Update Pet" />

			<Sidebar>
				<main>
					<ShouldAuthorized roleSpecific='customer'>
						<section className='bg-white'>
							<div>
								<h1 className="text-xl font-semibold mb-2">Perbarui Data Hewan Peliharaan Saya</h1>
								<div className="grid grid-cols-2 gap-3">
									{status === 'LOADING' && <LoadingPage />
									|| status === 'NOTFOUND' && <NotFoundPage />
									|| status === 'SUCCESS' && <SuccessPage myPet={myPet} />
									}
								</div>
							</div>
						</section>
					</ShouldAuthorized>
				</main>
			</Sidebar>
    </>
  );
}