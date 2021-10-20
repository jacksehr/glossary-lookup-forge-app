import ForgeUI, {
  ContextMenu,
  ContextMenuExtensionContext,
  InlineDialog,
  render,
  Text,
  useProductContext,
  useState,
} from "@forge/ui";
import { getGlossary, updateGlossary } from "./utils";

const App = () => {
  const [content] = useState<string>(async () => {
    const { extensionContext } = useProductContext();

    if (extensionContext.type !== "contextMenu") {
      return "This doesn't work outside a context menu!";
    }
    const { selectedText } = extensionContext as ContextMenuExtensionContext;

    const glossary = await getGlossary();

    const definition = glossary.get(selectedText);

    if (!definition) {
      return `⚠️ We didn't find a definition for "${selectedText}"!`;
    }

    return definition;
  });

  return (
    <InlineDialog>
      <Text>{content}</Text>
    </InlineDialog>
  );
};

export const lookup = render(
  <ContextMenu>
    <App />
  </ContextMenu>
);

export const update = async (event) => {
  if (event?.content?.id !== `${process.env.GLOSSARY_PAGE_ID}`) return;

  await updateGlossary();
};
