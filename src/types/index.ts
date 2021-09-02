
export interface ControllerBase {
    initRoutes(): void
}

export interface PostNode {
    excerpt: string
    fields: {
        slug: string
    }
    frontmatter: {
        title: string
        date: Date
        description: string
        tags?: [] | null
    }
    rawMarkdownBody: string
}

export interface PostSchema {
    title: string
    content: string
    excerpt: string
    description?: string
    tags?: [] | null
    createTime: Date
    folderName: string
}

export interface ResponseWarpper {
    code: number
    message: string
    result?: any
}