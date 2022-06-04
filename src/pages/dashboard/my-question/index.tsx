import * as React from 'react';

import ShouldAuthorized from '@/components//auths/ShouldAuthorized';
import CardForum from '@/components/card/CardForum';
import Sidebar from '@/components/layout/Sidebar';
import Seo from '@/components/Seo';

import GetMyForumAPI from '@/api/GetMyForumAPI';
import Forum from '@/interfaces/Forum';

export default function MyForum() {
  const [myForum, setMyForum] = React.useState<Forum[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await GetMyForumAPI({ offset: 0, limit: 10 });
      setMyForum(res.data);
    })();
  }, []);

  return (
    <>
      <Seo title='My Questions' />

      <main>
        <ShouldAuthorized roleSpecific='customer'>
          <Sidebar>
            <div className='flex flex-col items-start justify-start gap-3 p-4 text-left'>
              <h1 className='p-5 text-xl font-semibold'>Pertanyaan Saya</h1>
              {myForum.map((forum) => {
                return (
                  <div key={forum.id}>
                    <CardForum
                      slug={forum.slug}
                      title={forum.title}
                      subtitle={forum.subtitle}
                      content={forum.content}
                    />
                  </div>
                );
              })}
            </div>
          </Sidebar>
        </ShouldAuthorized>
      </main>
    </>
  );
}