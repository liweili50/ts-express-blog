import { Schema, model } from "mongoose"
import dayjs from 'dayjs'
import { Converter } from 'showdown'
import { PostSchema } from "types"
const converter = new Converter()

const postSchema = new Schema({
  title: {
    type: String,
    required: false
  },
  author: {
    type: String,
    default: 'jonas'
  },
  content: {
    type: String,
    required: true,
    get: (v: string) => converter.makeHtml(v)
  },
  excerpt: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  tags: {
    type: [String],
    required: false
  },
  folderName: {
    type: String,
    required: false
  },
  createTime: {
    type: Date,
    required: false,
    get: (v: Date) => dayjs(v).format('YYYY-MM-DD HH:mm')
  },
  updateTime: {
    type: Date,
    required: false,
    get: (v: Date) => dayjs(v).format('YYYY-MM-DD HH:mm')
  }
}, {
  versionKey: false, toJSON: {
    getters: true
  }
});

const Post = model('Post', postSchema);

export function createPost(post:PostSchema): Promise<any> {
  return Post.create(post)
}

export function syncPostsFromGithub(list: []): Promise<any> {
  return Post.insertMany(list)
}

export function getPostById(id: String) {
  return Post.findById(id)
}

export function getTagsList() {
  return Post.aggregate([{ $unwind: "$tags" }, { $group: { _id: "$tags", num_of_tag: { $sum: 1 } } }])
}

export function getPostsByTag(tag: String) {
  return Post.find({
    tags: {
      $elemMatch: { $eq: tag }
    }
  })
}

export async function getPostsList(query: { pageSize: number, pageNum: number, tag?: string, keyword?: string }): Promise<any> {
  let { pageSize, pageNum, tag, keyword, ...rest } = query;
  if (tag) {
    Object.assign(rest, {
      tags: {
        $elemMatch: { $eq: tag }
      }
    })
  } else if (keyword) {
    Object.assign(rest, {
      title: {
        $regex: keyword, "$options": "i"
      }
    })
  }
  let total = await Post.find(rest).countDocuments()
  let list = await Post.find(rest).skip((pageNum - 1) * pageSize).limit(pageSize)
  return { list, pageNum, pageSize, total }
}

export function getArchiveList() {
  return Post.aggregate([
    {
      $group: {
        _id: { $year: "$createTime" },
        category: {
          $first: {
            $year: "$createTime"
          }
        },
        list: {
          $push: {
            id: '$_id',
            author: '$author',
            title: '$title',
            createTime: '$createTime'
          }
        }
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ])
}


export default Post