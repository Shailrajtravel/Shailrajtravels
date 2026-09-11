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
        const img = b.thumbnailUrl || b.featuredImage || b.posterUrl || "/images/blogs/default.jpg";
        return {
          _id: b._id.toString(),
          title: b.title,
          slug: b.slug,
          content: b.content,
          excerpt: b.excerpt || plainText.substring(0, 160) + (plainText.length > 160 ? "..." : ""),
          authorName: b.authorName || "Shailraj Travels Editorial Team",
          category: b.category || "Travel Guides",
          featuredImage: img,
          thumbnailUrl: img,
          ogImage: img,
          publishedAt: b.createdAt || new Date().toISOString(),
          updatedAt: b.updatedAt || b.createdAt || new Date().toISOString(),
          readingTimeMinutes: Math.max(1, Math.ceil((b.content || "").split(/\s+/).length / 200)),
          tags: b.tags || ["Travel Guide"],
          isHidden: b.isHidden || false,
          metaTitle: b.metaTitle || b.title,
          metaDescription: b.metaDescription || b.excerpt || (plainText.substring(0, 160)),
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

      const plainText = blog.content ? blog.content.replace(/<[^>]+>/g, '') : "";
      const img = blog.thumbnailUrl || blog.featuredImage || blog.posterUrl || "/images/blogs/default.jpg";

      return {
        _id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt || plainText.substring(0, 160) + (plainText.length > 160 ? "..." : ""),
        authorName: blog.authorName || "Shailraj Travels Editorial Team",
        category: blog.category || "Travel Guides",
        featuredImage: img,
        thumbnailUrl: img,
        ogImage: img,
        publishedAt: blog.createdAt || new Date().toISOString(),
        updatedAt: blog.updatedAt || blog.createdAt || new Date().toISOString(),
        readingTimeMinutes: Math.max(1, Math.ceil((blog.content || "").split(/\s+/).length / 200)),
        tags: blog.tags || ["Travel Guide"],
        isHidden: blog.isHidden || false,
        metaTitle: blog.metaTitle || blog.title,
        metaDescription: blog.metaDescription || blog.excerpt || (plainText.substring(0, 160)),
        tableOfContents: blog.tableOfContents,
        faqs: blog.faqs,
      };
    } catch (error) {
      this.logger.error("Failed to fetch custom blog by slug", error);
      return null;
    }
  }

  async createCustomBlog(data: any) {
    const {
      title,
      content,
      authorName,
      category,
      thumbnailBase64,
      thumbnailUrl,
      slug: customSlug,
      excerpt,
      metaTitle,
      metaDescription,
      tags,
    } = data;

    let finalImageUrl = thumbnailUrl || "";
    if (thumbnailBase64 && thumbnailBase64.startsWith("data:image")) {
      finalImageUrl = await uploadImageToCloudinary(thumbnailBase64, "blogs");
    } else if (thumbnailBase64 && thumbnailBase64.startsWith("http")) {
      finalImageUrl = thumbnailBase64;
    }

    let slug = customSlug ? customSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "") : "";
    if (!slug) {
      let slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!slugBase) slugBase = "untitled";
      const uniqueSuffix = Date.now().toString().slice(-6);
      slug = `${slugBase}-${uniqueSuffix}`;
    }

    const plainText = content ? content.replace(/<[^>]+>/g, '') : "";
    const newBlog = {
      title,
      slug,
      content,
      excerpt: excerpt || (plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "")),
      authorName: authorName || "Shailraj Travels Editorial Team",
      category: category || "Travel Guides",
      thumbnailUrl: finalImageUrl || "/images/blogs/default.jpg",
      featuredImage: finalImageUrl || "/images/blogs/default.jpg",
      ogImage: finalImageUrl || "/images/blogs/default.jpg",
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || (plainText.substring(0, 160)),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : ["Travel Guide"]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isHidden: false,
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

    if (data.slug) {
      updateDoc.slug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "");
    }
    if (data.excerpt !== undefined) updateDoc.excerpt = data.excerpt;
    if (data.metaTitle !== undefined) updateDoc.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateDoc.metaDescription = data.metaDescription;
    if (data.tags !== undefined) {
      updateDoc.tags = Array.isArray(data.tags)
        ? data.tags
        : data.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    if (data.thumbnailBase64 && data.thumbnailBase64.startsWith('data:image')) {
      const uploadedUrl = await uploadImageToCloudinary(data.thumbnailBase64, "blogs");
      updateDoc.thumbnailUrl = uploadedUrl;
      updateDoc.featuredImage = uploadedUrl;
      updateDoc.ogImage = uploadedUrl;
    } else if (data.thumbnailUrl || (data.thumbnailBase64 && data.thumbnailBase64.startsWith('http'))) {
      const url = data.thumbnailUrl || data.thumbnailBase64;
      updateDoc.thumbnailUrl = url;
      updateDoc.featuredImage = url;
      updateDoc.ogImage = url;
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
