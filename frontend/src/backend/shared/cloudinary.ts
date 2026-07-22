const CLOUD_NAME = "dquecn5qj";
const API_KEY = "912918221149553";
const API_SECRET = "2nz-n7M7UnXDw42pAjwS4tDg0H0";

async function sha1(str: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-1", enc.encode(str));
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const uploadImageToCloudinary = async (
  base64Str: string,
  folder: string,
): Promise<string> => {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const strToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const signature = await sha1(strToSign);

    const formData = new FormData();
    formData.append("file", base64Str);
    formData.append("folder", folder);
    formData.append("timestamp", timestamp);
    formData.append("api_key", API_KEY);
    formData.append("signature", signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudinary HTTP ${res.status}: ${errText}`);
    }

    const json = await res.json();
    return json.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
