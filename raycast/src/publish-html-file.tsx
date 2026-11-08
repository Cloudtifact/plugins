import {
  Action,
  ActionPanel,
  Clipboard,
  Detail,
  Form,
  Icon,
  Toast,
  open,
  showToast,
  useNavigation,
} from "@raycast/api";
import { usePromise, withAccessToken } from "@raycast/utils";
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, extname, relative, resolve, sep } from "node:path";
import { Published, Space, callTool, cloudy, shareLink } from "./lib/cloudy";

const TEXT = new Set([".css", ".js", ".mjs", ".json", ".svg", ".txt", ".md", ".html", ".htm", ".csv", ".xml"]);

/** Local files the page loads by relative path (src="…", href="…"), from its own folder down. */
function referencedFiles(htmlPath: string, html: string) {
  const root = dirname(htmlPath);
  const seen = new Set<string>();
  const files: { path: string; content: string; encoding: "utf8" | "base64" }[] = [];
  for (const m of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"'#?]+)/gi)) {
    const ref = m[1].trim();
    if (!ref || /^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.startsWith("/") || ref.startsWith("//")) continue;
    const full = resolve(root, ref);
    const rel = relative(root, full).split(sep).join("/");
    if (rel.startsWith("..") || rel === "index.html" || seen.has(rel)) continue;
    if (!existsSync(full) || !statSync(full).isFile()) continue;
    seen.add(rel);
    const text = TEXT.has(extname(full).toLowerCase());
    files.push({
      path: rel,
      content: readFileSync(full).toString(text ? "utf8" : "base64"),
      encoding: text ? "utf8" : "base64",
    });
  }
  return files;
}

function Done({ result }: { result: Published }) {
  const link = shareLink(result.links);
  const markdown = [
    `# ${result.name}`,
    `Published version ${result.version}. The link is copied.`,
    `[${link}](${link})`,
    result.visibility === "public"
      ? "Anyone with the link can view and comment."
      : "Private: only members of the workspace can open it.",
    result.addedAsPage ? `_${result.addedAsPage.split(".")[0]}._` : "",
  ].join("\n\n");
  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={link} />
          <Action.CopyToClipboard title="Copy Link" content={link} />
        </ActionPanel>
      }
    />
  );
}

type Values = { file: string[]; target: string; public: boolean; message: string };

function PublishHtmlFile() {
  const { push } = useNavigation();
  const { data: spaces, isLoading } = usePromise(
    async () => (await callTool<{ spaces: Space[] }>("list_spaces")).spaces,
    [],
  );

  async function submit(values: Values) {
    const path = values.file[0];
    if (!path || !/\.html?$/i.test(path)) {
      await showToast({ style: Toast.Style.Failure, title: "Pick an HTML file" });
      return false;
    }
    const toast = await showToast({ style: Toast.Style.Animated, title: `Publishing ${basename(path)}` });
    try {
      const html = readFileSync(path, "utf8");
      const files = referencedFiles(path, html);
      const isNew = values.target === "new";
      const result = await callTool<Published>("publish_page", {
        html,
        ...(files.length ? { files } : {}),
        ...(isNew ? { public: values.public } : { space_id: values.target }),
        ...(values.message ? { message: values.message } : {}),
      });
      const link = shareLink(result.links);
      await Clipboard.copy(link);
      toast.style = Toast.Style.Success;
      toast.title = "Published, link copied";
      toast.primaryAction = { title: "Open in Browser", onAction: () => open(link) };
      push(<Done result={result} />);
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Couldn't publish";
      toast.message = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Upload} title="Publish" onSubmit={submit} />
        </ActionPanel>
      }
    >
      <Form.FilePicker id="file" title="HTML File" allowMultipleSelection={false} canChooseDirectories={false} />
      <Form.Dropdown id="target" title="Publish To" defaultValue="new">
        <Form.Dropdown.Item value="new" title="New space" icon={Icon.Plus} />
        <Form.Dropdown.Section title="New version of">
          {spaces?.map((s) => (
            <Form.Dropdown.Item
              key={s.id}
              value={s.id}
              title={s.name}
              icon={s.visibility === "public" ? Icon.Globe : Icon.Lock}
            />
          ))}
        </Form.Dropdown.Section>
      </Form.Dropdown>
      <Form.Checkbox
        id="public"
        label="Anyone with the link can view and comment"
        defaultValue={false}
        info="New spaces only. Otherwise only your workspace can open it."
      />
      <Form.TextField id="message" title="Note" placeholder="What changed (optional)" />
      <Form.Description text="Files the page loads from its own folder (CSS, scripts, images) are published with it." />
    </Form>
  );
}

export default withAccessToken(cloudy)(PublishHtmlFile);
