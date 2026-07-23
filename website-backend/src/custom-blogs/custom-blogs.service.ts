import { Injectable, Logger } from '@nestjs/common';
import { customBlogRepository } from '../repositories/CustomBlogRepository';
import { uploadImageToCloudinary } from '../shared/cloudinary';

@Injectable()
export class CustomBlogsService {
  private readonly logger = new Logger(CustomBlogsService.name);

  async getCustomBlogs() {
    try {
      const blogs = await customBlogRepository.findAllSorted();
      return blogs.map((b: any) => {
        const plainText = b.content ? b.content.replace(/<[^>]+>/g, '') : "";
        return {
          _id: b._id.toString(),
          title: b.title,
          slug: b.slug,
          content: b.content,
          excerpt: plainText.substring(0, 150) + (plainText.length > 150 ? "..." : ""),
          authorName: b.authorName || "Yatri",
          category: b.category || "Travel Guides",
          featuredImage: b.thumbnailUrl || "/images/blogs/default.jpg",
          ogImage: b.thumbnailUrl || "/images/blogs/default.jpg",
          publishedAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.createdAt || new Date().toISOString(),
          readingTimeMinutes: Math.max(1, Math.ceil((b.content || "").split(/\s+/).length / 200)),
          tags: b.tags || ["Community"],
          isHidden: b.isHidden || false,
        };
      });
    } catch (error) {
      this.logger.error("Failed to fetch custom blogs", error);
      return [];
    }
  }

  async getCustomBlogBySlug(slug: string) {
    try {
      const blog = await customBlogRepository.findBySlug(slug);
      if (!blog) return null;

      return {
        _id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        authorName: blog.authorName || "Yatri",
        category: blog.category || "Travel Guides",
        featuredImage: blog.thumbnailUrl || "/images/blogs/default.jpg",
        ogImage: blog.thumbnailUrl || "/images/blogs/default.jpg",
        publishedAt: blog.createdAt || new Date().toISOString(),
        updatedAt: blog.createdAt || new Date().toISOString(),
        readingTimeMinutes: Math.max(1, Math.ceil((blog.content || "").split(/\s+/).length / 200)),
        tags: blog.tags || ["Community"],
        isHidden: blog.isHidden || false,
      };
    } catch (error) {
      this.logger.error("Failed to fetch custom blog by slug", error);
      return null;
    }
  }

  async createCustomBlog(data: any) {
    const { title, content, authorName, category, thumbnailBase64 } = data;

    let thumbnailUrl = "";
    if (thumbnailBase64 && thumbnailBase64.length > 0) {
      thumbnailUrl = await uploadImageToCloudinary(thumbnailBase64, "blogs");
    }

    let slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!slugBase) slugBase = "untitled";
    const uniqueSuffix = Date.now().toString().slice(-6);
    const slug = `${slugBase}-${uniqueSuffix}`;

    const newBlog = {
      title,
      slug,
      content,
      authorName,
      category,
      thumbnailUrl,
      createdAt: new Date().toISOString(),
    };

    const insertedId = await customBlogRepository.insertOne(newBlog);
    return { success: true, blogId: insertedId, slug };
  }

  async updateCustomBlog(id: string, data: any) {
    const updateDoc: any = {
      title: data.title,
      content: data.content,
      authorName: data.authorName,
      category: data.category,
      updatedAt: new Date().toISOString()
    };

    if (data.thumbnailBase64 && data.thumbnailBase64.length > 0) {
      updateDoc.thumbnailUrl = await uploadImageToCloudinary(data.thumbnailBase64, "blogs");
    }

    await customBlogRepository.updateOne(id, updateDoc);
    return { success: true };
  }

  async deleteCustomBlog(id: string) {
    await customBlogRepository.deleteOne(id);
    return { success: true };
  }

  async toggleBlogVisibility(id: string, isHidden: boolean) {
    await customBlogRepository.updateOne(id, { isHidden });
    return { success: true };
  }
}
