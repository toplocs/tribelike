# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Tribelike project.

## deploy-client.yml

A reusable workflow for deploying the Tribelike client to GitHub Pages.

### Features

- ✅ **Automatic deployment** on push to main branch
- ✅ **Manual deployment** with custom base path option
- ✅ **Smart URL detection** for different GitHub Pages configurations
- ✅ **Works with any fork** - no hardcoded references
- ✅ **Custom domain support** - automatically detected
- ✅ **TypeScript workaround** for current build issues

### Usage

#### Automatic Deployment

The workflow runs automatically when you push to the main branch.

#### Manual Deployment

You can manually trigger deployment from the Actions tab:

1. Go to Actions → Deploy Client to GitHub Pages
2. Click "Run workflow"
3. (Optional) Enter a custom base path
4. (Optional) Enter Gun.js peer URLs (comma-separated)
   - Leave empty for local storage only (no sync)
   - Example: `https://example.com/gun,https://peer2.com/gun`
5. Click "Run workflow"

### Configuration

#### For Forks

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / (root)
   - Save

2. (Optional) Configure a custom domain in Pages settings

The workflow will automatically detect your repository structure and deploy accordingly.

#### Base Path

The workflow automatically determines the correct base path by querying the GitHub Pages API:

- **Custom domain**: Uses `/` (detected via Pages API)
- **User/Org pages** (`username.github.io`): Uses `/`
- **Project pages**: Uses `/repository-name`
- **Manual override**: Specify via workflow input

The workflow queries GitHub's Pages API to detect your actual deployment URL, ensuring correct base path detection even with custom domains configured in GitHub Pages settings.

#### Gun.js Peers

Control data synchronization:

- **Empty (default)**: Local storage only, no peer sync
- **Custom peers**: Comma-separated list of Gun.js peer URLs
- **Production example**: `https://yourdomain.com/gun`

Note: When empty, each deployment instance will have isolated data.

### How It Works

1. **Build Phase**:
   - Installs dependencies with pnpm
   - Builds client with `build-only` (skips TypeScript checking)
   - Builds server components

2. **Deploy Phase**:
   - Uploads build artifacts to GitHub Pages
   - Provides deployment URL in workflow output

### Troubleshooting

**Build fails with TypeScript errors**
- The workflow uses `build-only` to skip type checking
- This is temporary until upstream type issues are resolved

**Wrong deployment URL**
- Check your GitHub Pages settings
- Custom domains override the default URLs
- Use the manual trigger with custom base path if needed

**404 errors after deployment**
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes for the deployment to propagate
- Check that your base path matches your Pages configuration