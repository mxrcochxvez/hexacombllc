import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

/** Cascade-delete design demos + comments (+ storage) for a client. */
export async function removeDesignDemosForClient(
  ctx: MutationCtx,
  clientId: Id<"clients">,
): Promise<void> {
  const demos = await ctx.db
    .query("designDemos")
    .withIndex("by_client", (q) => q.eq("clientId", clientId))
    .collect();

  for (const demo of demos) {
    const comments = await ctx.db
      .query("designDemoComments")
      .withIndex("by_demo", (q) => q.eq("demoId", demo._id))
      .collect();
    for (const comment of comments) {
      if (comment.screenshotStorageId) {
        await ctx.storage.delete(comment.screenshotStorageId);
      }
      await ctx.db.delete(comment._id);
    }
    await ctx.db.delete(demo._id);
  }
}
