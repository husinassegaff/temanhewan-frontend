import Link from 'next/link';
import * as React from 'react';

import ShouldAuthorized from '@/components/auths/ShouldAuthorized';
import Sidebar from '@/components/layout/Sidebar';
import Seo from '@/components/Seo';

import ListPetAPI from '@/api/ListPetAPI';
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

function getPetRace(petType: PetType | string | number | null) {
	switch (petType) {
		case 0:
		case 'Cat':
		case 'cat':
		case PetType.Cat:
			return 'cat';
		case 1:
		case 'Dog':
		case 'dog':
		case PetType.Dog:
			return 'dog';
	}
	return 'Awokawok';
}

function PetLabelComponent({ handlePetFilter, filter, petType, children } : { handlePetFilter: any, filter: PetType | string | number | null, petType: PetType | null, children: any }) {
	const petFilterClassNames = 'p-2 rounded-lg cursor-pointer';
	const petFilterActiveClassNames = 'bg-primary-500 text-white';

	return (<li onClick={() => handlePetFilter(petType)} className={`${petFilterClassNames} ${getPetRace(filter) == getPetRace(petType) ? petFilterActiveClassNames : ''}`}>{children}</li>);
}

export default function HomePage() {
  const [ myPets, setMyPets ] = React.useState<Pet[]>([]);
  const [ myFilteredPets, setMyFilteredPets ] = React.useState<Pet[]>([]);
  const [ filter, setFilter ] = React.useState<PetType | string | number | null>(null);
  const [ petFlags, setPetFlags ] = React.useState<Set<number>>(new Set<number>());

  React.useEffect(() => {
	(async () => {
		// get my pets from server
		const res = await ListPetAPI({ offset:0, limit: 10 });
		const retrievePets = res.data.map((d: any) => { const b: any = d; b.imageUrl = d.profile_image; return b; });
		const sortedPets = retrievePets.sort((a: Pet, b: Pet) => a.name.localeCompare(b.name));
		const flags = new Set<number>();

		for (let i = 0; i < sortedPets.length; i++) {
		  flags.add(sortedPets[i].race);
		}

		setMyPets(sortedPets);
		setMyFilteredPets(sortedPets);
		setPetFlags(flags);
	})();
  }, []);

  function handlePetFilter(filter: PetType | string | null) {
	if (filter === null) {
		setMyFilteredPets(myPets);
		setFilter(null);
	} else {
        const filteredPets = myPets.filter((pet: Pet) => getPetRace(pet.race) === getPetRace(filter));
		const sortedPets = filteredPets.sort((a: Pet, b: Pet) => a.name.localeCompare(b.name));
		setMyFilteredPets(sortedPets);
		setFilter(filter);
	}
  }

  return (
    <>
    <Seo title = "My Pet"/>

		<Sidebar>
      <main>
				<ShouldAuthorized roleSpecific='customer'>
					<section className='bg-white'>
						<div className='p-4 layout grid grid-cols-1 mt-8 w-100'>
							<h1 className="text-xl font-semibold mb-4">Hewan Peliharaan saya</h1>
							<div className="grid grid-cols-4 gap-3">
								<div className="flex flex-col gap-1">
									<ul>
										<PetLabelComponent handlePetFilter={handlePetFilter} filter={getPetRace(filter)} petType={null}>Semua</PetLabelComponent>
										<PetLabelComponent handlePetFilter={handlePetFilter} filter={getPetRace(filter)} petType={PetType.Cat}>Kucing</PetLabelComponent>
										<PetLabelComponent handlePetFilter={handlePetFilter} filter={getPetRace(filter)} petType={PetType.Dog}>Anjing</PetLabelComponent>
									</ul>
								</div>
								<div className="p-4 grid grid-cols-3 col-span-3">
									{myFilteredPets.map((pet) => {
										return (
											<Link key={pet.id} href={`/dashboard/my-pet/i/${pet.id}`}>
												<a>
													<div className="p-2">
														<img className="rounded-xl object-cover w-full h-48" src={pet.imageUrl ? pet.imageUrl : ''} alt="hewan saya"/>
														<div className="flex flex-row justify-between">
															<span>{pet.name}</span>
															<span>{pet.gender == 'm' ? 'M' : 'F'}</span>
														</div>
													</div>
												</a>
											</Link>);
														})}
								</div>
							</div>
						<Link href="/dashboard/add-pet"><a className="fixed right-4 bottom-4 bg-primary-500 text-white rounded-xl w-16 h-16 flex flex-col items-center justify-center font-semibold text-xl">+</a></Link>
						</div>
					</section>
				</ShouldAuthorized>
      </main>
		</Sidebar>
    </>
  );
}