# setup-swift

This action sets up a swift environment for use in actions by:

- optionally downloading and caching a version of swift by version and adding to PATH. Downloads from [](https://swift.org).

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@latest
- uses: TG908/setup-swift@v1
  with:
    version: '5.1.3'
    platform: 'ubuntu18.04'
- run: swift build
```