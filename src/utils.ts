import type { TableRowDefinition } from "@atlaskit/adf-schema";
import { traverse } from "@atlaskit/adf-utils";
import { asUser, asApp, route, storage } from "@forge/api";

const serialiseMap = (map: Map<string, string>) => {
  return JSON.stringify([...map.entries()]);
};

const deserialiseMap = (serialisedMap: string) => {
  return new Map<string, string>(JSON.parse(serialisedMap));
};

const computeGlossaryFromPage = async ({ withUser = true }) => {
  const response = await (withUser ? asUser : asApp)().requestConfluence(
    route`/wiki/rest/api/content/${process.env.GLOSSARY_PAGE_ID}?expand=body.atlas_doc_format`
  );

  const {
    body: {
      atlas_doc_format: { value },
    },
  } = await response.json();

  const adf = JSON.parse(value);

  const glossary: Map<string, string> = new Map();

  traverse(adf, {
    tableRow: ({ content }: TableRowDefinition) => {
      const tableCells = content?.filter((row) => row.type !== "tableHeader");

      if (tableCells?.length < 2) {
        return;
      }

      const [
        {
          content: [key],
        },
        {
          content: [value],
        },
      ] = content;

      if (
        key.type === "paragraph" &&
        value.type === "paragraph" &&
        key.content?.[0].type === "text" &&
        value.content?.[0].type === "text"
      ) {
        const word = key.content[0].text;
        const definition = value.content[0].text;
        glossary.set(word, definition);
      }
    },
  });

  return glossary;
};

const updateGlossary = async () => {
  const glossary = await computeGlossaryFromPage({ withUser: false });
  await storage.set(process.env.GLOSSARY_STORAGE_KEY, serialiseMap(glossary));

  return glossary;
};

const getGlossary = async (): Promise<Map<string, string>> => {
  const cachedGlossary = await storage.get(process.env.GLOSSARY_STORAGE_KEY);

  return cachedGlossary ? deserialiseMap(cachedGlossary) : updateGlossary();
};

export { computeGlossaryFromPage, getGlossary, updateGlossary };
