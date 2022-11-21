import Link from "next/link";
import { TOKEN, DATABASE_ID } from "../config";

export default function Home({ title }: any) {
  return (
    <main className="flex h-screen w-full">
      <div className="m-auto">
        {title.map((v: any, i: number) => {
          return (
            <Link key={v} href={`/${i + 1}`}>
              <div>{v}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}

export async function getStaticProps() {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      sorts: [
        {
          property: "num",
          direction: "ascending",
        },
      ],
      page_size: 100,
    }),
  };

  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    options
  );
  const result = await res.json();
  const title = result.results.map(
    (data: any) => data.properties.title.title[0].plain_text
  );
  return {
    props: { title },
    revalidate: 1, // 데이터 변경이 있으면 갱신 1초 마다
  };
}
