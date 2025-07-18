import { Metadata } from "next";
import { notFound } from "next/navigation";
import { linksTopics } from "@/lib/footerLinks";
import TopicPage from "./TopicPage";
import { getMatchingTopics } from "@/app/api/topic/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getTopicLabel(slug: string): string | null {
  const topic = linksTopics.find(
    (l) => l.slug.toLowerCase() === decodeURIComponent(slug).toLowerCase()
  );
  return topic ? topic.label : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = getTopicLabel(slug);

  if (!label) {
    return {
      title: "Тема не найдена",
      description: "Запрошенная тема отсутствует на сайте.",
    };
  }

  try {
    const matchingTopics = await getMatchingTopics(label);
    if (matchingTopics.length > 0 && matchingTopics[0].seo) {
      const { metaTitle, metaDescription, metaKeys } = matchingTopics[0].seo;
      return {
        title: metaTitle || label,
        description: metaDescription || `Читайте статьи на тему ${label}.`,
        keywords: metaKeys || "",
      };
    }
  } catch (err) {
    console.error(err);
  }

  return {
    title: label,
    description: `Читайте статьи на тему ${label}.`,
    keywords: "",
  };
}

export default async function TopicPageWrapper({ params }: PageProps) {
  // Await the params to get the slug
  const { slug } = await params;
  const label = getTopicLabel(slug);

  if (!label) {
    notFound();
  }

  let matchingTopics: any;
  let error: string | null = null;

  try {
    matchingTopics = await getMatchingTopics(label);
  } catch (err: any) {
    error = err.message;
  }

  return (
    <TopicPage
      slug={slug}
      topicLabel={label}
      matchingTopics={matchingTopics}
      error={error}
    />
  );
}
