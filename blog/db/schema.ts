import { relations } from "drizzle-orm";
import { unique } from "drizzle-orm/gel-core";
import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
    id : serial('id').primaryKey(),
    title : text("title").notNull(),
    author: text("author").notNull(),
    url: text("url").notNull(),
    likes : integer("likes").notNull().default(0),
    userID : integer("user_id").notNull().references(()=> users.id),

})

export const users = pgTable("users", {
    id : serial('id').primaryKey(),
    username : text("username").notNull().unique(),
    name : text("name").notNull(),
    passwordHash : text("passwordHash").notNull().default(""),
    token : text("token"),
})

export const readingList = pgTable("readingList", {
    id : serial('id').primaryKey(),
    userId : integer("user_id").notNull().references(() => users.id),
    blogId : integer("blog_id").notNull().references(() => blogs.id),
    read : boolean("read").notNull().default(false),
})

export const userRelation = relations(users, ({many}) => ({
    blogs : many(blogs),
    readingList : many(readingList),
})
)

export const blogRelation = relations(blogs, ({one, many}) => ({
    user: one(users, {
        fields : [blogs.userID],
        references : [users.id],
    }),
    readingListEntries: many(readingList),
}))

export const readingListRelation = relations(readingList, ({one}) => ({
    user: one(users, {
        fields: [readingList.userId],
        references: [users.id],
    }),
    blog: one(blogs, {
        fields: [readingList.blogId],
        references: [blogs.id],
    }),
}))
