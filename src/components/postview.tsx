import Image from "next/image";
import { RouterOutputs } from "~/utils/api";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostWithUser) => {
    const { post, author } = props
    return (<div key={post.id}
        className="p-4 border-b border-slate-400 flex gap-3">
        <Image src={author.profilePicture}
            alt="{`@${author.username}'s profille picture`}"
            className="w-14 h-14 rounded-full"
            width={56} height={56} />
        <div className="flex flex-col">
            <div className="flex gap-1 text-slate-300">
                <Link href={`/@${author.username}`}>
                    <span>{`@${author.username!}`}</span>
                </Link>
                <Link href={`/post/${post.id}`}>
                    <span className="font-thin">
                        {` . ${dayjs(post.createdAt).fromNow()}`}
                    </span>
                </Link>
            </div>
            <span className="text-xl">
                {post.content}
            </span>
        </div>
    </div>
    );
}