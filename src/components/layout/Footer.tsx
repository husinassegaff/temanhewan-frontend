import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

import ShouldAuthorized from '../auths/ShouldAuthorized';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="layout">
      <div className='max-w-screen-2xl py-14'>
        <div className='grid lg:grid-cols-12'>
          <div className='md:col-span-12 lg:col-span-6'>
            <UnstyledLink
              href='/'
              className='flex font-bold hover:text-gray-600'
            >
              <img alt='logo' className='h-8' src='/images/logo.png' />
              <img
                alt='logo-text'
                className='h-8'
                src='/images/logo-text.png'
              />
            </UnstyledLink>
            <div className='pt-12'>
              <p className='text-light-3 mt-5 text-base font-normal'>
                2022 - All rights reserved.
              </p>
            </div>
          </div>

          <ShouldAuthorized roleSpecific='customer'>
            <div className='md:col-span-4 lg:col-span-2'>
              <div className='text-light-3 mb-4 text-xl font-bold'>Layanan</div>
              <div className='mb-4'>
                <UnstyledLink
                  href='/dashboard/consultation'
                  className='text-md text-light-3 font-normal hover:text-primary-500'
                >
                  Konsultasi
                </UnstyledLink>
              </div>
              <div className='mb-4'>
                <UnstyledLink
                  href='/dashboard/grooming'
                  className='text-md text-light-3 font-normal hover:text-primary-500'
                >
                  Grooming
                </UnstyledLink>
              </div>
            </div>
          </ShouldAuthorized>

          <div className='md:col-span-4 lg:col-span-2'>
            <div className='text-light-3 mb-4 text-xl font-bold'>Lainnya</div>
            <div className='mb-4'>
              <UnstyledLink
                href='/forum'
                className='text-md text-light-3 font-normal hover:text-primary-500'
              >
                Forum
              </UnstyledLink>
            </div>
            <div className='mb-4'>
              <UnstyledLink
                href='/faq'
                className='text-md text-light-3 font-normal hover:text-primary-500'
              >
                FAQ
              </UnstyledLink>
            </div>
          </div>

          <div className='md:col-span-4 lg:col-span-2'>
            <div className=' text-light-3 mb-4 text-xl font-bold hover:text-primary-500'>
              Perusahaan Kami
            </div>
            <div className='mb-4'>
              <UnstyledLink
                href='/about'
                className='text-md text-light-3 font-normal hover:text-primary-500'
              >
                Tentang Kami
              </UnstyledLink>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
