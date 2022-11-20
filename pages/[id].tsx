import { DATABASE_ID, TOKEN } from "../config";

const Detail = ({ projects }: any) => {
  console.log(projects);
  return (
    <div>
      <span className="m-auto">
        {projects.map((v: any, i: number) => {
          return <code key={i}>{v.code.rich_text[0].plain_text}</code>;
        })}
      </span>
    </div>
  );
};

export default Detail;

export const getStaticPaths = async () => {
  return {
    paths: Array.from({ length: 10 }, (_, i) => i + 1).map((id) => {
      return {
        params: {
          id: String(id),
        },
      };
    }),
    fallback: false,
  };
};

export async function getStaticProps(content: any) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      filter: {
        property: "title",
        rich_text: {
          contains: `${content.params.id}`,
        },
      },
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
