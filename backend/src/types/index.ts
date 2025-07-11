export type User = {
    id: string;
    name: string;
    email: string;
};

export type Post = {
    id: string;
    title: string;
    content: string;
    authorId: string;
};

export type CreateUserInput = {
    name: string;
    email: string;
};

export type CreatePostInput = {
    title: string;
    content: string;
    authorId: string;
};