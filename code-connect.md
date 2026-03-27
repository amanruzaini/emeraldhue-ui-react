# Code Connect setup

This repo already contains authored Code Connect mappings in `packages/components/src/**/*.figma.tsx`.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a Figma personal access token with:
   - `Code Connect` set to `Write`
   - `File content` set to `Read`

3. Export the token in your shell:

```bash
export FIGMA_ACCESS_TOKEN=your_token_here
```

4. Validate the mappings locally:

```bash
npm run code-connect:parse
```

5. Publish the mappings to Figma Dev Mode:

```bash
npm run code-connect:publish
```

6. Remove the published mappings later if needed:

```bash
npm run code-connect:unpublish
```

## GitHub connection in Figma

The GitHub connection is configured inside Figma's Code Connect UI, not in this repo.

1. Push this repo to GitHub.
2. Open the design library file in Figma Dev Mode.
3. Open `Library -> Connect components to code`.
4. In `Settings`, choose `Connect to GitHub`.
5. Select the repository and point Figma at `packages/components/src/components`.

Notes:
- Only one GitHub repository can be connected per Figma library file.
- This repo currently has no `git remote`, so source links in Figma will not resolve until the repository is pushed and a remote is configured.
