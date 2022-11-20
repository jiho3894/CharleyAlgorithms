import { TOKEN, DATABASE_ID } from "../config";

export default function Home({ projects }: any) {
  return (
    <main className="flex h-screen w-full">
      <span className="m-auto">
        {projects.map((v: any, i: number) => {
          return <div key={i}>{v.code.rich_text[0].plain_text}</div>;
        })}
      </span>
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
          property: "title",
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
  const projects = result.results.map((data: any) => data.properties);
  return {
    props: { projects },
    revalidate: 1, // 데이터 변경이 있으면 갱신 1초 마다
  };
}
