# Feature your photo as a RYVENO model

The homepage hero and the editorial campaign automatically look for your photo here:

```
public/models/pose.jpg
```

Just save/copy your portrait to that exact filename. The site will pick it up on refresh — no code changes needed. If the file is missing, an editorial fashion photograph is shown instead.

Additional campaign portraits are stored here as `pose-1.jpg` and `pose-2.jpg`. They are used by the men's and exclusive-collection slides. Slide images are configured in `lib/slides.ts` — change the `image` and `focus` values there to swap any photograph.

For best results use a vertical image (roughly 4:5) of at least 1000px wide. If your photo is `pose.png`, change the filename to `pose.jpg` or update the path in `components/ModelPhoto.tsx`.
