// the front end will know what back end will return it's type

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({ name: v.string() }),
});

