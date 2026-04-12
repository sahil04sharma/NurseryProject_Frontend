import { ArrowRight, Calendar, Tag } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ post }) => {
  const {
    _id,
    id,
    slug,
    title,
    banner,
    coverImg,
    thumbnail,
    tags,
    categories,
    createdAt,
    publishedAt,
    excerpt,
    description,
    content,
    author,
  } = post || {};

  const image =
    post?.bannerImage ||
    (Array.isArray(post?.bannerImg) ? post.bannerImg[0] : null) || // if some blogs use bannerImg array
    "https://images.unsplash.com/photo-1529651737248-dad5e287768e?w=900&q=80&auto=format&fit=crop";

  const date = publishedAt || createdAt || null;
  const dateText = date ? new Date(date).toLocaleDateString() : "—";
  const postTags = Array.isArray(tags)
    ? tags
    : Array.isArray(categories)
    ? categories
    : [];
  const postId = _id || id || slug;

  const preview =
    typeof excerpt === "string" && excerpt.trim()
      ? excerpt
      : typeof description === "string" && description.trim()
      ? description
      : typeof content === "string"
      ? content.slice(0, 160)
      : "";

  return (
    <article className="group rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow duration-200 flex flex-col">
      <Link to={`/blogs/${slug || postId}`} className="block">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className="roboto-serif">{dateText}</span>
          </div>
          {postTags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span className="truncate roboto-serif max-w-40">
                {postTags.slice(0, 3).join(", ")}
                {postTags.length > 3 ? "…" : ""}
              </span>
            </div>
          )}
        </div>

        <Link to={`/blog/${slug || postId}`} className="block">
          <h3 className="text-base sm:text-lg md:text-xl h-12 roboto-serif text-gray-900 leading-snug line-clamp-2">
            {title || "Untitled"}
          </h3>
        </Link>

        {author?.name && (
          <div className="text-xs text-gray-600">
            By <span className="font-medium roboto-serif">{author.name}</span>
          </div>
        )}

        <p className="text-sm text-gray-600 line-clamp-3 roboto-serif">{preview}</p>

        <div className="mt-auto">
          <Link
            to={`/blogs/${slug || postId}`}
            className="inline-flex items-center gap-1.5 text-body text-[#1A4122] hover:text-[#16361c] "
          >
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
