# setup-swift

This action sets up a swift environment for use in actions.
Supported platforms are: macOS, ubuntu-16.04, ubuntu-18.04
For available versions check the release section on [swift.org](https://swift.org/download/#releases).

# Usage

```yaml
steps:
- uses: actions/checkout@latest
- uses: TG908/setup-swift@v0
  with:
    version: '5.1.3'
- run: swift build
```
