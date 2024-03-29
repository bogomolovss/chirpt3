import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Image from "next/image";
import { PostView } from "~/components/postview";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId
  });

  if (isLoading) return <LoadingPage />;

  if (!data || data.length === 0) return <div>User has not posted</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>

      <PageLayout>
        <div className="h-24 border-slate-400
          bg-slate-600 relative">
          <Image src={data.profilePicture}
            alt={`${data.username ?? ""} profile picture`}
            width={128}
            height={128}
            className="absolute rounded-full bottom-0 left-0
            -mb-[64px] ml-4 border-2 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">
          {`@${data.username ?? ""}`}
        </div>
        <div className="border-b border-slate-400 w-full"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
}
export default ProfilePage;
