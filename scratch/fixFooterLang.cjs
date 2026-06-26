const fs = require("fs");

const files = [
  "src/routes/yatri-stories.tsx",
  "src/routes/mr/index.tsx",
  "src/routes/index.tsx",
  "src/routes/blog/tag/$tagSlug.tsx",
  "src/routes/blog/index.tsx",
  "src/routes/blog/category/$categorySlug.tsx",
  "src/routes/blog/author/$authorSlug.tsx",
  "src/routes/blog/$slug.tsx",
];

files.forEach((file) => {
  const content = fs.readFileSync(file, "utf8");
  // First, check if lang is available in the component. If not, maybe we can't just pass `lang={lang}`.
  // Actually, all these pages use `useLanguage()` to get `t`, so `const { lang } = useLanguage();` is almost certainly there.

  // Let's ensure `lang` is extracted if `t` is extracted.
  let newContent = content.replace(/<Footer t=\{t\} \/>/g, "<Footer t={t} lang={lang} />");

  // Ensure we have `lang` defined
  if (newContent !== content) {
    if (
      !newContent.includes("const { lang } = useLanguage()") &&
      newContent.includes("useLanguage()")
    ) {
      newContent = newContent.replace(
        /const\s*{\s*([^}]+)\s*}\s*=\s*useLanguage\(\)/g,
        (match, vars) => {
          if (!vars.includes("lang")) {
            return `const { lang, ${vars} } = useLanguage()`;
          }
          return match;
        },
      );
    }
    fs.writeFileSync(file, newContent, "utf8");
    console.log("Fixed", file);
  }
});
