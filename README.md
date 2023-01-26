<div align="center">
  <a href="https://doppler.com">
    <img src="media/logo.png" alt="doppler-logo" height="35">
  </a>
  </br></br>
  <h1>Official Doppler Extension</h1>
  <h3 align="center">
    Edit your secrets where you edit your code, with 2 way sync. Autocomplete
    suggestions and hover enrichment when using environment variables in your codebase.
  </h3>
</div>

</br>

![Main Demo](media/demo.gif)

</br>

## Installation

You can install Doppler's extension by going to the VS Code marketplace. Once in VS Code:

1. Open the **Extensions** sidebar in VS Code. `View → Extensions`
2. Search for `Doppler`
3. Select `Doppler` and click **Install**

## Easy Setup

Now that the extension has been installed, start the setup process. This will install the Doppler CLI if needed, authenticate, and configure the given workspace folder with a Doppler project and config used for autocomplete suggestions and hover enrichment.

![Setup Demo](media/setup-demo.gif)

## Edit Secrets

In the Doppler sidebar, you will see a list of all your projects. When you click into a project, a list of its enviroments and configs are shown in the tree. Click on a config to edit its secrets.

When a config is clicked, a new file tab will open with your secrets in the format of a YAML file. This is a virtual file and is **not** stored on disk. To repeat, your secrets **never** touch storage, they only live in memory.

When you save the virtual file, the extension sends the changes to Doppler. Conversely, when changes are made in Doppler for a config, the virtual file in VS Code will update to reflect the changes.

![Edit Secrets Demo](media/edit-secrets-demo.gif)

## Autocomplete Suggestions

As you use environment variables (ex: `process.env` for javascript), your cursor will show an autocomplete modal populated with the name of the secrets in your config.

![Autocomplete Demo](media/autocomplete-demo.gif)

## Hover Enrichment

When your cursor hovers over an environment variable (ex: `ENV["SECRET_KEY"]`) we will show the value of secret.

![Peeking Demo](media/hover-demo.gif)

## Supported Languages

- JavaScript (React)
- TypeScript (React)
- PHP
- Java
- Python
- Go
- Rust
- Ruby
- CSharp

## Testing Releases

Installing a [release candidate](https://github.com/DopplerHQ/vscode/releases) is simple and fast.

### 1. Download the extension

In the release, click on `doppler.vsix` to download the extension.

### 2. Install Extension

In VS Code, open up the Marketplace tab. Then click on the 3 horizontal dots icon. Lastly select "Install from VSIX" from the dropdown.

![VS Code Install Extension](./media/vscode-install-extension.png)

## Contributing

If you want to contribute to this project, you can do so by forking the repository and submitting a pull request.

Feel free to open an issue if you find a bug or have a suggestion, but if you want to add support for a new language, please make sure to add a screenshot of the theme in action.

Also, if you like this theme, please consider giving it a ⭐️

## License

[Apache-2.0](https://github.com/dopplerhq/vscode/blob/main/LICENSE)
