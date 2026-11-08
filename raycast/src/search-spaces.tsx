import { Action, ActionPanel, Icon, List, Toast, showToast } from "@raycast/api";
import { usePromise, withAccessToken } from "@raycast/utils";
import { Space, Thread, callTool, cloudy, shareLink } from "./lib/cloudy";

function Comments({ space }: { space: Space }) {
  const { data, isLoading, revalidate } = usePromise(
    async (id: string) => (await callTool<{ threads: Thread[] }>("list_comments", { space_id: id })).threads,
    [space.id],
  );

  async function resolve(thread: Thread) {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Resolving comment" });
    try {
      await callTool("resolve_comment", { comment_id: thread.id });
      toast.style = Toast.Style.Success;
      toast.title = "Comment resolved";
      revalidate();
    } catch (e) {
      toast.style = Toast.Style.Failure;
      toast.title = "Couldn't resolve it";
      toast.message = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <List
      isLoading={isLoading}
      isShowingDetail
      navigationTitle={space.name}
      searchBarPlaceholder="Filter open comments"
    >
      <List.EmptyView icon={Icon.SpeechBubble} title="No open comments" />
      {data?.map((t) => (
        <List.Item
          key={t.id}
          title={t.body}
          subtitle={t.author}
          accessories={t.replies.length ? [{ icon: Icon.Reply, text: String(t.replies.length) }] : []}
          detail={
            <List.Item.Detail
              markdown={[
                t.quote ? `> ${t.quote.replace(/\n/g, "\n> ")}\n` : "",
                `**${t.author}**: ${t.body}`,
                ...t.replies.map((r) => `**${r.author}**: ${r.body}`),
              ].join("\n\n")}
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="File" text={t.path} />
                  <List.Item.Detail.Metadata.Label title="Version" text={String(t.version)} />
                  <List.Item.Detail.Metadata.Label title="Posted" text={new Date(t.createdAt).toLocaleString()} />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Open Page with Comments" url={space.links.withComments ?? space.links.app} />
              <Action icon={Icon.CheckCircle} title="Resolve Comment" onAction={() => resolve(t)} />
              <Action.CopyToClipboard title="Copy Comment" content={t.body} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function SearchSpaces() {
  const { data, isLoading } = usePromise(async () => (await callTool<{ spaces: Space[] }>("list_spaces")).spaces, []);

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search your spaces">
      <List.EmptyView
        icon={Icon.Cloud}
        title="No spaces yet"
        description="Publish an HTML file to make your first one."
      />
      {data?.map((s) => (
        <List.Item
          key={s.id}
          icon={s.visibility === "public" ? Icon.Globe : Icon.Lock}
          title={s.name}
          subtitle={s.workspace}
          keywords={[s.workspace, s.id]}
          accessories={[{ text: `v${s.latestVersion}`, tooltip: "Latest version" }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={shareLink(s.links)} />
              <Action.CopyToClipboard title="Copy Link" content={shareLink(s.links)} />
              <Action.Push icon={Icon.SpeechBubble} title="Show Comments" target={<Comments space={s} />} />
              <Action.OpenInBrowser title="Open in Cloudy App" url={s.links.app} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default withAccessToken(cloudy)(SearchSpaces);
